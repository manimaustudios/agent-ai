import { SignUp } from "@clerk/nextjs";

export const runtime = "edge";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUp signInUrl="/sign-in" routing="hash" forceRedirectUrl="/agent" />
    </div>
  );
};

export default Page;
