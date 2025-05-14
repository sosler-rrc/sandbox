"use client"
import { useState } from "react";
import { login, signup } from "./actions";

export default function Login() {
  return (
    <div className="w-full h-screen flex justify-center bg-neutral-200">
      <div className="flex flex-col justify-center">
        <span className="mb-4 text-lg">
          Welcome to the sandbox!
        </span>
        <form className="flex flex-col justify-center">
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
            className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50" 
            placeholder="Password"
            type='password'
            id="password" 
            name="password"
            required
          />
          
          <button 
            className="p-[4px] mb-2 rounded-sm bg-sky-600 hover:bg-sky-800 text-white w-[200px] cursor-pointer"
            formAction={signup}
          >Sign up</button>
          
          <button 
            className="p-[4px] mb-2 rounded-sm bg-green-600 hover:bg-green-800 text-white w-[200px] cursor-pointer"
            formAction={login}
          >Login</button>
        </form>
      </div>
    </div>
  );
}
