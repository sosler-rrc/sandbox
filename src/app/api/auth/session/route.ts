// For App Router: /app/api/auth/session/route.ts
import { getCurrentSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = await getCurrentSession();

    if (session) {
      return NextResponse.json({ user: session });
    } else {
      return NextResponse.json({ user: null }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
