import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validations";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: parsed.email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(parsed.password);

    const user = await db.user.create({
      data: {
        name: parsed.name,
        email: parsed.email.toLowerCase(),
        passwordHash: hashedPassword,
        role: parsed.role,
      },
    });

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
    const errorMsg = err instanceof Error ? err.message : "Invalid registration details";
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
