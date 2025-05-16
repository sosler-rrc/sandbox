'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function reset(formData: FormData){
  const supabase = await createClient()

  const data = {
    password: formData.get('password') as string,
    passwordConfirm: formData.get('passwordConfirm') as string,
  }

  if(data.password != data.passwordConfirm){
    return {
      error: "Passwords do not match."
    }
  }

  const response = await supabase.auth.updateUser({ password: data.password })


  if (response.error) {
    return {
      error: response.error.message
    }
  }

  revalidatePath('/', 'layout')
  redirect('/login')
} 