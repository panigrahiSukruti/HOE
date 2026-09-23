# 🚀 EduPulse AI: Next.js 16 Adaptive Learning & AI Tutor Platform

> **House of Edtech Developer Assignment 1 Solution**  
> *Developed by: Sukruti Panigrahi*

---

## 🌟 Executive Summary & Problem Solved

**EduPulse AI** goes far beyond basic CRUD applications (avoiding generic to-do/task lists as instructed in the submission guidelines). It is a full-stack, AI-augmented EdTech platform designed for interactive technical education, personalized skill assessment, and automated assignment grading.

Key highlights:
- **Next.js 16 App Router & Server Components**: Modern React 19 architecture with streaming and edge execution.
- **AI Integration**: Powered by Google Generative AI (Gemini 1.5 Flash) with fallback heuristic engines for AI Tutoring, AI Quiz Generation, and Code Submission Auto-Grading.
- **Database & Prisma ORM**: Relational persistence with SQLite out-of-the-box (zero configuration needed locally) and seamless PostgreSQL support via `DATABASE_URL`.
- **JWT & Role-Based Access Control (RBAC)**: Custom authentication with HttpOnly cookies, password hashing with bcrypt, Zod payload validation, and Edge Middleware route protection (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
- **Automated Testing Suite**: Built with Vitest for auth, validation, and AI module unit tests.
- **Automated CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yml`).

---

## 🛠️ Technology Stack & Architecture

- **Frontend & Backend Framework**: Next.js 16 (TypeScript) with React 19 & App Router.
- **Styling & UI**: Tailwind CSS, Glassmorphic Design Token System, Lucide Icons.
- **Database Layer**: Prisma ORM v5 (SQLite / PostgreSQL).
- **Authentication**: JWT signed via `jose`, HttpOnly Cookies, Bcrypt.js.
- **AI SDK**: `@google/generative-ai` with Heuristic Fallback Engine.
- **Testing**: Vitest test runner.
- **Documentation**: Generated PDF Report (`scripts/generate-pdf.js`).

---

## 🚀 Quick Start & Installation

### 1. Clone Repository & Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory (already provided with defaults):
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="edupulse-super-secret-jwt-key-2026"
GEMINI_API_KEY="" # Optional: If left blank, built-in Heuristic AI engine activates
```

### 3. Initialize & Seed Database
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 1-Click Evaluation Login Presets

For rapid assignment grading, use the 1-click preset buttons on the homepage/login screen:
- **Student Persona**: `student@edupulse.ai` / `student123`
- **Instructor Persona**: `instructor@edupulse.ai` / `instructor123`

---

## 🧪 Running Automated Tests

```bash
npm run test
```

---

## 📄 Generating PDF Assignment Report

```bash
npm run pdf:generate
```
This generates `EduPulse_AI_Project_Report.pdf` in the workspace root directory.

---

## 📌 Submission Guidelines Compliance Footer
The application footer includes candidate information:
- **Candidate Name**: Sukruti Panigrahi
- **GitHub Profile**: [https://github.com/panigrahiSukruti](https://github.com/panigrahiSukruti)
- **LinkedIn Profile**: [https://linkedin.com/in/sukruti-panigrahi-13b83610a](https://linkedin.com/in/sukruti-panigrahi-13b83610a)
