import { SignIn } from "@clerk/nextjs";
import { AppClerkProvider } from "@/lib/providers/AppClerkProvider";

// export const runtime = "edge";

const Page = () => {
  return (
    <AppClerkProvider>
      <div className="flex min-h-screen items-center justify-center">
        <SignIn
          routing="hash"
          signUpUrl="/sign-up"
          forceRedirectUrl="/agent"
        />
      </div>
    </AppClerkProvider>
  );
};

export default Page;
