import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn routing="hash" signUpUrl="/sign-up" forceRedirectUrl="/agent" />
    </div>
  );
};

export default Page;
