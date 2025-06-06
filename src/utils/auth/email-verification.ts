import { getClient } from "../prisma";
import { dateOffset, generateToken } from "./token";
import { resend } from "../email";

export async function createEmailVerification(userId: string){
  const prisma = getClient();
  const token = generateToken();
  const expiresAt = new Date(Date.now() + dateOffset(1)) //expire in 24 hours

  //user should always be set if this is being called
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

  const appUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-account?token=${token}`

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: user.email,
    subject: "Sandbox: Verify your email",
    html: `
    <div>
      <span>Click <a href="${appUrl}">here</a> to verify your email.</span>
      <a>
    </div>`
  })

  // if (error) {
  //   console.error({ error });
  // }

  // console.log(data)
}