"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserSignup } from "@/models/UserSignup";
import { loginAction, signupAction } from "./actions";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function Page() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const method = searchParams.get("type") ?? "login";

  // reset ui state
  useEffect(() => {
    setLoginError("");
  }, [method]);

  const handleLogin = async (formData: FormData) => {
    setLoginError(null);
    setIsLoading(true);

    try {
      let response: { message: string };

      if (method == "login") {
        const loginData = {
          username: formData.get("username") as string,
          password: formData.get("password") as string,
        };

        response = await loginAction(loginData.username, loginData.password);
      } else {
        const signupData = {
          email: formData.get("email") as string,
          userName: formData.get("username") as string,
          password: formData.get("password") as string,
          confirmPassword: formData.get("confirmPassword") as string,
        } as UserSignup;

        response = await signupAction(signupData);
      }

      setLoginError(response.message);
    } catch (e) {
      // console.error("Auth error:", e);
      // setLoginError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <form
          className="flex flex-col justify-center w-3xs"
          action={handleLogin}
        >
          {method == "signup" && (
            <>
              <label htmlFor="email">Email:</label>
              <input
                className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50"
                placeholder="Email"
                type="email"
                id="email"
                name="email"
                required
                disabled={isLoading}
              />
            </>
          )}
          <label htmlFor="username">Username:</label>
          <input
            className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50"
            placeholder="Username"
            type="text"
            id="username"
            name="username"
            required
            disabled={isLoading}
          />

          <label htmlFor="password">Password:</label>
          <Input
            className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50"
            placeholder="Password"
            type="password"
            id="password"
            name="password"
            required
            disabled={isLoading}
          />

          {method == "signup" && (
            <>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Input
                className="mb-4 border-[1.5px] rounded-sm border-neutral-600 p-[4px] bg-neutral-50"
                placeholder="Confirm Password"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                disabled={isLoading}
              />
            </>
          )}
          {method == "login" && (
            <Link
              href={"/login/reset-confirmation"}
              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
            >
              Forgot Password
            </Link>
          )}

          {loginError && (
            <span className="mt-2 text-sm text-red-400 font-semibold whitespace-pre-line">
              {loginError}
            </span>
          )}

          {method == "signup" ? (
            <div className="flex flex-col mt-4">
              <Button variant="green" disabled={isLoading} type="submit">
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
              <span>
                Already a user?
                <Link
                  href={"/login?type=login"}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {" "}
                  Log in
                </Link>
              </span>
            </div>
          ) : (
            <div className="flex flex-col mt-4">
              <Button variant="green" disabled={isLoading} type="submit">
                {isLoading ? "Logging In..." : "Login"}
              </Button>
              <span>
                Not a user yet?
                <Link
                  href={"/login?type=signup"}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                >
                  {" "}
                  Sign up
                </Link>
              </span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
