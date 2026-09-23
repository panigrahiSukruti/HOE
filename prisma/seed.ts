import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database for EduPulse AI...");

  // Clean existing tables
  await db.submission.deleteMany();
  await db.quizAttempt.deleteMany();
  await db.question.deleteMany();
  await db.quiz.deleteMany();
  await db.lesson.deleteMany();
  await db.course.deleteMany();
  await db.user.deleteMany();

  const hashedStudentPassword = await bcrypt.hash("student123", 10);
  const hashedInstructorPassword = await bcrypt.hash("instructor123", 10);

  // 1. Create Users
  const student = await db.user.create({
    data: {
      name: "Alex Rivera",
      email: "student@edupulse.ai",
      passwordHash: hashedStudentPassword,
      role: "STUDENT",
    },
  });

  const instructor = await db.user.create({
    data: {
      name: "Dr. Sarah Chen",
      email: "instructor@edupulse.ai",
      passwordHash: hashedInstructorPassword,
      role: "INSTRUCTOR",
    },
  });

  console.log(`Created users: Student (${student.email}), Instructor (${instructor.email})`);

  // 2. Create Course 1: Full-Stack Next.js 16 Mastery
  const course1 = await db.course.create({
    data: {
      title: "Next.js 16 & Server Components Mastery",
      slug: "nextjs-16-mastery",
      description: "Master modern full-stack development with Next.js 16 App Router, React 19 Server Components, Tailwind CSS, and Prisma ORM.",
      category: "Web Development",
      difficulty: "Intermediate",
      published: true,
      instructorId: instructor.id,
      lessons: {
        create: [
          {
            title: "App Router & React 19 Server Architecture",
            orderIndex: 1,
            durationMinutes: 20,
            content: `Next.js 16 redefines modern web architecture by rendering React Server Components (RSC) directly on the edge server.
Key Architectural Pillars:
1. **Server First**: Components render on the server by default, reducing client JavaScript overhead.
2. **Streaming & Suspense**: Break UI into chunked HTTP streams for instantaneous loading states.
3. **Route Handlers**: Built-in API endpoints standardizing RESTful paradigms directly alongside React routes.`,
          },
          {
            title: "Prisma ORM & SQLite/PostgreSQL Database Persistence",
            orderIndex: 2,
            durationMinutes: 25,
            content: `Databases form the persistence core of scalable applications.
Prisma ORM offers:
- Full end-to-end type safety auto-generated from \`schema.prisma\`.
- Declarative relation modeling (One-to-Many, Many-to-Many).
- Seamless migration management from SQLite in development to PostgreSQL in production.`,
          },
          {
            title: "Security, JWT Auth & RBAC Middleware",
            orderIndex: 3,
            durationMinutes: 30,
            content: `Security is non-negotiable in production EdTech software.
Implementations:
- **JWT tokens** signed with HMAC SHA-256 stored exclusively in \`HttpOnly\` cookies.
- **Edge Middleware** inspecting token payloads before allowing access to \`/dashboard\` or \`/instructor\` routes.
- **Zod validation schemas** sanitizing and asserting data boundaries at every API route boundary.`,
          },
        ],
      },
      quizzes: {
        create: [
          {
            title: "Next.js 16 Core Knowledge Assessment",
            description: "Evaluate your understanding of Server Components, Prisma database integration, and security practices.",
            timeLimitMinutes: 10,
            questions: {
              create: [
                {
                  questionText: "Why are React Server Components used by default in Next.js 16 App Router?",
                  optionsJson: JSON.stringify([
                    "To send zero client-side JS for pure server rendering",
                    "To force all components to use Redux global state",
                    "To disable server-side API routing",
                    "To prevent CSS styling from loading"
                  ]),
                  correctAnswer: 0,
                  explanation: "RSCs execute on the server and stream lightweight HTML to the client without shipping server component dependencies in the JavaScript bundle.",
                },
                {
                  questionText: "What cookie configuration is mandatory for securing JWT authentication tokens against XSS attacks?",
                  optionsJson: JSON.stringify([
                    "localStorage with document.cookie access",
                    "HttpOnly, Secure, and SameSite=Lax flags",
                    "Plaintext query parameter in URL",
                    "Disabling all cookie headers"
                  ]),
                  correctAnswer: 1,
                  explanation: "HttpOnly cookies prevent JavaScript execution contexts from accessing sensitive JWT tokens, mitigating XSS risks.",
                },
                {
                  questionText: "What tool generates type-safe database queries from a declarative schema file?",
                  optionsJson: JSON.stringify([
                    "Prisma ORM",
                    "Webpack bundler",
                    "PostCSS plugin",
                    "Vitest test runner"
                  ]),
                  correctAnswer: 0,
                  explanation: "Prisma generates TypeScript clients tailored directly to your schema definitions.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  // 3. Create Course 2: AI Engineering with Node.js & LLMs
  const course2 = await db.course.create({
    data: {
      title: "Building Production AI Applications",
      slug: "building-ai-applications",
      description: "Learn to integrate Google Gemini, OpenAI, and custom AI agents into real-world applications with prompt engineering and automated grading.",
      category: "Artificial Intelligence",
      difficulty: "Advanced",
      published: true,
      instructorId: instructor.id,
      lessons: {
        create: [
          {
            title: "Prompt Engineering & Structured JSON Output",
            orderIndex: 1,
            durationMinutes: 25,
            content: `LLMs deliver high value when constrained to structured outputs.
Techniques covered:
- Defining JSON Schemas in system prompts.
- Handling API fallback strategies when LLM rate limits or network hiccups occur.
- Designing deterministic heuristic engines alongside dynamic LLM APIs.`,
          },
        ],
      },
      quizzes: {
        create: [
          {
            title: "LLM Systems Architecture & Prompt Evaluation",
            description: "Test your skills in AI SDK integration, fallback handling, and structured data extraction.",
            timeLimitMinutes: 10,
            questions: {
              create: [
                {
                  questionText: "What is the primary reason for engineering structured JSON outputs from LLMs?",
                  optionsJson: JSON.stringify([
                    "To allow programmatic parsing and DB insertion without fragile string regex",
                    "To slow down response processing speed",
                    "To eliminate server bandwidth requirements",
                    "To prevent TypeScript type generation"
                  ]),
                  correctAnswer: 0,
                  explanation: "Structured JSON guarantees API contracts that your application code can validate with Zod and save to SQL databases.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`Seeded courses: ${course1.title}, ${course2.title}`);
  console.log("✅ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error during database seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
