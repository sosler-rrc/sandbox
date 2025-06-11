'use server'
import { dateOffset, generateToken } from '@/utils/auth/token';
import { Helper } from '@/utils/helper';
import { resend, SendEmailHtml } from "@/utils/email";
import { getClient } from '@/utils/prisma';
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache';

export async function resetPasswordEmail(formData: FormData){
  const email = formData.get('email') as string | null;

  if(email == null || !Helper.isValidEmail(email)){
    return {
      error: "Email is not valid"
    }
  }

  const client = getClient();
  const token = generateToken();
  const expires = new Date(Date.now() + dateOffset(1))

  const user = await client.appUser.findFirst({
    where: {
      email: email
    }
  })

  if(user != null){
    await client.passwordResetToken.create({
      data: {
        token: token,
        expires: expires,
        userId: user.id,
      }
    })
    
    const appUrl = `${Helper.getAppUrl()}/login/recover-account?token=${token}`
    const html = `
      <div>
        <span>Click <a href="${appUrl}">here</a> to reset your password.</span>
        <a>
      </div>
    `;
    const subject = "Sandbox: Reset your password"
    await SendEmailHtml(html, user.email, subject);
  }

  revalidatePath('/', 'layout')
  redirect("/login/reset-confirmation?emailSent=true")
} 