'use server'
import { Helper } from '@/utils/helper';
import { redirect } from 'next/navigation'

export async function resetPasswordEmail(formData: FormData){
  const email = formData.get('email') as string | null;

  if(email == null || Helper.isValidEmail(email)){
    return {
      error: "Email is not valid"
    }
  }

  

  redirect("/login/reset-confirmation?emailSent=true")
} 