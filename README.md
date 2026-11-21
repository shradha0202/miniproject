# VICTORY: A Web-Based Pharmaceutical Verification System Using QR Codes and Ed25519 Digital Signatures

[![Technology Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20PostgreSQL%20%7C%20Ed25519-10b981.svg)](#technology-stack)
[![Tests](https://img.shields.io/badge/Tests-17%20Passed-emerald.svg)](#testing)
[![License](https://img.shields.io/badge/License-Academic-blue.svg)](#academic-mini-project)

---

## 1. Project Overview & Identity

**Project Name**: **VICTORY**  
**Full Project Title**: *A Web-Based Pharmaceutical Verification System Using QR Codes and Ed25519 Digital Signatures*  
**Academic Context**: 3rd-Year Information Science and Engineering Mini-Project (2 Credits)

### Main Objective
Develop a decentralized, high-security web application that allows consumers, pharmacists, and health regulators to independently verify pharmaceutical product authenticity and provenance using **high-density 2D QR codes** and **Ed25519 asymmetric cryptographic digital signatures**, integrated with official regulatory quality alerts from the **Central Drugs Standard Control Organisation (CDSCO)**.

### Crucial Security Principle
> **IMPORTANT SECURITY PRINCIPLE**:  
> A valid Ed25519 signature proves the integrity and origin of a signed digital record. It does **NOT** independently prove that the physical medicine is genuine.  
> *(This clarification is displayed prominently on all verification views).*

---

## 2. Technology Stack

- **Frontend**:
  - React.js 18 + Vite + TypeScript
  - Tailwind CSS (Deep Black `#07090e` / Emerald Accent `#10b981`)
  - React Router DOM v6
  - Axios HTTP Client with Interceptors
  - `@zxing/browser` for Live Camera QR Scanning & Image Decoders
  - Web Speech API (`SpeechSynthesis`) for Bilingual Voice Assistance
  - English & Kannada (`en` / `kn`) Language Support
- **Backend**:
  - Node.js + Express.js + TypeScript
  - MVC Architecture (Controllers, Services, Models, Routes, Validators)
  - Native Node.js `crypto` module (Ed25519 Elliptic Curve Keygen, Signing & Verification)
  - `jsonwebtoken` & `bcryptjs`
  - `qrcode` for High-Density 2D QR Generation
  - `express-rate-limit` & `helmet`
- **Database**:
  - PostgreSQL Relational Database (tested on PostgreSQL 18.4 x64)
  - UUID Primary Keys (`pgcrypto.gen_random_uuid()`)
  - Parameterized Queries with Connection Pooling (`pg`)
  - SQL Schema Migrations & Seeding Scripts
- **External Data Integrations**:
  - **Indian Pharma Dataset** (`revooda/indian-pharma-data`) as initial medicine master catalogue
  - **CDSCO NSQ Drug Alerts** (`cdsco_nsq_alerts`) as regulatory failure reference registry

---

## 3. Three User Roles & Portals

### A. Regulatory Administrator (`admin`)
- Secure authentication via CLI setup command (`npm run init-admin`)
- Real-time dashboard KPI analytics (active manufacturers, signed batches, verification trends)
- Manufacturer license verification: Approve (generates Ed25519 keys), Reject, or Suspend
- Medicine Master Catalogue CRUD + Indian Pharma Dataset CSV import
- System-wide batch inspection & verification scan audit logs
- Citizen incident reports review & investigation tracking
- CDSCO Not of Standard Quality (NSQ) alert registry management

### B. Pharmaceutical Manufacturer (`manufacturer`)
- Company registration with Drug Manufacturing License
- Real-time approval status tracking (Pending -> Approved)
- Ed25519 cryptographic key inspection (SPKI Public Key PEM stored in DB, private key isolated in server vault)
- Batch registration with lifecycle validation (Expiry > Manufacturing date)
- Deterministic canonical payload generation & Ed25519 signature generation
- High-density QR code generation & PNG download
- Controlled batch revision system

### C. Citizen / Consumer (`user` & Guest)
- **Guest Verification**: Scan and verify medicines instantly without account creation
- Camera-based QR scanner using device back camera + image upload fallback
- Manual 36-character Serial ID (UUID) input
- 12-point comprehensive verification result card
- Safety alerts, expiry warnings, duplicate scan warnings, and matching CDSCO quality failures
- Bilingual Voice Assistant in English and Kannada
- Personal verification scan history & suspicious medicine incident reporting

---

## 4. Project Directory Structure

```
VICTORY/
├── backend/
│   ├── .env.example
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── config/
│   │   │   └── index.ts
│   │   ├── controllers/        # API request handlers
│   │   │   ├── admin.controller.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── cdsco.controller.ts
│   │   │   ├── manufacturer.controller.ts
│   │   │   ├── medicine.controller.ts
│   │   │   ├── report.controller.ts
│   │   │   └── verification.controller.ts
│   │   ├── database/           # PostgreSQL pool, migration, and seed
│   │   │   ├── db.ts
│   │   │   ├── migrate.ts
│   │   │   └── seed.ts
│   │   ├── middleware/         # Authentication, errors, and rate limiting
│   │   ├── routes/             # REST API route declarations
│   │   ├── scripts/            # Admin and data-import CLI utilities
│   │   ├── services/           # Cryptography, QR generation, and verification
│   │   ├── test/               # Backend test runner
│   │   ├── types/              # Shared TypeScript types
│   │   ├── validators/         # Request validation schemas
│   │   ├── app.ts              # Express application setup
│   │   └── server.ts           # HTTP server bootstrap
├── database/
│   └── schema.sql              # PostgreSQL schema
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_DOCUMENTATION.md
│   ├── SECURITY_DOCUMENTATION.md
│   └── TESTING_DOCUMENTATION.md
├── frontend/
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── components/         # Shared UI components
│       ├── context/            # Authentication and language state
│       ├── i18n/               # English and Kannada translations
│       ├── pages/
│       │   ├── admin/          # Administrator portal
│       │   ├── manufacturer/   # Manufacturer portal
│       │   ├── user/           # Consumer portal
│       │   ├── About.tsx
│       │   ├── Home.tsx
│       │   ├── HowItWorks.tsx
│       │   ├── Login.tsx
│       │   ├── RegisterManufacturer.tsx
│       │   ├── RegisterUser.tsx
│       │   └── VerifyMedicine.tsx
│       ├── services/           # API client
│       ├── App.tsx             # Routes and page layouts
│       ├── index.css
│       └── main.tsx            # Frontend entry point
├── sample-data/
│   ├── medicines_template.csv
│   ├── sample_cdsco_alerts.csv
│   └── sample_medicines.csv
├── scripts/
│   ├── import-cdsco-alerts.ts
│   ├── import-medicine-dataset.ts
│   └── init-admin.ts
├── .env.example                # Root environment configuration template
├── .gitignore
├── package-lock.json
├── package.json                # Root project scripts
├── PROJECT_PROGRESS.md
└── README.md
```

---

## 5. Setup & Local Execution Guide (Windows / Linux / macOS)

### Prerequisites
1. **Node.js** (v18 or higher; tested on Node.js v24.21.0)
2. **PostgreSQL** (v14 or higher; tested on PostgreSQL 18.4)
3. **npm** (v9 or higher)

---

### Step 1: Database Setup
1. Start your PostgreSQL service.
2. Create the project database:
   ```bash
   createdb -U postgres victory_db
   ```
3. Configure `backend/.env` (defaults are pre-configured):
   ```env
   PORT=5000
   DB_HOST=127.0.0.1
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=victory_db
   JWT_SECRET=super_secret_victory_jwt_key_2026
   KEYS_STORAGE_DIR=../keys
   ```

---

### Step 2: Install Dependencies & Run Database Migration
From the project root:
```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Run schema migration (creates tables, indexes, constraints)
npm run migrate

# 3. Seed database with Admin, test manufacturers, active Ed25519 keys, and medicines
npm run seed
```

---

### Step 3: Initialize or Reset System Admin (CLI)
Public admin registration is blocked for security. Initialize the administrator account using:
```bash
# In backend directory:
npm run init-admin
```
Default Administrator Credentials:
- **Email**: `admin@victory.pharma`
- **Password**: `Admin@12345`

Other Default Seeded Accounts:
- **Approved Manufacturer (Cipla Ltd)**: `mfg@cipla.com` / `Mfg@12345`
- **Pending Manufacturer (Sun Pharma)**: `mfg@sunpharma.com` / `Mfg@12345`
- **Citizen User**: `user@example.com` / `User@12345`

---

### Step 4: Run Automated Test Suite
Verify that all 17 backend cryptographic, RBAC, and verification checks pass:
```bash
cd backend
npm test
```

---

### Step 5: Start the Backend API Server
```bash
cd backend
npm run dev
# Server will run on: http://localhost:5000/api/v1
# Health check: http://localhost:5000/api/v1/health
```

---

### Step 6: Install & Start the Frontend Web Application
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend will run on: http://localhost:5173
```

Open **`http://localhost:5173`** in your browser.

---

## 6. Verification Flow & Testing Instructions

1. **Test Valid Medicine**:
   - Navigate to `http://localhost:5173/verify`
   - Paste the seed batch serial ID: `47ff01a4-4ad6-4792-91fd-196b00bd15e8`
   - Click **Verify**
   - Result: Shows **VERIFIED GENUINE RECORD** in emerald green with full formulation, manufacturer info, and valid Ed25519 cryptographic signature.
2. **Test Expired Medicine**:
   - Paste seed serial ID: `4b843f2c-873c-4b31-a34c-4e9f6b18958f`
   - Result: Shows **EXPIRED MEDICINE** alert banner.
3. **Test Tampered / Forged Signature**:
   - Paste seed serial ID: `f934a4e5-1832-4ffc-ac26-1b112bec4282`
   - Result: Shows **INVALID DIGITAL SIGNATURE** alert in crimson red.
4. **Test Camera QR Scanning**:
   - Click **Verify Medicine** in the top navigation bar.
   - Point your mobile camera at any generated batch QR code.
5. **Test Bilingual Kannada Toggle**:
   - Click the **Language (ಕನ್ನಡ)** pill in the top header to instantly switch all labels, navigation, and warnings to Kannada.
6. **Test Voice Assistant**:
   - Click the **Listen** button on any verification result to hear the text-to-speech engine read the verdict and warnings.

---

## 7. Academic Mini-Project Submission Notice

This software was engineered as a 2-credit academic mini-project demonstrating:
- Real asymmetric cryptography in web applications (`Ed25519`)
- Relational database normalization in PostgreSQL
- Role-based access control and security best practices
- Multi-channel accessibility (voice and regional Indian language support)
- Public health regulatory integration (CDSCO NSQ alerts)
