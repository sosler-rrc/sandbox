import { cookies } from "next/headers";
import { cache } from "react";
import { NextResponse } from "next/server";
import { SendEmailHtml } from "./email";
import { Helper } from "./helper";
import { getClient } from "./prisma";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { dateOffset } from "./utils";
import { Session } from "@/models/Session";
import { User } from "@/models/User";
import { SessionValidationResult } from "@/models/SessionValidationResult";


export function generateToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export function getSessionIdFromToken(token: string): string {
  const hash = sha256(new TextEncoder().encode(token));
  return encodeHexLowerCase(hash);
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const prisma = getClient();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + dateOffset(30))
  };

  const dbSession = prisma.userSession.create({
    data: {
      ...session,
    }
  })
  return dbSession;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult | null> {
  const prisma = getClient();
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const userSession = await prisma.userSession.findFirst({
    where: {
      id: sessionId,
    },
    include: {
      user: true
    },
  });

  if(userSession == null){
    return null
  }
  
  const session: Session = {
    ...userSession
  }

  const user: User = {
    ...userSession.user
  }

  if(Date.now() >= session.expiresAt.getTime()){
    prisma.userSession.delete({
      where: {
        id: session.id
      }
    });
  }
  
  if(Date.now() >= session.expiresAt.getTime() - dateOffset(15)){
    session.expiresAt = new Date(Date.now() + dateOffset(30))
    prisma.userSession.update({
      data: {
        expiresAt: session.expiresAt
      },
      where: {
        id: session.id
      }
    });
  }

  return {
    user,
    session
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  const prisma = getClient();
  prisma.userSession.delete({
    where: {
      id: sessionId
    }
  });
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  const prisma = getClient();
  prisma.userSession.deleteMany({
    where: {
      userId: userId
    }
  });
}

export async function createEmailVerification(userId: string){
  const prisma = getClient();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + dateOffset(1))

  const user = await prisma.appUser.findFirstOrThrow({
    where: {
      id: userId
    }
  })

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      expiresAt,
      token,
    }
  })

  const appUrl = `${Helper.getAppUrl()}/api/verify-account?token=${token}`
  const html = `
    <div>
      <span>Click <a href="${appUrl}">here</a> to verify your email.</span>
      <a>
    </div>
  `;
  const subject = "Sandbox: Verify your email"
  await SendEmailHtml(html, user.email, subject);
}

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