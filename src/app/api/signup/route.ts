import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '../../../../prisma/generated/prisma';
import { LoginResponse } from '@/models/LoginResponse';
import { Helper } from '@/utils/helper';
import { hash } from '@node-rs/argon2';
import { createSession, dateOffset, generateSessionToken } from '@/utils/auth/session';
import { UserSignup } from '@/models/UserSignup';
import { setSessionTokenCookie } from '@/utils/auth/cookies';
import { getClient } from '@/utils/prisma';

//signup
export async function POST(request: NextRequest) {
  const userData = await request.json() as UserSignup;
  const client = getClient();
  const loginResponse: LoginResponse<UserSignup> = {
    success: true,
    message: 'Account created successfully',
    user: undefined
  }

  if(!Helper.isValidEmail(userData.email)){
    loginResponse.success = false;
    loginResponse.message = "Email is not valid"
    return NextResponse.json(loginResponse)
  }

  if(userData.password != userData.confirmPassword){
    loginResponse.success = false;
    loginResponse.message = "Passwords do not match"
    return NextResponse.json(loginResponse)
  }

  const existingUserEmail = await client.appUser.findFirst({
    where: {
      email: userData.email
    }
  })

  if(existingUserEmail){
    loginResponse.success = false;
    loginResponse.message = "A user with this email already exists"
    return NextResponse.json(loginResponse)
  }
  
  const hashedPass = await hash(userData.password);
  const appUser = await client.appUser.create({
    data: {
      email: userData.email,
      username: "",
      userKey: {
        create: {
          hashedPassword: hashedPass
        }
      }
    }
  });

  const token = generateSessionToken();
  const session = await createSession(token, appUser.id);
  const response = NextResponse.json(loginResponse);

  setSessionTokenCookie(response, token, session.expiresAt);

  return response;
}