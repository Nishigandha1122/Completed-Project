# Mirai Farm - Local Setup Guide

Advanced crop disease detection and farm assistant powered by AI and a Relational SQL backend.

## 🚀 Step-by-Step Setup

### 1. Requirements
- **Node.js** (v18.x or later)
- **NPM** (comes with Node.js)

### 2. Installation
Open your terminal in the project root and run:
```bash
npm install
```

### 3. Configuration (.env)
Create a `.env` file in the root directory:
```env
# Get your free key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# SQLite configuration
DATABASE_URL="file:./prisma/dev.db"

# JWT Secret for session security
JWT_SECRET="mirai_farm_local_secret"
```

### 4. Database Initialization
This project uses **Prisma** with **SQLite**. Run the following to create the database:
```bash
npx prisma generate
npx prisma db push
```

### 5. Running the App
Start the full-stack server (Vite + Express):
```bash
npm run dev
```

The app will now be running at: **http://localhost:3000**

## 🔑 Test Credentials
The project automatically seeds an admin account on the first run:
- **Email**: `admin@mirai.farm`
- **Password**: `admin123`

## 🛠 Tech Stack
- **Frontend**: React 19, Tailwind CSS 4, Framer Motion
- **Backend**: Node.js, Express, JWT
- **ORM**: Prisma
- **Database**: SQLite (Relational)
- **AI**: Google Gemini 1.5 Flash
