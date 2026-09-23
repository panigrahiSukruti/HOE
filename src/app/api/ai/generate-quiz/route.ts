import { NextResponse } from "next/server";
import { generateAIQuizQuestions } from "@/lib/ai";
import { AIGenerateQuizSchema } from "@/lib/validations";
import { getAuthSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session || (session.role !== "INSTRUCTOR" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized. Instructor role required." }, { status: 403 });
    }

    const body = await req.json();
    const parsed = AIGenerateQuizSchema.parse(body);

    const questions = await generateAIQuizQuestions(
      parsed.topic,
      parsed.difficulty,
      parsed.questionCount
    );

    return NextResponse.json({ questions });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI Quiz generation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
