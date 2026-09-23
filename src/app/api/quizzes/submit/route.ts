import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { SubmitQuizSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { quizId, answers } = SubmitQuizSchema.parse(body);

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      const selectedOption = answers[q.id];
      if (selectedOption === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = quiz.questions.length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const attempt = await db.quizAttempt.create({
      data: {
        quizId,
        userId: session.userId,
        score: scorePercentage,
        totalQuestions,
        answersJson: JSON.stringify(answers),
      },
    });

    return NextResponse.json({
      attemptId: attempt.id,
      score: scorePercentage,
      correctCount,
      totalQuestions,
      completedAt: attempt.completedAt,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to process quiz submission";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
