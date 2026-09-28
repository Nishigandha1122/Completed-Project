import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const JWT_SECRET =
  process.env.JWT_SECRET || "mirai_farm_development_secret_123";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // JWT Middleware logic
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- Auth Routes ---
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, firstName, lastName, mobile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, firstName, lastName, mobile },
      });
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
      );
      res.json({
        token,
        user: { id: user.id, email: user.email, firstName, lastName },
      });
    } catch (error) {
      res.status(400).json({ error: "User already exists or invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
      );
      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) return res.sendStatus(404);
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile,
    });
  });

  // --- Crop Scan Routes ---
  app.post("/api/crops/scan", authenticateToken, async (req: any, res) => {
    try {
      const { imageUrl, diseaseName, confidence, treatment, status } = req.body;
      const scan = await prisma.scan.create({
        data: {
          userId: req.user.userId,
          imageUrl,
          diseaseName,
          confidence,
          treatment,
          status,
        },
      });
      res.json(scan);
    } catch (error) {
      res.status(500).json({ error: "Failed to save scan" });
    }
  });

  app.get("/api/history", authenticateToken, async (req: any, res) => {
    const scans = await prisma.scan.findMany({
      where: { userId: req.user.userId },
      orderBy: { timestamp: "desc" },
    });
    res.json(scans);
  });

  app.delete("/api/history/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const scan = await prisma.scan.findUnique({ where: { id } });
      if (!scan || scan.userId !== req.user.userId) return res.sendStatus(403);
      await prisma.scan.delete({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Delete failed" });
    }
  });

  // --- Chatbot Routes ---
  app.post("/api/chatbot/log", authenticateToken, async (req: any, res) => {
    try {
      const { message, response } = req.body;
      const log = await prisma.chatLog.create({
        data: {
          userId: req.user.userId,
          message,
          response,
        },
      });
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to log chat" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", async () => {
    console.log(
      `Mirai Farm server (PostgreSQL/Relational) running at http://localhost:${PORT}`,
    );

    // Seed Admin User
    try {
      const adminExists = await prisma.user.findUnique({
        where: { email: "admin" },
      });
      if (!adminExists) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await prisma.user.create({
          data: {
            email: "admin",
            password: hashedPassword,
            firstName: "Admin",
            lastName: "User",
            role: "Admin",
          },
        });
        console.log("Admin user seeded: admin / admin123");
      }
    } catch (e) {
      console.error("Failed to seed admin", e);
    }
  });
}

startServer();
