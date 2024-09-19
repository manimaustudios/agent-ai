"use client";

import { SignUp, useAuth } from "@clerk/nextjs";

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
import { ClassNameValue } from "tailwind-merge";
import { cn } from "@/lib/utils";

type SignUpDialogProps = {
  buttonIcon?: React.ReactNode;
  className?: ClassNameValue;
};

export function SignUpDialog({ buttonIcon, className }: SignUpDialogProps) {
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
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className={cn(className)}
        >
          <div>{buttonIcon ? buttonIcon : "Sign Up"}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-auto justify-center">
        <DialogHeader>
          <DialogTitle className="mb-2 pt-4 text-center font-normal text-muted-foreground"></DialogTitle>
          <SignUp
            routing="hash"
            signInUrl="/sign-in"
            afterSignInUrl="/agent"
            afterSignUpUrl="/agent"
          />
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
