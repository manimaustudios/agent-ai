import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { auth } from "@/lib/logto/auth";
import {
  ensureUserDocumentExists,
  hasLimitLeft,
  hasPremiumPlan,
} from "@/lib/actions/users";
import DisclaimerDialog from "@/components/DisclaimerDialog";

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

  const hasLimit = await hasLimitLeft(userId);
  const hasPremium = await hasPremiumPlan(userId);

  const canSendMessage = hasLimit || hasPremium;

  return (
    <div className="flex h-screen">
      <Sidebar isAuthenticated={isAuthenticated ?? false} userId={userId} />
      <Chat
        welcomeMessage={welcomeMessage}
        isAuthenticated={isAuthenticated ?? false}
        hasLimit={hasLimit ?? false}
        hasPremium={hasPremium}
        userId={userId}
      />
      {!isAuthenticated && <DisclaimerDialog />}
    </div>
  );
}

export default Page;
