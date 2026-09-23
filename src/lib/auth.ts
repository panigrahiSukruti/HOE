import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "edupulse-super-secret-jwt-key-2026-change-in-prod"
);

export interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  role: "STUDENT" | "INSTRUCTOR" | "ADMIN";
  [key: string]: unknown;
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

export async function getAuthSession(): Promise<TokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("edupulse_token")?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("edupulse_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("edupulse_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
