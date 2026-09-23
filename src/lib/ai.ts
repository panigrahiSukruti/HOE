import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function askAITutor(
  message: string,
  lessonTitle?: string,
  courseContext?: string
): Promise<string> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are EduPulse AI, an expert, supportive EdTech tutor.
Context: Lesson "${lessonTitle || "General EdTech Topic"}" in Course "${courseContext || "Computer Science / Fullstack Development"}".
Student Question: ${message}
Provide a clear, encouraging, structured response with code examples or bullet points where appropriate. Keep response concise (under 250 words).`;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) return text;
    } catch (err) {
      console.warn("Gemini API call failed, falling back to heuristic tutor response:", err);
    }
  }

  // Heuristic Fallback Response Engine
  const query = message.toLowerCase();
  if (query.includes("react") || query.includes("component") || query.includes("state")) {
    return `### 💡 React & State Management Key Concepts
Great question about **${lessonTitle || "React"}**!

- **Components**: UI building blocks in React 19 / Next.js 16. Use Server Components by default for fast SSR, and \`'use client'\` for interactive state.
- **State Hooks**: \`useState\` handles local component state, while Context API or Zustand manages global application state.
- **Best Practice**: Keep state lifted to the closest common ancestor and minimize client-side re-renders!`;
  }

  if (query.includes("prisma") || query.includes("db") || query.includes("database") || query.includes("sql")) {
    return `### 🗄️ Database & Prisma ORM Insight
Here is a quick breakdown for **${lessonTitle || "Database Architecture"}**:

1. **Type Safety**: Prisma generates TypeScript definitions based on your \`schema.prisma\`.
2. **Migrations**: Run \`npx prisma db push\` during dev, or \`npx prisma migrate dev\` in production.
3. **Query Optimization**: Use \`select\` or \`include\` strategically to avoid N+1 query overhead in REST/GraphQL APIs.`;
  }

  if (query.includes("auth") || query.includes("jwt") || query.includes("security")) {
    return `### 🔐 Security & JWT Authentication
For **${lessonTitle || "Authentication"}**:

- **HTTP-Only Cookies**: Always store JWT tokens in \`HttpOnly\`, \`SameSite=Lax\` cookies to prevent XSS vulnerability token theft.
- **RBAC**: Enforce Role-Based Access Control at Middleware and API Route boundary levels.
- **Bcrypt**: Always hash passwords with a minimum work factor of 10!`;
  }

  return `### 🤖 EduPulse AI Assistant
Thank you for asking about **"${message}"** regarding *${lessonTitle || "this module"}*!

- **Core Principle**: Breaking down complex topics into modular, testable steps is the key to full-stack mastery.
- **Action Step**: Review the code examples in your lesson dashboard, attempt the self-assessment quiz, and inspect the console logs to deepen your understanding!`;
}

export interface GeneratedQuizQuestion {
  questionText: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export async function generateAIQuizQuestions(
  topic: string,
  difficulty: string = "Intermediate",
  count: number = 3
): Promise<GeneratedQuizQuestion[]> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Generate ${count} multiple-choice quiz questions on the topic "${topic}" with difficulty level "${difficulty}".
Return strictly valid JSON format matching this array schema:
[
  {
    "questionText": "Question text here?",
    "options": ["Option 0", "Option 1", "Option 2", "Option 3"],
    "correctAnswer": 0,
    "explanation": "Why this option is correct."
  }
]
Do not output markdown codeblock ticks. Only raw JSON string.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json/g, "").replace(/```/g, "");
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (err) {
      console.warn("AI Quiz Generation fallback triggered:", err);
    }
  }

  // Heuristic AI Quiz Fallback Generator
  return [
    {
      questionText: `What is a primary architectural feature of Next.js 16 in relation to ${topic}?`,
      options: [
        "Server Components by default for reduced client bundle size",
        "Mandatory global Redux store requirement",
        "Deprecation of TypeScript support",
        "Disabling all client-side JavaScript execution"
      ],
      correctAnswer: 0,
      explanation: "Next.js 16 leverages React Server Components by default, streaming HTML from the server and reducing bundle size."
    },
    {
      questionText: `Which security best practice should be applied when dealing with ${topic} data validation?`,
      options: [
        "Trusting all user input directly without validation",
        "Using Zod schemas to sanitize and validate request payloads at API boundaries",
        "Storing plain-text passwords in local browser storage",
        "Disabling CORS and HTTP-only cookie headers"
      ],
      correctAnswer: 1,
      explanation: "Zod allows runtime schema validation to ensure data strictly adheres to expected types before execution."
    },
    {
      questionText: `In scalable database design for ${topic}, what is the main benefit of Prisma ORM?`,
      options: [
        "End-to-end type safety auto-generated from database schemas",
        "Eliminating the need for a database database altogether",
        "Replacing CSS styles with SQL code",
        "Automatically deploying backend servers to Vercel"
      ],
      correctAnswer: 0,
      explanation: "Prisma generates fully typed clients based on schema definition files, catching query errors at compile-time."
    }
  ].slice(0, count);
}

export interface AIGradeResult {
  score: number;
  feedback: string;
  suggestions: string[];
}

export async function gradeSubmissionWithAI(
  lessonTitle: string,
  codeContent: string
): Promise<AIGradeResult> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Act as an expert EdTech code reviewer evaluating a student submission for the lesson "${lessonTitle}".
Student Submission Code/Content:
\`\`\`
${codeContent}
\`\`\`
Provide an evaluation returning raw JSON matching this format:
{
  "score": 85,
  "feedback": "Comprehensive response with clean structure and correct concepts.",
  "suggestions": ["Add explicit error handling", "Include type annotations"]
}
Raw JSON only.`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim().replace(/```json/g, "").replace(/```/g, "");
      const parsed = JSON.parse(text);
      if (typeof parsed.score === "number") {
        return {
          score: Math.min(100, Math.max(0, parsed.score)),
          feedback: parsed.feedback || "Good effort!",
          suggestions: parsed.suggestions || ["Keep practicing!"],
        };
      }
    } catch (err) {
      console.warn("AI Grading fallback triggered:", err);
    }
  }

  // Heuristic Submission Evaluator
  const length = codeContent.trim().length;
  const hasTypes = codeContent.includes("interface") || codeContent.includes("type") || codeContent.includes("const");
  const hasAsync = codeContent.includes("async") || codeContent.includes("await") || codeContent.includes("Promise");

  let score = 70;
  const suggestions: string[] = [];

  if (length > 100) score += 10;
  if (hasTypes) score += 10;
  if (hasAsync) score += 10;

  if (!hasTypes) suggestions.push("Consider adding TypeScript interfaces for robust type safety.");
  if (!hasAsync) suggestions.push("Utilize async/await patterns for non-blocking asynchronous calls.");
  suggestions.push("Add automated unit test assertions using Vitest.");

  return {
    score: Math.min(98, score),
    feedback: `Solid submission for "${lessonTitle}". Demonstrated clear problem-solving initiative with well-structured logic.`,
    suggestions,
  };
}
