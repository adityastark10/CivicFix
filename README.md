# CivicFix 🌿

> **CivicFix** is a civic engagement platform connecting citizens with local government bodies (municipalities, gram panchayats, and local wards) to report and resolve local infrastructure and civic issues.

---

## 📑 Table of Contents

- [Project Architecture](#-project-architecture)
- [Directory Structure](#-directory-structure)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Setup](#2-frontend-setup)
- [API Documentation](#-api-documentation)
  - [Health Check](#get-apihealth)
  - [User Registration](#post-apiauthregister)
  - [User Login](#post-apiauthlogin)
  - [Current User Profile](#get-apiauthme)
  - [List Users](#get-apiusers)
- [Database Schema (SQLite)](#-database-schema-sqlite)
- [Frontend Routes](#-frontend-routes)
- [Future Roadmap & Migrations](#-future-roadmap--migrations)

---

## 🏛️ Project Architecture

```
┌─────────────────────────────────┐           ┌─────────────────────────────────┐
│     Frontend (Vite + React)     │           │     Backend (Express.js API)    │
│     http://localhost:5173       │ ──/api/*─▶│      http://localhost:3001      │
│                                 │  (Proxy)  │                                 │
│  • /register                    │           │  • POST /api/auth/register      │
│  • /login                       │           │  • POST /api/auth/login         │
│  • /dashboard (Protected)       │           │  • GET  /api/auth/me (JWT)      │
└─────────────────────────────────┘           └────────────────┬────────────────┘
                                                               │
                                                               ▼
                                              ┌─────────────────────────────────┐
                                              │      SQLite Database (WAL)      │
                                              │    backend/civicfix.db          │
                                              │  • users (citizens)             │
                                              │  • sessions                     │
                                              └─────────────────────────────────┘
```

---

## 📂 Directory Structure

```
CivicFix/
├── backend/
│   ├── civicfix.db              # SQLite database file (created automatically)
│   ├── db.js                    # Database setup, pragmas (WAL mode), & schema creation
│   ├── server.js                # Express API entry point, auth routes, JWT issuance
│   ├── package.json             # Backend dependencies & npm scripts
│   ├── .env.example             # Template for backend environment variables
│   └── .gitignore               # Ignores civicfix.db, node_modules, .env
├── frontend/
│   ├── public/                  # Static assets & favicons
│   ├── src/
│   │   ├── assets/              # Icons and images
│   │   ├── pages/
│   │   │   ├── RegisterPage.tsx # Citizen registration form (Personal, Location, Security)
│   │   │   ├── RegisterPage.css # Dark theme UI styles
│   │   │   ├── LoginPage.tsx    # Citizen login page (+91 Phone + Password)
│   │   │   ├── LoginPage.css    # Login page styling
│   │   │   ├── DashboardPage.tsx# Post-login citizen dashboard & profile details
│   │   │   └── DashboardPage.css# Dashboard styling & info cards
│   │   ├── App.tsx              # React Router setup & route switch
│   │   ├── index.css            # Base global theme & typography
│   │   ├── main.tsx             # React entry point
│   │   └── vite-env.d.ts        # Vite client type definitions
│   ├── index.html               # Single Page Application HTML shell
│   ├── vite.config.ts           # Vite bundler config with `/api` reverse proxy to port 3001
│   ├── tsconfig.json            # TypeScript configuration
│   └── package.json             # Frontend dependencies & npm scripts
├── README.md                    # Project documentation
└── .gitignore                   # Root repository gitignore
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Theme**: Dark civic dashboard UI with custom CSS

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Server Framework**: [Express 5](https://expressjs.com/)
- **Database Engine**: [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) (synchronous, WAL mode)
- **Security**:
  - [bcryptjs](https://github.com/dcodeIO/bcrypt.js) (salted password hashing, 12 rounds)
  - [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) (stateless JWT tokens, 7-day validity)
  - [cors](https://github.com/expressjs/cors) (cross-origin access for localhost:5173)

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

---

## 🚀 Getting Started

To run the complete application locally, start both the backend and frontend servers in separate terminal tabs.

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# (Optional) Create environment variables
cp .env.example .env

# Start the server (runs on http://localhost:3001)
npm start

# Or run with auto-reload during development
npm run dev
```

The database (`civicfix.db`) and all necessary tables will be created automatically on the first run.

---

### 2. Frontend Setup

```bash
# Open a new terminal tab and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. All API requests to `/api/*` are automatically proxied to `http://localhost:3001`.

---

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

---

### `GET /api/health`
Health and connection status of the backend API and database.

**Response `200 OK`:**
```json
{
  "status": "ok",
  "database": "SQLite (better-sqlite3)",
  "totalUsers": 1
}
```

---

### `POST /api/auth/register`
Creates a new citizen profile and persists it into the `users` table.

**Request Body:**
```json
{
  "firstName": "Aarav",
  "lastName": "Patel",
  "phone": "9876543210",
  "aadhaar": "123456789012",
  "municipalityType": "urban",
  "municipality": "Ahmedabad Municipal Corporation",
  "ward": "12",
  "password": "SecurePassword123"
}
```

**Field Rules:**
- `phone`: exactly 10 digits
- `aadhaar`: exactly 12 digits (unique constraint)
- `municipalityType`: must be `"urban"` or `"rural"`
- `password`: minimum 8 characters

**Response `201 Created`:**
```json
{
  "message": "Account created successfully.",
  "user": {
    "id": "CF-1730570000000",
    "firstName": "Aarav",
    "lastName": "Patel",
    "phone": "9876543210",
    "municipalityType": "urban",
    "municipality": "Ahmedabad Municipal Corporation",
    "ward": "12",
    "createdAt": "2026-11-02 17:45:00"
  }
}
```

**Errors:**
- `400 Bad Request`: Missing fields or invalid format
- `409 Conflict`: Phone number or Aadhaar number already registered

---

### `POST /api/auth/login`
Authenticates citizen credentials and issues a signed JWT token.

**Request Body:**
```json
{
  "phone": "9876543210",
  "password": "SecurePassword123"
}
```

**Response `200 OK`:**
```json
{
  "message": "Login successful.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "CF-1730570000000",
    "firstName": "Aarav",
    "lastName": "Patel",
    "phone": "9876543210",
    "municipalityType": "urban",
    "municipality": "Ahmedabad Municipal Corporation",
    "ward": "12"
  }
}
```

**Errors:**
- `400 Bad Request`: Missing phone or password
- `401 Unauthorized`: Invalid phone number or password

---

### `GET /api/auth/me`
Fetches the authenticated citizen's profile.

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response `200 OK`:**
```json
{
  "id": "CF-1730570000000",
  "firstName": "Aarav",
  "lastName": "Patel",
  "phone": "9876543210",
  "municipalityType": "urban",
  "municipality": "Ahmedabad Municipal Corporation",
  "ward": "12",
  "createdAt": "2026-11-02 17:45:00"
}
```

---

### `GET /api/users`
*(Protected)* Lists all registered users (useful for administrative views and development inspection).

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🗄️ Database Schema (SQLite)

The schema is defined in [`backend/db.js`](backend/db.js) and initialized at application launch:

```sql
CREATE TABLE IF NOT EXISTS users (
  id                TEXT PRIMARY KEY,          -- Format: CF-<timestamp>
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  phone             TEXT NOT NULL UNIQUE,      -- 10-digit mobile number
  aadhaar           TEXT NOT NULL UNIQUE,      -- 12-digit national ID
  municipality_type TEXT NOT NULL              -- 'urban' | 'rural'
                      CHECK (municipality_type IN ('urban','rural')),
  municipality      TEXT NOT NULL,
  ward              TEXT NOT NULL,
  password_hash     TEXT NOT NULL,             -- bcrypt salted hash
  created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token_id          TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  issued_at         TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at        TEXT NOT NULL
);
```

---

## 🌐 Frontend Routes

| Path | View Component | Description |
|---|---|---|
| `/register` | [`RegisterPage.tsx`](frontend/src/pages/RegisterPage.tsx) | Complete citizen signup form with validation & live municipality filters |
| `/login` | [`LoginPage.tsx`](frontend/src/pages/LoginPage.tsx) | Phone + password login form with password visibility toggle |
| `/dashboard` | [`DashboardPage.tsx`](frontend/src/pages/DashboardPage.tsx) | Protected dashboard displaying citizen badge, ward, and account metadata |
| `*` | Redirect | Default fallback redirects any unmatched route to `/register` |

---

## 🔮 Future Roadmap & Migrations

- [ ] **Issue Reporting Module**: Citizens can submit complaints with photos, GPS coordinates, and categories (potholes, garbage, streetlights, water supply).
- [ ] **Authority Portal**: Municipal officers dashboard to assign tickets, update status (Pending, In Progress, Resolved), and notify citizens.
- [ ] **Oracle / PostgreSQL Support**: The abstraction in [`backend/db.js`](backend/db.js) makes swapping SQLite with an Oracle DB or PostgreSQL pool straightforward by modifying the prepared statements adapter.

