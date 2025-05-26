import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getSessionIdFromToken, invalidateAllSessions, invalidateSession } from '@/utils/auth/session'; // your existing function
import { deleteSessionTokenCookie } from '@/utils/auth/cookies';
import { getClient } from '@/utils/prisma';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if(token){
    const client = getClient();
    const sessionId = getSessionIdFromToken(token);
    await client.userSession.delete({
      where: { id: sessionId },
    });
  }
  deleteSessionTokenCookie();
  const response = NextResponse.json({ success: true });
  return response;
}
