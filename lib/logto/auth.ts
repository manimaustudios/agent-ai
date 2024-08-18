// "use server";

import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "./logto";

export async function auth() {
  let isAuthenticated = false;
  let claims = null;
  let userInfo = null;
  try {
    const data = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
    isAuthenticated = data.isAuthenticated;
    claims = data.claims;
    userInfo = data.userInfo;
  } catch (error) {
    return { userId: null };
  }

  if (!isAuthenticated || !claims) {
    return { userId: null };
  }

  const email = userInfo?.email || claims.email;

  return {
    userId: claims.sub,
    userEmail: email,
    isAuthenticated,
  };
}
