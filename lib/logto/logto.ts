import { UserScope } from "@logto/next";

export const logtoConfig = {
  endpoint: process.env.LOGTO_ENDPOINT!,
  appId: process.env.LOGTO_APP_ID!,
  appSecret: process.env.LOGTO_APP_SECRET!,
  baseUrl:
    process.env.NODE_ENV === "production"
      ? process.env.PRODUCTION_BASE_URL!
      : "http://localhost:3000",
  cookieSecret: process.env.LOGTO_COOKIE_SECRET!,
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: [UserScope.Email, UserScope.Profile],
};

console.log("Logto config:", logtoConfig);
