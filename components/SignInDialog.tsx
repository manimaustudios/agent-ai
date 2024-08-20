import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { FaChevronRight } from "react-icons/fa";
import SignIn from "@/app/auth/SignIn";
import { userSignIn } from "@/lib/actions/auth";

function SignInDialog() {
  const handleSignIn = async () => {
    await userSignIn();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button size="icon" asChild>
          <div className="h-10 w-10">
            <FaChevronRight className="h-4 w-4" />
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-6">
          <DialogTitle>You need to sign in first.</DialogTitle>
          <DialogDescription>
            You can start a conversation right after signing in or creating an
            account. Click the button below to access your account.
            <div className="pt-6">
              <SignIn onSignIn={handleSignIn} variant="default" />
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;
