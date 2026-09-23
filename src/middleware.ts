import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "edupulse-super-secret-jwt-key-2026-change-in-prod"
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public paths
  if (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.includes("favicon.ico")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("edupulse_token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as { role?: string };

    // RBAC check for Instructor Studio routes
    if (pathname.startsWith("/instructor") || pathname.startsWith("/api/instructor")) {
      if (payload.role !== "INSTRUCTOR" && payload.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard?error=unauthorized", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/courses/:path*", "/quizzes/:path*", "/instructor/:path*", "/api/courses/:path*"],
};
