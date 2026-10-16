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
import { hasPremiumAccess } from "@/lib/access";
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
  freeMessagesUsed?: number;
  lifetimeStatus?: string;
  cancelAtPeriodEnd?: boolean;
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
  _hoursToWait: number,
  _msgAmountLimitMonthly: number,
) {
  return Boolean(
    userId && userData && (userData.freeMessagesUsed || 0) < msgAmountLimit,
  );
}

export async function hasPremiumPlan(
  userId: string | null,
  userData: User | null,
) {
  if (!userId || !userData) return false;
  if (userData.lifetimeStatus === "active") return true;
  if (!userData.subscriptionId) return false;
  const snapshot = await getDoc(
    doc(db, "subscriptions", userData.subscriptionId),
  );
  return hasPremiumAccess(userData, snapshot.data());
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
