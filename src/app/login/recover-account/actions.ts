'use server'
import { deleteSessionTokenCookie } from '@/utils/auth/cookies'
import { createSession, invalidateAllSessions } from '@/utils/auth/session'
import { generateToken } from '@/utils/auth/token'
import { getClient } from '@/utils/prisma'
import { hash } from '@node-rs/argon2'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/dist/server/request/cookies'
import { redirect } from 'next/navigation'

export async function resetPassword(formData: FormData, token: string){
  const data = {
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
  }

  if(data.password != data.passwordConfirm){
    return {
      error: "Passwords do not match."
    }
  }

  const client = getClient();

  if(token == null){
    redirect("/error");
  }

  const resetToken = await client.passwordResetToken.findFirst({where: { token: token }})
  console.log(resetToken)
  console.log(resetToken?.expires.getTime())
  console.log(Date.now())
  if(resetToken == null || Date.now() > resetToken.expires.getTime()) {
    redirect('/login')
  }

  await deleteSessionTokenCookie();
  await invalidateAllSessions(resetToken.userId);
  
  const hashedPass = await hash(data.password);
  await client.userKey.update({
      data: {
        hashedPassword: hashedPass
      },
      where: {
        id: resetToken.userId
      },
    }
  )
  const sessionToken = generateToken();
  const session = await createSession(sessionToken, resetToken.userId);
  const cookieStore = await cookies();

  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });

  revalidatePath('/', 'layout')
  redirect('/login')
} 