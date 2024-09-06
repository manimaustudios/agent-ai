import { SignIn } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function AuthDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button asChild>
          <div>Sign In</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="justify-center">
        <DialogHeader>
          <DialogTitle className="mb-2 text-center font-normal text-muted-foreground">
            You need to sign in first
          </DialogTitle>
          <SignIn
            routing="hash"
            signUpUrl="/sign-up"
            forceRedirectUrl="/agent"
          />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
