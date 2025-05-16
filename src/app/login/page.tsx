"use client"
import { useState, useEffect } from "react";
import { login, signup } from "./actions";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const searchParams = useSearchParams()
  const method = searchParams.get("type") ?? "login"

  //reset ui state
  useEffect(() => {
    setLoginError("");
  }, [method]);

  const handleLogin = async  (formData: FormData) => {
    setLoginError(null)
    if(method == "login"){
      const response = await login(formData)
      if(response.error){
        setLoginError(response.error)
      }
    } else {
      const response = await signup(formData)
      if(response.error){
        setLoginError(response.error)
      }
    }
  }

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <form className="flex flex-col justify-center" action={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input 
            className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Email"
            type="email"
            id="email" 
            name="email"
            required
          />

          <label htmlFor="password">Password:</label>
          <input 
            className="mb-1 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Password"
            type='password'
            id="password" 
            name="password"
            required
          />
          {
            method == "login" && 
            <Link href={"/login/reset-confirmation"} className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
              Forgot Password
            </Link>
          }
          <span className="mt-4 text-sm text-red-400 font-semibold">
            {loginError}
          </span>

          {
            method == "signup" ?
            <div className="flex flex-col mt-4">
              <button 
                className="p-[4px] mb-2 rounded-sm bg-green-600 hover:bg-green-800 text-white w-[200px] cursor-pointer"
              >Sign Up</button>
              <span>
                Already a user?
                <Link href={"/login?type=login"} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  {" "}Log in
                </Link>
              </span>
            </div>
            :
            <div className="flex flex-col mt-4">
              <button 
                className="p-[4px] mb-2 rounded-sm bg-green-600 hover:bg-green-800 text-white w-[200px] cursor-pointer"
              >Login</button>
              <span>
                Not a user yet? 
                <Link href={"/login?type=signup"} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                  {" "}Sign up
                </Link>
              </span>
            </div>
          }
        </form>
      </div>
    </div>
  );
}
