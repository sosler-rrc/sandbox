import { resend, SendEmailHtml } from "../email";
import { getClient } from "../prisma";
import { dateOffset, generateToken } from "./token";
import { Helper } from "@/utils/helper"

export async function createEmailVerification(userId: string){
  const prisma = getClient();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + dateOffset(1))

  const user = await prisma.appUser.findFirstOrThrow({
    where: {
      id: userId
    }
  })

  await prisma.emailVerificationToken.create({
    data: {
      userId,
      expiresAt,
      token,
    }
  })

  const appUrl = `${Helper.getAppUrl()}/api/verify-account?token=${token}`
  const html = `
    <div>
      <span>Click <a href="${appUrl}">here</a> to verify your email.</span>
      <a>
    </div>
  `;
  const subject = "Sandbox: Verify your email"
  await SendEmailHtml(html, user.email, subject);
}