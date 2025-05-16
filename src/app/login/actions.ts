'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const response = await supabase.auth.signInWithPassword(data)

  if (response.error) {
    return {
      error: "Invalid credentials, please try again."
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const response = await supabase.auth.signUp({
    email: data.email,
    password: data.password
  })

  console.log(response)

  if (response.error) {
    return {
      error: "An error occured, please try again."
    }
  }

  if(response.data.user){
    return {
      error: "A user already exists with this email"
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}