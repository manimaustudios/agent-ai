import { UserScope } from "@logto/next";

export const logtoConfig = {
  endpoint: "https://n5gxlg.logto.app/",
  appId: "5vy96pjwupntqtf0nvz83",
  appSecret: "0kA05be0Da7rbBdQmBJiYy08lmXm79V7",
  baseUrl: "http://localhost:3000", // Change to your own base URL
  cookieSecret: "TMpDBdKnVmfVQmcWV3AczYJT8yKyyFrs", // Auto-generated 32 digit secret
  cookieSecure: process.env.NODE_ENV === "production",
  scopes: [UserScope.Email, UserScope.Profile],
};
