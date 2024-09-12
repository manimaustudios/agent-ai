import { SignIn } from "@clerk/nextjs";

// export const runtime = "edge";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn routing="hash" signUpUrl="/sign-up" forceRedirectUrl="/agent" />
    </div>
  );
};

export default Page;
