import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import { PrismaClient } from "../../../prisma/generated/prisma";

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: number): Promise<Session> {
  const prisma = new PrismaClient()
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

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const prisma = new PrismaClient()
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
    return {
      session: null,
      user: null
    }
  }
  
  const session: Session = {
    ...userSession
  }

  const user: User = {
    id: userSession.userId
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
  const prisma = new PrismaClient()
  prisma.userSession.delete({
    where: {
      id: sessionId
    }
  });
}

export async function invalidateAllSessions(userId: number): Promise<void> {
  const prisma = new PrismaClient()
  prisma.userSession.deleteMany({
    where: {
      userId: userId
    }
  });
}

const dateOffset = (days:number) => (1000 * 60 * 60 * 24 * days);

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };

export interface Session {
  id: string;
  userId: number;
  expiresAt: Date;
}

export interface User {
  id: number;
}