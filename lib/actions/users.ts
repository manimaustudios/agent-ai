"use server";

import { doc, FirestoreError, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
  email: string;
  createdAt: string;
  status?: string;
}

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
  };
  await setDoc(doc(db, "users", userId), {
    userId,
    email: userEmail,
    createdAt: userData.createdAt,
  });
  console.log("User document created successfully.");
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
