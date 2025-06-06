'use server'
import { redirect } from 'next/navigation'

export async function reset(formData: FormData){
  const data = {
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
  }

  if(data.password != data.passwordConfirm){
    return {
      error: "Passwords do not match."
    }
  }


  redirect('/login')
} 