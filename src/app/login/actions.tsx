"use server"
import { UserSignup } from "@/models/UserSignup";
import { deleteSessionTokenCookie } from "@/utils/auth/cookies";
import { createEmailVerification } from "@/utils/auth/email-verification";
import { createSession, getSessionIdFromToken } from "@/utils/auth/session";
import { generateToken } from "@/utils/auth/token";
import { Helper } from "@/utils/helper";
import { getClient } from "@/utils/prisma";
import { hash, verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(email: string, password: string){
  const client = getClient();
  
  const existingUser = await client.appUser.findFirst({
    where: {
      email: email,
    },
    include: {
      userKey: {}
    }
  })

  if(!existingUser){
    return {
      message: "No user with this email exists, please create an account"
    } 
  }

  const result = await verify(existingUser.userKey.hashedPassword, password);
  if(!result){
    return {
      message: "Incorrect credentials, please try again or reset your password."
    }
  }

  const sessionToken = generateToken();
  const session = await createSession(sessionToken, existingUser.id);
  const cookieStore = await cookies();

  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });
  
  return redirect("/");
}

export async function signupAction(newUser: UserSignup) {
  const client = getClient();
  
  if(!Helper.isValidEmail(newUser.email)){
    return {
      message: "Email is not valid" 
    }
  }
  
  if(newUser.password != newUser.confirmPassword){
    return {
      message: "Passwords do not match"
    }
  }
  
  const existingUserEmail = await client.appUser.findFirst({
    where: {
      email: newUser.email
    }
  })
  
  if(existingUserEmail){
    return { 
      message: "A user with this email already exists"
    }
  }

  const hashedPass = await hash(newUser.password);
  const appUser = await client.appUser.create({
    data: {
      email: newUser.email,
      emailVerified: false,
      userKey: {
        create: {
          hashedPassword: hashedPass
        }
      }
    }
  });

  

  const sessionToken = generateToken();
  const session = await createSession(sessionToken, appUser.id);

  const cookieStore = await cookies();

  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });

  await createEmailVerification(appUser.id);

  return redirect("/");
}

export async function logoutAction(){
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;
  if(token){
    const client = getClient();
    const sessionId = getSessionIdFromToken(token);
    await client.userSession.delete({
      where: { id: sessionId },
    });
  }

  deleteSessionTokenCookie();

  return redirect("/login")
}