import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from './server';

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })
  const allowedRoutes = [
    "/login",
    "/auth",
    "/error"
  ]
  const path = request.nextUrl.pathname;
  if(allowedRoutes.some(route => path.startsWith(route))){
    return NextResponse.next()
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return response
}