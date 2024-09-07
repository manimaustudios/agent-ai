"use client";

import { SignIn, useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useEffect, useState } from "react";

type AuthDialogProps = {
  buttonIcon?: React.ReactNode;
};

export function AuthDialog({ buttonIcon }: AuthDialogProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    const hash = window.location.hash;
    const isCallback = hash.includes("sso-callback");

    if (isCallback) {
      setOpen(true);
    } else if (isSignedIn) {
      setOpen(false);
    }
  }, [isSignedIn, isLoaded]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          <div>{buttonIcon ? buttonIcon : "Sign In"}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto justify-center">
        <DialogHeader>
          <DialogTitle className="mb-2 pt-4 text-center font-normal text-muted-foreground"></DialogTitle>
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            afterSignInUrl="/agent"
            afterSignUpUrl="/agent"
          />
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
