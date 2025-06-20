"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { resetPasswordEmail } from "./actions";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function Page() {
  const [formError, setFormError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const emailSent = (searchParams.get("emailSent") ?? false) as boolean

  //reset ui state
  useEffect(() => {
    setFormError(null);
  }, [emailSent]);

  const handleReset = async  (formData: FormData) => {
    setFormError(null)
    const response = await resetPasswordEmail(formData)
    if(response.error){
      setFormError(response.error)
    }
  }

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <span className="mb-4 text-md">
          Enter email to reset password
        </span>
        <form className="flex flex-col justify-center" action={handleReset}>
          <label htmlFor="email">Email:</label>
          <Input 
            className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Email"
            type="email"
            id="email" 
            name="email"
            required
          />

          { emailSent && 
            <span className="mb-4 text-sm text-emerald-400 font-semibold">
              Check your email for a reset link.
            </span>
          }

          {formError &&
            <span className="mt-4 text-sm text-red-400 font-semibold">
              {formError}
            </span>
          }

          <Button variant="green" type="submit">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
}
