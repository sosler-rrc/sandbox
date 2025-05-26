import { cookies } from "next/headers";
import { cache } from "react";
import { SessionValidationResult, validateSessionToken } from "./session";
import { NextResponse } from "next/server";

export function setSessionTokenCookie(response: NextResponse, token: string, expiresAt: Date) {
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/'
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });
}

export const getCurrentSession = cache(async (): Promise<SessionValidationResult | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;
  if (token === null) {
    return null;
  }
  const result = await validateSessionToken(token);
  return result;
});