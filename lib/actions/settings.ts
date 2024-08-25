"use server";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Settings {
  msgAmountLimit: number;
  hoursToWait: number;
  msgAmountLimitMonthly: number;
}

export async function getSettings(): Promise<Settings> {
  const userDocRef = doc(db, "settings", "SITE_SETTINGS");
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return userDocSnap.data() as Settings;
    }
  } catch (error) {
    console.log("Error fetching settings:", error);
  }
  return {
    msgAmountLimit: 0,
    hoursToWait: 0,
    msgAmountLimitMonthly: 0,
  };
}
