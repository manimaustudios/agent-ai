"use server";

import { logtoConfig } from "../logto/logto";
import { signIn } from "@logto/next/server-actions";

export async function userSignIn() {
  await signIn(logtoConfig);
}
