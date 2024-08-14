import { getLogtoContext, signIn, signOut } from "@logto/next/server-actions";
import { Button } from "./ui/button";
import { logtoConfig } from "@/lib/logto/logto";
import SignOut from "@/app/auth/SignOut";
import SignIn from "@/app/auth/SignIn";

async function Header() {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  return (
    <header className="mx-auto flex max-w-screen-xl items-center justify-between px-2 py-4 md:px-6 lg:px-12">
      <p className="text-lg">appname</p>
      <div className="flex gap-3">
        {/* <Button>Sign In</Button> */}
        {/* <Button>Sign Up</Button> */}
        <nav>
          {isAuthenticated ? (
            <p>
              Hello, {claims?.sub},
              <SignOut
                onSignOut={async () => {
                  "use server";

                  await signOut(logtoConfig);
                }}
              />
            </p>
          ) : (
            <p>
              <SignIn
                onSignIn={async () => {
                  "use server";

                  await signIn(logtoConfig);
                }}
              />
            </p>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
