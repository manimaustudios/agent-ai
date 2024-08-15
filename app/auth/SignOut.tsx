"use client";

import { Button } from "@/components/ui/button";

type Props = {
  onSignOut: () => Promise<void>;
};

const SignOut = ({ onSignOut }: Props) => {
  return (
    <Button
      onClick={() => {
        onSignOut();
      }}
    >
      Sign Out
    </Button>
  );
};

export default SignOut;
