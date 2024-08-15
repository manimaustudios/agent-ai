"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onSignIn: () => Promise<void>;
};

const SignIn = ({ onSignIn }: Props) => {
  return (
    <Button
      onClick={() => {
        onSignIn();
      }}
    >
      Sign In
    </Button>
  );
};

export default SignIn;
