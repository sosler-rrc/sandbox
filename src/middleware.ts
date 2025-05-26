import { NextResponse, type NextRequest } from "next/server";
import { dateOffset, validateSessionToken } from "./utils/auth/session";

export async function middleware(request: NextRequest) {
  const allowedRoutes = [
    "/login",
    "/auth",
    "/error",
    "/api/login",
    "/api/signup"
  ];
  const path = request.nextUrl.pathname;
  
  if (allowedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get("session")?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('type', "login");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
