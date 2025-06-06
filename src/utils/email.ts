import { Resend } from "resend";

const apiKey = process.env.RESEND_API;

if (!apiKey) {
  throw new Error('Resend API key is required');
}

export const resend = new Resend(apiKey);