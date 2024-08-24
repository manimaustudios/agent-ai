import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { auth } from "@/lib/logto/auth";
import {
  ensureUserDocumentExists,
  hasLimitLeft,
  hasPremiumPlan,
} from "@/lib/actions/users";
import DisclaimerDialog from "@/components/DisclaimerDialog";
import AccesButton from "@/components/AccesButton";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { getSettings } from "@/lib/actions/settings";
import { ThemeToggle } from "@/components/ThemeToggle";

async function Page() {
  const { userId, userEmail, isAuthenticated } = await auth();

  if (!isAuthenticated || !userId || !userEmail) {
    console.error("User is not authenticated or missing user data.");
  }

  let userData = null;
  let welcomeMessage = "Hi, how can I help you today?";

  try {
    if (isAuthenticated && userId && userEmail) {
      userData = await ensureUserDocumentExists(userId, userEmail);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }

  const { msgAmountLimit, hoursToWait, msgAmountLimitMonthly } =
    await getSettings();
  const hasLimit = await hasLimitLeft(
    userId,
    userData,
    msgAmountLimit,
    hoursToWait,
    msgAmountLimitMonthly,
  );
  const hasPremium = await hasPremiumPlan(userId, userData);

  const isMonthlyLimitReached =
    (userData?.msgAmountMonthly ?? 0) >= msgAmountLimitMonthly;

  return (
    <>
      <Sidebar isAuthenticated={isAuthenticated ?? false} userId={userId}>
        {isAuthenticated && <SubscriptionStatus userId={userId} />}
        <div className="flex gap-4">
          <AccesButton isAuth={isAuthenticated} />
          <ThemeToggle />
        </div>
      </Sidebar>
      <Chat
        welcomeMessage={welcomeMessage}
        isAuthenticated={isAuthenticated ?? false}
        hasLimit={hasLimit ?? false}
        hasPremium={hasPremium}
        userId={userId}
        messageLimit={msgAmountLimit ?? 0}
        hoursToWait={hoursToWait ?? 0}
        isMonthlyLimitReached={isMonthlyLimitReached}
        monthlyLimit={msgAmountLimitMonthly ?? 0}
      />
      {!isAuthenticated && <DisclaimerDialog />}
    </>
  );
}

export default Page;
