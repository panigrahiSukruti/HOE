import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signToken, verifyToken } from "@/lib/auth";

describe("Authentication & Security Module", () => {
  it("should correctly hash and verify passwords with bcrypt", async () => {
    const rawPassword = "SecurePassword123!";
    const hash = await hashPassword(rawPassword);

    expect(hash).not.toEqual(rawPassword);
    expect(await verifyPassword(rawPassword, hash)).toBe(true);
    expect(await verifyPassword("WrongPassword", hash)).toBe(false);
  });

  it("should sign and verify JWT tokens containing user role payload", async () => {
    const payload = {
      userId: "test-user-id-123",
      email: "alex@edupulse.ai",
      name: "Alex Rivera",
      role: "STUDENT" as const,
    };

    const token = await signToken(payload);
    expect(typeof token).toBe("string");

    const verified = await verifyToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.role).toBe("STUDENT");
  });
});
