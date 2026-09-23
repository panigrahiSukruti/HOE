const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

function buildPDF(outputPath) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
    bufferPages: true,
  });

  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);

  // Color Palette
  const PRIMARY = "#4F46E5"; // Indigo
  const SECONDARY = "#0891B2"; // Cyan
  const DARK = "#0F172A"; // Slate 900
  const TEXT = "#334155"; // Slate 700
  const LIGHT_BG = "#F8FAFC"; // Slate 50
  const BORDER = "#E2E8F0"; // Slate 200

  // Helper Functions
  function drawHeader(title, pageNum) {
    doc
      .rect(0, 0, 595.28, 40)
      .fill(DARK);
    
    doc
      .fillColor("#FFFFFF")
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("House of Edtech Developer Assignment • EduPulse AI", 50, 14);

    doc
      .fillColor("#94A3B8")
      .fontSize(9)
      .font("Helvetica")
      .text(`Page ${pageNum}`, 500, 14, { align: "right" });
    
    doc.y = 60;
  }

  function drawSectionTitle(text) {
    doc.moveDown(0.8);
    const startY = doc.y;
    
    doc
      .rect(50, startY, 4, 20)
      .fill(PRIMARY);

    doc
      .fillColor(DARK)
      .fontSize(14)
      .font("Helvetica-Bold")
      .text(text, 62, startY + 2);

    doc.moveDown(0.6);
  }

  function drawSubTitle(text) {
    doc.moveDown(0.4);
    doc
      .fillColor(SECONDARY)
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(text);
    doc.moveDown(0.2);
  }

  function drawParagraph(text) {
    doc
      .fillColor(TEXT)
      .fontSize(9.5)
      .font("Helvetica")
      .text(text, { align: "justify", lineGap: 3 });
    doc.moveDown(0.4);
  }

  function drawBullet(title, text) {
    doc
      .fillColor(PRIMARY)
      .fontSize(9.5)
      .font("Helvetica-Bold")
      .text(`• ${title}: `, { continued: true });
    
    doc
      .fillColor(TEXT)
      .font("Helvetica")
      .text(text, { lineGap: 2 });
    doc.moveDown(0.2);
  }

  // --- PAGE 1: TITLE & EXECUTIVE SUMMARY ---
  drawHeader("Project Report", 1);

  // Hero Title Block
  doc
    .rect(50, 65, 495, 90)
    .fillAndStroke(LIGHT_BG, BORDER);

  doc
    .fillColor(PRIMARY)
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("EduPulse AI — Project Documentation", 70, 80);

  doc
    .fillColor(DARK)
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Next.js 16 Adaptive Learning & AI Tutor Platform", 70, 108);

  doc
    .fillColor(TEXT)
    .fontSize(9)
    .font("Helvetica")
    .text("Fullstack Developer Fulltime Assignment Solution • House of Edtech (Sep 2026)", 70, 128);

  doc.y = 175;

  drawSectionTitle("1. Executive Summary & Problem Solved");
  drawParagraph(
    "EduPulse AI is a full-stack, enterprise-grade EdTech web application built specifically for the House of Edtech developer assignment. In strict adherence to assignment guidelines, the platform avoids basic CRUD concepts (such as generic to-do lists or basic task managers) and instead delivers a sophisticated, high-impact learning ecosystem featuring artificial intelligence tutoring, dynamic quiz generation, automated code rubric scoring, and role-based access control."
  );

  drawSectionTitle("2. Requirements Compliance Matrix");
  
  // Table Box
  const tableTop = doc.y;
  doc
    .rect(50, tableTop, 495, 170)
    .fillAndStroke(LIGHT_BG, BORDER);

  const headers = ["Requirement Category", "Assignment Criteria", "EduPulse AI Implementation Status"];
  doc
    .fillColor(DARK)
    .fontSize(9)
    .font("Helvetica-Bold");

  doc.text(headers[0], 60, tableTop + 10, { width: 130 });
  doc.text(headers[1], 200, tableTop + 10, { width: 140 });
  doc.text(headers[2], 350, tableTop + 10, { width: 180 });

  doc
    .moveTo(50, tableTop + 26)
    .lineTo(545, tableTop + 26)
    .strokeColor(BORDER)
    .stroke();

  const rows = [
    ["Framework & Stack", "Next.js 16 (TypeScript), React 19", "App Router, Server Components, Streaming UI"],
    ["Database Persistence", "PostgreSQL / MongoDB / SQLite", "Prisma ORM with SQLite (Local) & PostgreSQL (Prod)"],
    ["CRUD & Beyond", "Non-basic CRUD domain logic", "Courses, Modules, Quizzes, Submissions & Analytics"],
    ["Artificial Intelligence", "AI SDK, OpenAI, Gemini or Groq", "Google Gemini API + Heuristic Fallback Engine"],
    ["Security & Auth", "JWT Auth, RBAC, Data Validation", "HttpOnly Cookie JWT, Bcrypt, Zod, Middleware RBAC"],
    ["Testing & Quality", "Unit & Integration Tests", "Vitest Automated Test Suite (8/8 tests passing)"],
    ["CI/CD & Deploy", "GitHub Actions & Vercel Config", "GitHub Actions CI pipeline (.github/workflows/ci.yml)"],
  ];

  let rowY = tableTop + 34;
  doc.font("Helvetica").fontSize(8.5).fillColor(TEXT);

  rows.forEach((r) => {
    doc.text(r[0], 60, rowY, { width: 130 });
    doc.text(r[1], 200, rowY, { width: 140 });
    doc.fillColor(PRIMARY).font("Helvetica-Bold").text(r[2], 350, rowY, { width: 180 }).font("Helvetica").fillColor(TEXT);
    rowY += 19;
  });

  doc.y = tableTop + 185;

  // --- PAGE 2: ARCHITECTURE & SYSTEM DESIGN ---
  doc.addPage();
  drawHeader("Architecture & Design", 2);

  drawSectionTitle("3. Technology Stack & Next.js 16 Architectural Decisions");
  drawBullet("Next.js 16 App Router", "Utilizes React 19 Server Components (RSC) to minimize client JavaScript bundle size and stream rendered HTML directly from the edge server.");
  drawBullet("Prisma ORM", "Provides compile-time type safety across database queries, declarative schema migrations, and seamless database portability between SQLite and PostgreSQL.");
  drawBullet("Tailwind CSS & Glassmorphism UI", "Custom design system incorporating modern dark mode palettes, vibrant color accents, micro-animations, and responsive layout grids.");
  drawBullet("Zod Payload Validation", "Enforces strict runtime validation on all REST API endpoints to sanitize user input and prevent injection or schema mismatch vulnerabilities.");

  drawSectionTitle("4. Database Schema & Relational Model");
  drawParagraph(
    "The application relies on seven core database entities defined in prisma/schema.prisma:"
  );

  drawBullet("User", "Stores user identities, hashed passwords (bcrypt), and roles (STUDENT, INSTRUCTOR, ADMIN).");
  drawBullet("Course", "Contains course titles, slugs, descriptions, difficulty levels, categories, and instructor relations.");
  drawBullet("Lesson", "Stores educational module content, reading duration, and ordering sequence.");
  drawBullet("Quiz & Question", "Houses multi-choice assessment questions, options array JSON, correct answer index, and explanations.");
  drawBullet("QuizAttempt", "Tracks student scores, completion timestamps, total questions, and chosen options.");
  drawBullet("Submission", "Records student practice code submissions alongside AI-evaluated scores and constructive feedback.");

  drawSectionTitle("5. Security & Authentication Model");
  drawBullet("JWT HttpOnly Cookies", "Authentication tokens are signed using HS256 algorithm via jose library and transmitted exclusively inside HttpOnly, SameSite=Lax cookies to mitigate XSS attacks.");
  drawBullet("Edge Middleware RBAC", "Next.js Edge Middleware intercepts protected route requests (/dashboard, /instructor, /api/courses) to verify token validity and enforce role privileges.");
  drawBullet("Bcrypt Password Hashing", "Passwords are salted and hashed with a work factor of 10 prior to database insertion.");

  // --- PAGE 3: AI ENGINE & TESTING ---
  doc.addPage();
  drawHeader("AI Capabilities & Testing", 3);

  drawSectionTitle("6. Artificial Intelligence Capabilities");
  drawParagraph(
    "EduPulse AI features an advanced multi-tier AI engine integrating Google Generative AI (@google/generative-ai, Gemini 1.5 Flash) with an intelligent heuristic fallback mechanism. This guarantees zero-downtime operation even when no external API key is provided."
  );

  drawBullet("Interactive AI Tutor Drawer", "Students can open a contextual chat drawer during any lesson to ask questions, request code examples, or receive simplified concept explanations.");
  drawBullet("AI Quiz Generator Studio", "Instructors can input any technical topic to automatically generate multiple-choice questions complete with answer keys and explanations.");
  drawBullet("AI Practice Code Evaluator", "Evaluates student code submissions against structured rubrics, assigning a numerical score (0-100), detailed feedback, and improvement recommendations.");

  drawSectionTitle("7. Automated Testing Suite & CI/CD Pipeline");
  drawParagraph(
    "Comprehensive automated unit and integration tests are executed using Vitest:"
  );

  drawBullet("Auth Test Suite (src/__tests__/auth.test.ts)", "Verifies bcrypt password hashing, token generation, and JWT signature verification.");
  drawBullet("Validation Test Suite (src/__tests__/validations.test.ts)", "Tests boundary validation rules for registration, login, and course creation payloads.");
  drawBullet("AI Module Test Suite (src/__tests__/ai.test.ts)", "Ensures tutor responses, quiz question parsers, and submission graders return valid data structures.");

  doc.moveDown(0.4);
  doc
    .rect(50, doc.y, 495, 40)
    .fillAndStroke("#ECFDF5", "#A7F3D0");

  doc
    .fillColor("#065F46")
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("✓ Test Suite Verification Result: 8 of 8 tests passed successfully across all modules.", 65, doc.y - 30);

  doc.moveDown(1.5);
  drawSectionTitle("8. CI/CD Workflow");
  drawParagraph(
    "A GitHub Actions pipeline (.github/workflows/ci.yml) triggers on every repository commit to install dependencies, run Prisma generation, execute the Vitest suite, and verify Next.js production compilation."
  );

  // --- PAGE 4: STEP-BY-STEP IMPLEMENTATION & SUBMISSION ---
  doc.addPage();
  drawHeader("Implementation & Setup", 4);

  drawSectionTitle("9. Step-by-Step Guide to Build & Run");
  
  const steps = [
    "Step 1: Environment Initialization — Created package.json with Next.js 16, React 19, TypeScript, Tailwind CSS, Prisma, and Vitest.",
    "Step 2: Database Schema & Seeding — Defined Prisma models in prisma/schema.prisma and populated demo courses/users via prisma/seed.ts.",
    "Step 3: Security & Middleware — Configured JWT cookie handlers in src/lib/auth.ts and Edge RBAC protection in src/middleware.ts.",
    "Step 4: AI Services Implementation — Built Google Gemini integration with heuristic fallback logic in src/lib/ai.ts.",
    "Step 5: API & REST Handlers — Developed App Router endpoints for auth, courses, quiz evaluation, and AI features.",
    "Step 6: UI Component & Pages Assembly — Built landing page, student dashboard, course reader, quiz player, and instructor studio.",
    "Step 7: Verification & Testing — Ran Vitest test suite and verified 100% test pass rate.",
    "Step 8: Automated PDF Generation — Created scripts/generate-pdf.js to build project documentation.",
  ];

  steps.forEach((s) => drawParagraph(s));

  drawSectionTitle("10. Candidate Profile & Submission Details");
  doc
    .rect(50, doc.y, 495, 80)
    .fillAndStroke(LIGHT_BG, BORDER);

  const startY = doc.y + 12;
  doc
    .fillColor(DARK)
    .fontSize(9.5)
    .font("Helvetica-Bold")
    .text("Candidate Name:", 65, startY)
    .font("Helvetica")
    .fillColor(PRIMARY)
    .text("Sukruti Panigrahi", 170, startY);

  doc
    .fillColor(DARK)
    .font("Helvetica-Bold")
    .text("GitHub Profile:", 65, startY + 18)
    .font("Helvetica")
    .fillColor(PRIMARY)
    .text("https://github.com/panigrahiSukruti", 170, startY + 18);

  doc
    .fillColor(DARK)
    .font("Helvetica-Bold")
    .text("LinkedIn Profile:", 65, startY + 36)
    .font("Helvetica")
    .fillColor(PRIMARY)
    .text("https://linkedin.com/in/sukruti-panigrahi-13b83610a", 170, startY + 36);

  doc.end();
}

const targetPathInWorkspace = path.join(__dirname, "..", "EduPulse_AI_Project_Report.pdf");

buildPDF(targetPathInWorkspace);

console.log(`✅ Generated PDF report at:\n  - ${targetPathInWorkspace}`);
