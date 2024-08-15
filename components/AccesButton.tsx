import SignIn from "@/app/auth/SignIn";
import SignOut from "@/app/auth/SignOut";
import { auth } from "@/lib/logto/auth";
import { logtoConfig } from "@/lib/logto/logto";
import { signIn, signOut } from "@logto/next/server-actions";

type Props = {
  isAuth: boolean | undefined;
};

async function AccesButton({ isAuth }: Props) {
  const { isAuthenticated } = await auth();
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
