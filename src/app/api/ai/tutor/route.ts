import { NextResponse } from "next/server";
import { askAITutor } from "@/lib/ai";
import { AITutorPromptSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = AITutorPromptSchema.parse(body);

    const answer = await askAITutor(parsed.message, parsed.lessonTitle, parsed.courseContext);

    return NextResponse.json({ reply: answer });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "AI processing error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
