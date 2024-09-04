import SignIn from "@/app/auth/SignIn";
import SignOut from "@/app/auth/SignOut";
import { logtoConfig } from "@/lib/logto/logto";
import { signIn, signOut } from "@logto/next/server-actions";

type Props = {
  isAuthenticated: boolean | undefined;
};

async function AccesButton({ isAuthenticated }: Props) {
  return (
    <div>
      {isAuthenticated ? (
        <p>
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
    </div>
  );
}

export default AccesButton;
