'use server'
import { revalidatePath } from 'next/cache'
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
  const response = {} as any

  if (response.error) {
    return {
      error: response.error.message
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
} 