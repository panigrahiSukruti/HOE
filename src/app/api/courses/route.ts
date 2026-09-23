import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { CreateCourseSchema } from "@/lib/validations";

export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        instructor: { select: { name: true, email: true } },
        _count: { select: { lessons: true, quizzes: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ courses });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch courses";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Instructor role required." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = CreateCourseSchema.parse(body);

    const slug = parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    const course = await db.course.create({
      data: {
        title: parsed.title,
        slug,
        description: parsed.description,
        category: parsed.category,
        difficulty: parsed.difficulty,
        instructorId: session.userId,
        lessons: {
          create: [
            {
              title: `${parsed.title} - Fundamentals & Overview`,
              content: `Welcome to ${parsed.title}! In this introductory lesson, we examine core concepts, architectural foundations, and practical application patterns.`,
              orderIndex: 1,
              durationMinutes: 15,
            },
          ],
        },
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create course";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
