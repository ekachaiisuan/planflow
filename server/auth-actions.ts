"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function signInAction(data: { email?: string; password?: string }) {
  try {
    const res = await auth.api.signInEmail({
      body: {
        email: data.email ?? "",
        password: data.password ?? "",
      },
      headers: await headers(),
    });
    return { data: res, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign in";
    return { data: null, error: { message } };
  }
}

export async function signUpAction(data: { name?: string; email?: string; password?: string }) {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        name: data.name ?? "",
        email: data.email ?? "",
        password: data.password ?? "",
      },
      headers: await headers(),
    });
    return { data: res, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to sign up";
    return { data: null, error: { message } };
  }
}

export async function requestPasswordResetAction(data: { email?: string; redirectTo?: string }) {
  try {
    const res = await auth.api.requestPasswordReset({
      body: {
        email: data.email ?? "",
        redirectTo: data.redirectTo ?? "/reset-password",
      },
      headers: await headers(),
    });
    return { data: res, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to request password reset";
    return { data: null, error: { message } };
  }
}

export async function resetPasswordAction(data: { password?: string; token?: string }) {
  try {
    const res = await auth.api.resetPassword({
      body: {
        newPassword: data.password ?? "",
        token: data.token ?? "",
      },
      headers: await headers(),
    });
    return { data: res, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to reset password";
    return { data: null, error: { message } };
  }
}

export async function sendVerificationEmailAction(data: { email?: string; callbackURL?: string }) {
  try {
    const res = await auth.api.sendVerificationEmail({
      body: {
        email: data.email ?? "",
        callbackURL: data.callbackURL ?? "/",
      },
      headers: await headers(),
    });
    return { data: res, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to send verification email";
    return { data: null, error: { message } };
  }
}
