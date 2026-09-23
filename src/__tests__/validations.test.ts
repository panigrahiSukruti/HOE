import { describe, it, expect } from "vitest";
import { RegisterSchema, LoginSchema, CreateCourseSchema } from "@/lib/validations";

describe("Zod Validation Schemas", () => {
  it("should validate valid user registration payload", () => {
    const validData = {
      name: "Dr. Sarah Chen",
      email: "sarah@edupulse.ai",
      password: "password123",
      role: "INSTRUCTOR",
    };

    const parsed = RegisterSchema.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it("should reject invalid email format during registration", () => {
    const invalidData = {
      name: "Test User",
      email: "not-an-email",
      password: "123",
    };

    const parsed = RegisterSchema.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it("should validate course creation constraints", () => {
    const course = {
      title: "Advanced Next.js 16 Architecture",
      description: "Deep dive into React Server Components, streaming, and Prisma ORM.",
      category: "Web Engineering",
      difficulty: "Advanced",
    };

    const parsed = CreateCourseSchema.safeParse(course);
    expect(parsed.success).toBe(true);
  });
});
