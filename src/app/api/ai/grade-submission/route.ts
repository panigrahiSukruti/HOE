import { NextResponse } from "next/server";
import { gradeSubmissionWithAI } from "@/lib/ai";
import { AISubmissionGradeSchema } from "@/lib/validations";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = AISubmissionGradeSchema.parse(body);

    const gradeResult = await gradeSubmissionWithAI(parsed.lessonTitle, parsed.codeContent);

    // Find lesson by title (or fallback) to attach submission entity in DB
    const lesson = await db.lesson.findFirst({
      where: { title: { contains: parsed.lessonTitle } },
    });

    let submissionRecord = null;
    if (lesson) {
      submissionRecord = await db.submission.create({
        data: {
          userId: session.userId,
          lessonId: lesson.id,
          codeContent: parsed.codeContent,
          aiScore: gradeResult.score,
          aiFeedback: `${gradeResult.feedback} | Suggestions: ${gradeResult.suggestions.join("; ")}`,
        },
      });
    }

    return NextResponse.json({
      score: gradeResult.score,
      feedback: gradeResult.feedback,
      suggestions: gradeResult.suggestions,
      submissionId: submissionRecord?.id || null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI Grading error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
