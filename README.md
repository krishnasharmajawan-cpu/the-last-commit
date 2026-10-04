# THE LAST COMMIT · Hackathon Platform (Second Year Submission)

> **48 Hours. 00:00:00 Deadline. Merge or Die.**  
> A complete, production-grade full-stack hackathon platform built with **Node.js, TypeScript, Express, SQLite, React, and Tailwind CSS**.

---

## ⚡ What Has Been Built

### 1. Frontend (Visually Impressive, Interactive & Animated)
- **Aesthetic**: Apocalyptic midnight cyber-terminal, neon emerald (`#00ff88`), electric cyan (`#00f0ff`), radioactive amber (`#f59e0b`), scanline overlays, and responsive mobile-first layout.
- **Interactive Particle Git Constellation**: HTML5 Canvas animation responding dynamically to mouse proximity.
- **Synthesized Cyber Audio FX**: Web Audio API oscillator synthesizing custom laser chirps, keystroke clicks, and chimes without external MP3 dependencies (with an instant mute toggle).
- **Interactive Developer CLI Terminal (`last-commit:~$`)**:
  - Live bash interpreter supporting `help`, `register`, `tracks`, `prizes`, `schedule`, `stats`, `git status`, `clear`.
  - Directly queries live stats from the backend Node.js API!
- **Interactive Git Commit Tree & Roadmap**:
  - Visual commit history with interactive branches (`main`, `track/systems`, `track/ai`, `track/security`), commit SHAs, and milestone inspection.
- **4 Technical Engineering Tracks**:
  - ⚡ **Kernel Panic** (Systems, Low-Level, Rust/Zig, OS)
  - 🧠 **Neural Breach** (Autonomous Agents, Edge LLMs)
  - 🌐 **Zero-Day Web** (P2P Protocols, CRDTs, Distributed Web3)
  - 🛡️ **Cyber Fortress** (Zero-Knowledge, Enclaves, Binary Exploits)
- **Live 48-Hour Ticking Countdown**: Synchronized countdown timer with cyber frame styling.
- **$25,000 Prize Pool Showcase**: Holographic podium cards for Grand Champion, Runner-up, Bronze Hacker, and Track Bounties.
- **Rules, FAQ Accordion & Sponsor Grid**: Collapsible, searchable questions covering IP ownership, eligibility, and catering.

---

### 2. Full-Stack Registration & Ticket Generation System
- **Registration Flow**:
  - Solo Hacker or Multi-Member Squad (2 to 4 members with dynamic fields).
  - Validation: Email uniqueness, mandatory fields, institution name, year of study, experience level, T-shirt size, dietary needs, GitHub & LinkedIn URLs, and elevator pitch.
- **Minted Cyber Boarding Pass / Ticket**:
  - Generates unique ticket code (e.g. `TLC-2026-0009-3KNH`).
  - Generates an authentic **scannable QR Code** rendered on HTML Canvas.
  - Confetti explosion upon confirmation.
  - One-click "Copy Ticket Code" and "Save/Print Pass" buttons.

---

### 3. Backend (Node.js + TypeScript + Database)
- **Clean Architecture**:
  - `server/src/controllers/` (Registration logic, Admin analytics, CSV exporter)
  - `server/src/routes/` (RESTful API routes)
  - `server/src/database/` (SQLite database engine, tables schema, seeding)
  - `server/src/middlewares/` (JWT Bearer authentication, request logger)
- **Database Engine**:
  - Embedded SQLite WASM engine with ACID persistence directly to `data/the_last_commit.sqlite`.
  - Runs out of the box with zero native C++ compiler dependencies on any OS (Windows, Linux, macOS).
  - Automatic database initialization and seeding of realistic hackathon demo participants.
- **Admin JWT Authentication**:
  - Bcrypt password hashing and JWT token generation with 7-day expiration.
  - Default Admin Credentials:
    - **Email**: `admin@thelastcommit.dev`
    - **Password**: `LastCommit2026!`

---

### 4. Hackathon Organizer Command Center (Admin Portal)
- Accessible by clicking the **`[ ORGANIZERS ]`** button in the header.
- **Organizer Intelligence & Analytics Dashboard**:
  - **KPI Metrics**: Total Registrations, Total Hackers, Occupancy Rate (% of 300 participant cap), Venue Attendance (Checked-In rate), Waitlisted & Pending counts.
  - **Track Distribution**: Real-time breakdown of hacker interests for room & mentor planning.
  - **Academic Demographics**: Breakdown by year of study (1st, 2nd, 3rd, 4th year, Postgrad).
  - **T-Shirt Procurement Counter**: Exact count per size (`S`, `M`, `L`, `XL`, `2XL`) for merchandise orders.
  - **Dietary Catering Headcount**: Exact meals breakdown (`Vegetarian`, `Non-Vegetarian`, `Vegan`, `Jain`, `Halal`) for food vendors.
  - **Top Institutions Leaderboard**: Institutional representation metrics.
- **Attendee Management & Venue Check-In Table**:
  - Global search by participant name, email, college, ticket code, or team.
  - Filter by Track, Status, or Year.
  - **Real-Time Venue Check-In Switcher**: Mark hackers as `CHECKED_IN` at the door.
  - **Badge Inspector**: View any attendee's full ticket and QR code.
  - **CSV Export**: One-click download of all participant data (`the-last-commit-registrations.csv`).
  - **Seed Demo Hackers Button**: Adds realistic hackers on the fly to watch analytics update dynamically!

---

## 🚀 How to Run Locally

### Option 1: Run the Production Full-Stack Build (Already Compiled!)
The full application is already built and ready:
```bash
npm start
```
Open **`http://localhost:5000`** in your browser!

### Option 2: Run Development Mode (Vite + TSX Hot-Reloading)
In two terminal tabs:
```bash
# Terminal 1: Backend Server (Port 5000)
npm run dev:server

# Terminal 2: Frontend Client (Port 3000)
npm run dev:client
```
Visit **`http://localhost:3000`**. Vite automatically proxies `/api` calls to the Node.js backend.

---

## 🌐 How to Deploy (Mandatory Requirement)

You can deploy the complete project for free in under 3 minutes using **Render**, **Railway**, or **Vercel**:

### 🌟 Deploying on Render (Recommended & Free)
1. Push this project to your GitHub repository:
   ```bash
   git remote add origin https://github.com/<your-username>/the-last-commit.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [render.com](https://render.com) and click **New + > Web Service**.
3. Select your GitHub repository.
4. Render will automatically detect `render.yaml`, or configure:
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Click **Deploy Web Service**! Your live URL (e.g. `https://the-last-commit.onrender.com`) will be active.

### 🌟 Alternative: Deploying on Railway
1. Go to [railway.app](https://railway.app) and select **Deploy from GitHub repo**.
2. Railway will automatically detect the included [Dockerfile](file:///c:/Users/adity/Downloads/Krishna/Dockerfile) and build both the frontend and backend in a high-speed container!
3. Click **Generate Domain** to get your public live URL.

---

## 🔐 Admin Credentials Summary
- **Login URL**: Click **`[ ORGANIZERS ]`** in the navigation bar.
- **Email**: `admin@thelastcommit.dev`
- **Password**: `LastCommit2026!`
