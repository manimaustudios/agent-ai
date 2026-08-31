import { SignUp } from "@clerk/nextjs";
import { AppClerkProvider } from "@/lib/providers/AppClerkProvider";

// export const runtime = "edge";

const Page = () => {
  return (
    <AppClerkProvider>
      <div className="flex min-h-screen items-center justify-center">
        <SignUp signInUrl="/sign-in" routing="hash" forceRedirectUrl="/agent" />
      </div>
    </AppClerkProvider>
  );
};

export default Page;
