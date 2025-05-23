'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'


export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // const response = await supabase.auth.signInWithPassword(data)
  const response = {} as any

  if (response.error) {
    return {
      error: "Invalid credentials, please try again."
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirmPassword: formData.get('confirmPassword') as string
  };

  if(data.password != data.confirmPassword){
    return {
      error: "Passwords do not match"
    }
  }

  const response = {} as any
  // const response = await supabase.auth.signUp({
  //   email: data.email,
  //   password: data.password
  // })

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