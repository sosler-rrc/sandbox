import { NextRequest, NextResponse } from 'next/server';
import { getClient } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);
  const token = searchParams.get("token");
  const client = getClient();

  if(token){
    const emailVerification = await client.emailVerificationToken.findFirst({
      where: {
        token: token
      }
    });

    if(emailVerification && Date.now() <= emailVerification.expiresAt.getTime()){
      await client.appUser.update({
        where: {
          id: emailVerification.userId
        },
        data: {
          emailVerified: true
        }
      })

      await client.emailVerificationToken.delete({
        where: {
          token: token
        }
      })
    }
  }

  const response = NextResponse.redirect(new URL('/', request.url))
  return response;
}