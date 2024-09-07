"use server";

import {
  doc,
  FirestoreError,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getSettings } from "./settings";
import { revalidatePath } from "next/cache";

type User = {
  email: string;
  createdAt: string;
  status?: string;
  msgAmount: number;
  firstMsgTime?: Timestamp;
  subscriptionId?: string;
  firstMsgTimeMonthly?: Timestamp;
  msgAmountMonthly: number;
  currentChatId?: string;
};

export async function getUserDocument(userId: string): Promise<User | null> {
  const userDocRef = doc(db, "users", userId);
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data() as User;
    }
  } catch (error) {
    if ((error as FirestoreError).code === "permission-denied") {
      // Permission denied, document associated with the user does not exist
      return null;
    } else {
      throw error;
    }
  }
  return null;
}

async function createUserDocument(
  userId: string,
  userEmail: string,
): Promise<User> {
  const userData: User = {
    email: userEmail,
    createdAt: new Date().toISOString(),
    msgAmount: 0,
    msgAmountMonthly: 0,
    currentChatId: "",
  };

  await setDoc(doc(db, "users", userId), {
    userId,
    email: userEmail,
    createdAt: userData.createdAt,
    msgAmount: 0,
    msgAmountMonthly: 0,
    firstMsgTime: null,
    currentChatId: "",
  });
  return userData;
}

export async function ensureUserDocumentExists(
  userId: string,
  userEmail: string,
): Promise<User | null> {
  if (!userId || !userEmail) {
    throw new Error("User ID or email is missing.");
  }
  let userData = await getUserDocument(userId);

  if (userData === null) {
    userData = await createUserDocument(userId, userEmail);
  }
  return userData;
}

export async function hasLimitLeft(
  userId: string | null,
  userData: User | null,
  msgAmountLimit: number,
  hoursToWait: number,
  msgAmountLimitMonthly: number,
) {
  if (!userId) return false;
  if (!userData) return false;

  const now = Timestamp.now();
  const userDocRef = doc(db, "users", userId);

  // Check if user daily message limit can be reset
  if (userData?.firstMsgTime) {
    const timeDiff = now.seconds - userData.firstMsgTime.seconds;
    const hoursPassed = timeDiff / 3600; // convert seconds to hours

    // Reset msgAmount when daily time limit is reached
    if (hoursPassed >= hoursToWait) {
      await updateDoc(userDocRef, {
        msgAmount: 0,
      });

      revalidatePath("/");
      return true;
    }
  }

  // Check if user montly message limit can be reset
  if (userData?.firstMsgTimeMonthly) {
    const timeDiff = now.seconds - userData.firstMsgTimeMonthly.seconds;
    const hoursPassed = timeDiff / 3600; // convert seconds to hours

    // Reset msgAmountMonthly when monthly time limit is reached
    if (hoursPassed >= 720) {
      await updateDoc(userDocRef, {
        msgAmountMonthly: 0,
      });

      revalidatePath("/agent");
      return true;
    }
  }

  // Check if user has reached the message limit for the day
  if (userData && userData.msgAmount >= msgAmountLimit) {
    return false;
  }

  // Check if user has reached the message limit for the month
  if (userData && userData.msgAmountMonthly >= msgAmountLimitMonthly) {
    return false;
  }

  return true;
}

export async function updateMsgAmount(
  userId: string | null,
  hasPremium: boolean,
) {
  if (!userId) return;

  const userData = await getUserDocument(userId);
  const { msgAmountLimit } = await getSettings();

  const userDocRef = doc(db, "users", userId);
  if (userData && userData.msgAmount < msgAmountLimit) {
    await updateDoc(userDocRef, {
      msgAmount: hasPremium ? userData.msgAmount : userData.msgAmount + 1,
      msgAmountMonthly: userData.msgAmountMonthly + 1,
      firstMsgTime:
        userData.msgAmount === 0 ? Timestamp.now() : userData.firstMsgTime,
      firstMsgTimeMonthly:
        userData.msgAmountMonthly === 0
          ? Timestamp.now()
          : userData.firstMsgTimeMonthly,
    });
  }
  revalidatePath("/agent");
}

export async function hasPremiumPlan(
  userId: string | null,
  userData: User | null,
) {
  if (!userId) return false;

  try {
    if (userData?.status === "active") return true;
    if (!userData?.subscriptionId) return false;

    const subDocRef = doc(db, "subscriptions", userData.subscriptionId);
    const subDocSnap = await getDoc(subDocRef);

    if (!subDocSnap.exists()) {
      return false; // No subscription found
    }

    const subData = subDocSnap.data();
    const nextBillingDate = subData?.nextBillingDate;

    if (!nextBillingDate) {
      return false; // No billing date, subscription is invalid
    }

    const now = new Date();
    const billingDate = new Date(nextBillingDate.seconds * 1000);

    // Next billing date is in the future, subscription is active
    if (billingDate > now) {
      return true;
    }

    return false; // Subscription is expired
  } catch (error) {
    console.log("Error checking premium plan:", error);
    return false;
  }
}

export async function updateCurrentChatId(
  userId: string | null,
  chatId: string | undefined,
) {
  console.log("chatID in server action:", chatId);
  try {
    if (!userId) return;

    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, {
      currentChatId: chatId ?? "",
    });
    revalidatePath("/agent");
  } catch (error) {
    console.log("Error updating current chat ID:", error);
  }
}
