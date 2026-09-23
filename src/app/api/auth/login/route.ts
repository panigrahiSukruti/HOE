import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";
import { LoginSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.parse(body);

    const user = await db.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(parsed.password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = await signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "STUDENT" | "INSTRUCTOR" | "ADMIN",
    });

    await setAuthCookie(token);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Invalid credentials";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
