import { describe, it, expect } from "vitest";
import { askAITutor, generateAIQuizQuestions, gradeSubmissionWithAI } from "@/lib/ai";

describe("AI Engine & Heuristic Fallbacks", () => {
  it("should return structured tutor responses", async () => {
    const reply = await askAITutor("How does React state work?", "State Management", "React 19");
    expect(typeof reply).toBe("string");
    expect(reply.length).toBeGreaterThan(20);
  });

  it("should generate AI quiz questions with correct schema", async () => {
    const questions = await generateAIQuizQuestions("Next.js 16", "Intermediate", 2);
    expect(Array.isArray(questions)).toBe(true);
    expect(questions.length).toBe(2);
    expect(questions[0]).toHaveProperty("questionText");
    expect(questions[0]).toHaveProperty("options");
    expect(questions[0]).toHaveProperty("correctAnswer");
  });

  it("should grade code submission and return score and suggestions", async () => {
    const result = await gradeSubmissionWithAI(
      "JWT Middleware",
      "const token = req.cookies.get('token'); async function verify() { await jwtVerify(token, secret); }"
    );
    expect(typeof result.score).toBe("number");
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(Array.isArray(result.suggestions)).toBe(true);
  });
});
