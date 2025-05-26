import { NextRequest, NextResponse } from 'next/server';
import { validateSessionToken } from '@/utils/auth/session';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('session')?.value ?? null;
  if (!token) return NextResponse.json({ valid: false });

  const session = await validateSessionToken(token);
  return NextResponse.json({ valid: !!session });
}