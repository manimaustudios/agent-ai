"use server";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FREE_MESSAGE_ALLOWANCE } from "@/lib/plans";

interface Settings {
  msgAmountLimit: number;
  hoursToWait: number;
  msgAmountLimitMonthly: number;
  price: number;
}

export async function getSettings(): Promise<Settings> {
  const userDocRef = doc(db, "settings", "SITE_SETTINGS");
  try {
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const settings = userDocSnap.data();
      const allowance = settings.msgAmountLimit;
      return {
        ...settings,
        msgAmountLimit:
          Number.isInteger(allowance) && allowance >= 0
            ? allowance
            : FREE_MESSAGE_ALLOWANCE,
        hoursToWait: 0,
      } as Settings;
    }
  } catch (error) {
    console.log("Error fetching settings:", error);
  }
  return {
    msgAmountLimit: FREE_MESSAGE_ALLOWANCE,
    hoursToWait: 0,
    msgAmountLimitMonthly: 0,
    price: 0,
  };
}
