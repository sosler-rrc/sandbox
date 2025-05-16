"use client"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { reset } from "./actions";

export default function Page() {
  const [formError, setFormError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const method = searchParams.get("type") ?? "login"

  //reset ui state
  useEffect(() => {
    setFormError(null);
  }, [method]);

  const handleReset = async  (formData: FormData) => {
    setFormError(null)
    const response = await reset(formData)
    if(response.error){
      setFormError(response.error)
    }
  }

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <form className="flex flex-col justify-center" action={handleReset}>
          <label htmlFor="password">Password:</label>
          <input 
            className="mb-1 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Password"
            type='password'
            id="password" 
            name="password"
            required
          />

          <label htmlFor="passwordConfirm">Confirm Password:</label>
          <input 
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

          <button 
            className="p-[4px] mb-2 rounded-sm bg-green-600 hover:bg-green-800 text-white w-[200px] cursor-pointer"
          >Reset Password</button>
        </form>
      </div>
    </div>
  );
}
