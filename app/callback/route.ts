import { logtoConfig } from "@/lib/logto/logto";
import { handleSignIn } from "@logto/next/server-actions";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);

  redirect("/agent");
}
