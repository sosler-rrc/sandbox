import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { LoginResponse } from '@/models/LoginResponse';
import { createSession, dateOffset, generateSessionToken, validateSessionToken } from '@/utils/auth/session';
import { UserLogin } from '@/models/UserLogin';
import { User } from '@/models/User';
import { verify } from '@node-rs/argon2';
import { setSessionTokenCookie } from '@/utils/auth/cookies';
import { getClient } from '@/utils/prisma';

//login
export async function POST(request: NextRequest) {
  const userData = await request.json() as UserLogin;
  const client = getClient();
  const loginResponse: LoginResponse<User> = {
    success: true,
    message: 'Logged in successfully',
    user: undefined
  }

  const existingUser = await client.appUser.findFirst({
    where: {
      email: userData.email,
    },
    include: {
      userKey: {}
    }
  })

  if(!existingUser){
    loginResponse.success = false;
    loginResponse.message = "No user with this email exists, please create an account"
    return NextResponse.json(loginResponse)
  }

  const result = await verify(existingUser.userKey.hashedPassword, userData.password);
  if(!result){
    loginResponse.success = false;
    loginResponse.message = "Incorrect credentials, please try again or reset your password."
    return NextResponse.json(loginResponse)
  }

  
  // const response = NextResponse.json(loginResponse);
  // console.log(sessionToken);
  // if(sessionToken){
  //   const session = await validateSessionToken(sessionToken.value)
  //   if(!session){
  //     loginResponse.success = false;
  //     loginResponse.message = "Session token is expired, please login"
  //   } else {
  //     const sessionToken = generateSessionToken();
  //     const session = await createSession(sessionToken, existingUser.id);
  //     setSessionTokenCookie(response, sessionToken, session.expiresAt);
  //   }
  // }

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, existingUser.id);

  loginResponse.user = existingUser;

  const response = NextResponse.json(loginResponse);
  setSessionTokenCookie(response, sessionToken, session.expiresAt);

  await client.$disconnect();
  return response
}