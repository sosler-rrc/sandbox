'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function resetPasswordEmail(formData: FormData){
  const email = formData.get('email') as string | null;

  if(email == null){
    return {
      error: "Email is not valid"
    }
  }

  const error = {} as any

  if(error){
    return {
      error: error.message
    }
  }

  redirect("/login/reset-confirmation?emailSent=true")
} 