import type { Metadata } from "next";

import Sidebar from "@/components/Sidebar";
import Chat from "@/components/Chat";
import { auth } from "@/lib/logto/auth";
import {
  ensureUserDocumentExists,
  getUserDocument,
  hasLimitLeft,
  hasPremiumPlan,
} from "@/lib/actions/users";
import DisclaimerDialog from "@/components/DisclaimerDialog";
import AccesButton from "@/components/AccesButton";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import { getSettings } from "@/lib/actions/settings";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getAllChats } from "@/lib/actions/chats";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";

export async function metadata(): Promise<Metadata> {
  const { userId, userEmail } = await auth();

  let metaTitle = "Online Therapist Chat";
  let metaDescription =
    "Explore our unique AI therapy chatbots, each designed to offer personalized mental health support. From cognitive-behavioral therapy to mindfulness coaching, our AI therapists provide accessible, confidential, and effective solutions for stress, anxiety, depression, and more. Get tailored therapy anytime, anywhere.";

  if (userId && userEmail) {
    const user = await ensureUserDocumentExists(userId, userEmail);
    const chats = await getAllChats();

    const currentChat = user?.currentChatId
      ? chats.find((chat) => chat.chatId === user.currentChatId)
      : null;

    if (currentChat?.seoTitle) {
      metaTitle = currentChat.seoTitle;
    }
    if (currentChat?.seoDescription) {
      metaDescription = currentChat.seoDescription;
    }
  }

  return {
    title: metaTitle,
    description: metaDescription,
  };
}

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

  const chatList = await getAllChats();

  const isMonthlyLimitReached =
    (userData?.msgAmountMonthly ?? 0) >= msgAmountLimitMonthly;

  return (
    <>
      <Sidebar isAuthenticated={isAuthenticated ?? false} userId={userId}>
        {isAuthenticated && (
          <SubscriptionStatus
            userId={userId}
            msgAmountLimit={msgAmountLimit}
            status={userData?.status ?? ""}
            msgAmount={userData?.msgAmount ?? 0}
          />
        )}
        <div className="flex gap-1">
          <AccesButton isAuthenticated={isAuthenticated} />
          <ThemeToggle />
          {isAuthenticated && (
            <UserProfileDropdown
              userId={userId}
              status={userData?.status}
              userEmail={userEmail ?? ""}
            />
          )}
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
        chatList={chatList}
      />
      {!isAuthenticated && <DisclaimerDialog />}
    </>
  );
}

export default Page;
