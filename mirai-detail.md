# 🌿 Mirai Farm: Complete Project Documentation & Setup Guide

Mirai Farm is a high-tech agricultural companion application designed to empower farmers with AI-driven crop health diagnostics, real-time weather insights, and an intelligent relational farm assistant.

---

## 📖 Project Overview

The mission of Mirai Farm is to bridge the gap between traditional farming and modern computer vision. By leveraging **Google Gemini AI**, farmers can instantly identify diseases and receive scientific treatment plans.

### Key Capabilities:

- **AI Crop Scanner**: Instant disease detection from camera or photo uploads.
- **Relational History**: A persistent log of all farm diagnostics stored in PostgreSQL.
- **Mirai Assistant**: A chatbot trained on agricultural data to answer complex farming queries.
- **Weather Dashboard**: Real-time localized weather data for better planning.
- **Secure Access**: JWT-based authentication system with role-based access.

---

## 🛠 Tech Stack Architecture

### 1. Frontend (The Client)

- **Framework**: React 19 (Modern functional components)
- **Styling**: Tailwind CSS 4 (Utility-first, responsive design)
- **Animations**: Framer Motion / Motion (Smooth route transitions and UI feedback)
- **Icons**: Lucide React
- **Markdown**: React-Markdown (To render AI treatment plans)

### 2. Backend (The API)

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs for password security
- **ORM**: Prisma (Type-safe SQL query builder)

### 3. Database (The Storage)

- **Type**: PostgreSQL (Relational)
- **Schema**:
  - `User`: Handles identity, roles, and credentials.
  - `Scan`: Logs every crop diagnostic with image metadata, disease names, and treatment notes.
  - `ChatLog`: Stores interactions with the AI assistant.

### 4. Artificial Intelligence

- **Model**: Google Gemini 1.5 Flash
- **Logic**: Multimodal image analysis and natural language processing.

---

## 🚀 Step-by-Step Local Setup Guide

### 1. System Prerequisites

Ensure your computer has the following installed:

- **Node.js** (v18.0.0 or higher)
- **NPM** (comes with Node.js)
- **PostgreSQL** (A running instance locally or via cloud providers like Supabase/Neon)

### 2. Prepare the Files

Clone or download the project folder. Open your terminal in the root directory and install dependencies:

```bash
npm install
```

### 3. Configure the Environment (`.env`)

You must create a `.env` file in the root directory. This file connects your app to the AI and the Database.

```env
# 1. AI: Get a free key at https://aistudio.google.com/
GEMINI_API_KEY="PASTE_YOUR_KEY_HERE"

# 2. Database: Your PostgreSQL connection string
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
DATABASE_URL="YOUR_POSTGRES_CONNECTION_STRING"

# 3. Security: Any random long string for encryption
JWT_SECRET="mirai_farm_unique_secret_key"
```

### 4. Initialize the Relational Database

Sync your PostgreSQL database with the project's data definitions:

```bash
npx prisma generate
npx prisma db push
```

### 5. Running the Application

Launch both the backend server and frontend development environment with one command:

```bash
npm run dev
```

The application will launch at: **`http://localhost:3000`**

---

## 🔑 Login & Access Control

### Testing Credentials

The server is programmed to automatically "seed" (create) a primary admin account on the first launch:

- **Login ID**: `admin`
- **Password**: `admin123`

### Security Flow

1. **User Login**: User submits `admin` and `admin123`.
2. **Verification**: Backend checks the hashed password in PostgreSQL.
3. **Token Issue**: A JWT is generated and sent to the browser.
4. **Persistent Session**: The browser stores the token in `localStorage`.
5. **Authorized Requests**: Every future scan or chat message sends this token in the header for verification.

---

## 🧪 Operational Workflow

### How the AI Scanner Works

1. **Capture**: The user takes a photo of a sick plant leaf.
2. **Encoding**: The frontend converts the image to a `Base64` string.
3. **AI Request**: The image is sent to the Gemini API with a specialized "Agriculture Specialist" prompt.
4. **Processing**: Gemini identifies the disease and generates a treatment plan.
5. **Persistence**: The backend saves the image URL, disease name, and treatment details into the `Scan` table in PostgreSQL.
6. **Delivery**: The results are displayed to the user using beautiful Markdown formatting.

---

## 📈 Future Scalability

- **Multilingual Support**: Translating AI responses into local regional languages.
- **Expert Connect**: Integrating live video calls with real agricultural scientists.
- **IoT Integration**: Syncing with soil moisture sensors to provide proactive alerts.

---

_Documentation generated for Mirai Farm - April 2026_
