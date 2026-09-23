import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "INSTRUCTOR", "ADMIN"]).default("STUDENT"),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const CreateCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(2, "Category is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]).default("Intermediate"),
});

export const CreateQuizSchema = z.object({
  courseId: z.string().uuid("Invalid course ID"),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description is required"),
  timeLimitMinutes: z.number().min(1).max(180).default(10),
  questions: z.array(
    z.object({
      questionText: z.string().min(5, "Question text required"),
      options: z.array(z.string()).min(2, "At least 2 options required"),
      correctAnswer: z.number().min(0),
      explanation: z.string().default(""),
    })
  ).min(1, "At least 1 question is required"),
});

export const SubmitQuizSchema = z.object({
  quizId: z.string().uuid("Invalid quiz ID"),
  answers: z.record(z.string(), z.number()), // questionId -> optionIndex
});

export const AITutorPromptSchema = z.object({
  courseContext: z.string().optional(),
  lessonTitle: z.string().optional(),
  message: z.string().min(2, "Message is too short"),
});

export const AIGenerateQuizSchema = z.object({
  topic: z.string().min(3, "Topic is required"),
  difficulty: z.string().default("Intermediate"),
  questionCount: z.number().min(1).max(10).default(3),
});

export const AISubmissionGradeSchema = z.object({
  lessonTitle: z.string(),
  codeContent: z.string().min(5, "Submission content is too short"),
});
