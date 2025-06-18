"use server";
import { UserSignup } from "@/models/UserSignup";
import { Helper } from "@/lib/helper";
import { getClient } from "@/lib/prisma";
import { hash, verify } from "@node-rs/argon2";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createEmailVerification,
  createSession,
  deleteSessionTokenCookie,
  generateToken,
  getSessionIdFromToken,
} from "@/lib/auth";

export async function loginAction(username: string, password: string) {
  const client = getClient();

  const existingUser = await client.user.findFirst({
    where: {
      userName: username,
    },
    include: {
      userKey: {},
    },
  });

  if (!existingUser) {
    return {
      message: "No user with this email exists, please create an account",
    };
  }
  if (existingUser.userKey != null) {
    const result = await verify(existingUser.userKey.hashedPassword, password);
    if (!result) {
      return {
        message:
          "Incorrect credentials, please try again or reset your password.",
      };
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
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signupAction(newUser: UserSignup) {
  const client = getClient();

  if (!Helper.isValidEmail(newUser.email)) {
    return {
      message: "Email is not valid",
    };
  }

  if (newUser.password != newUser.confirmPassword) {
    return {
      message: "Passwords do not match",
    };
  }

  const existingUsername = await client.user.findFirst({
    where: {
      userName: newUser.userName,
    },
  });

  if (existingUsername) {
    return {
      message: "A user with this username already exists",
    };
  }

  const existingUserEmail = await client.user.findFirst({
    where: {
      email: newUser.email,
    },
  });

  if (existingUserEmail) {
    return {
      message: "A user with this email already exists",
    };
  }

  const user = await client.user.create({
    data: {
      email: newUser.email,
      emailVerified: false,
      userName: newUser.userName,
    },
  });

  const hashedPass = await hash(newUser.password);
  await client.userKey.create({
    data: {
      hashedPassword: hashedPass,
      userId: user.id,
    },
  });

  const sessionToken = generateToken();
  const session = await createSession(sessionToken, user.id);

  const cookieStore = await cookies();

  cookieStore.set("session", sessionToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: session.expiresAt,
    path: "/",
  });

  await createEmailVerification(user.id);

  redirect("/");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (token) {
    const client = getClient();
    const sessionId = getSessionIdFromToken(token);
    await client.userSession.delete({
      where: { id: sessionId },
    });
  }

  deleteSessionTokenCookie();

  revalidatePath("/", "layout");
  redirect("/login");
}
