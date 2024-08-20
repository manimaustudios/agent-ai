"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onSignIn: () => Promise<void>;
  variant?: "secondary" | "default";
};

const SignIn = ({ onSignIn, variant }: Props) => {
  return (
    <Button
      variant={variant ? variant : "secondary"}
      onClick={() => {
        onSignIn();
      }}
    >
      Sign In
    </Button>
  );
};

export default SignIn;
