"use client"
import { useState, useEffect } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { resetPassword } from "./actions";
import { getClient } from "@/lib/prisma";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default async function Page() {
  const [formError, setFormError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  if(token == null){
    redirect("/error");
  }
  
  const handleResetPassword = async  (formData: FormData) => {
    setFormError(null)
    const response = await resetPassword(formData, token)
    if(response.error){
      setFormError(response.error)
    }
  }

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <form className="flex flex-col justify-center" action={handleResetPassword}>
          <label htmlFor="password">Password:</label>
          <Input 
            className="mb-1 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Password"
            type='password'
            id="password" 
            name="password"
            required
          />

          <label htmlFor="passwordConfirm">Confirm Password:</label>
          <Input 
            className="mb-1 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Confirm Password"
            type='password'
            id="passwordConfirm" 
            name="passwordConfirm"
            required
          />
          <span className="mt-4 text-sm text-red-400 font-semibold">
            {formError}
          </span>

          <Button variant="green" type="submit">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
