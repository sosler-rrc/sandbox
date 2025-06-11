import { Resend } from "resend";

const apiKey = process.env.RESEND_API;

if (!apiKey) {
  throw new Error('Resend API key is required');
}

export const resend = new Resend(apiKey);

export async function SendEmailHtml(html: string, toEmail: string, subject: string){
  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: toEmail,
    subject: subject,
    html: html
  })

  if (error) {
    console.error({ error });
  }

  console.log(data)
}