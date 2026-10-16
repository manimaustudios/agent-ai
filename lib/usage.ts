import "server-only";
import { doc, runTransaction, Timestamp } from "firebase/firestore";
import { db } from "./firebase";
import { hasPremiumAccess } from "./access";
import { getSettings } from "./actions/settings";

type Reservation = { userId: string; kind: "free" | "premium"; period: number };

export async function reserveMessage(userId: string): Promise<Reservation> {
  const { msgAmountLimit, msgAmountLimitMonthly } = await getSettings();
  return runTransaction(db, async (transaction) => {
    const ref = doc(db, "users", userId);
    const user = (await transaction.get(ref)).data();
    if (!user) throw new Error("Account not found.");
    const subscription = user.subscriptionId
      ? (
          await transaction.get(doc(db, "subscriptions", user.subscriptionId))
        ).data()
      : undefined;
    if (hasPremiumAccess(user, subscription)) {
      const now = Timestamp.now();
      const previous = user.firstMsgTimeMonthly?.seconds || 0;
      const expired = now.seconds - previous >= 30 * 24 * 60 * 60;
      const used = expired ? 0 : user.msgAmountMonthly || 0;
      if (used >= msgAmountLimitMonthly)
        throw new Error("PREMIUM_LIMIT_REACHED");
      const period = expired || !previous ? now.seconds : previous;
      transaction.update(ref, {
        msgAmountMonthly: used + 1,
        firstMsgTimeMonthly: Timestamp.fromMillis(period * 1000),
      });
      return { userId, kind: "premium", period };
    }
    const used = user.freeMessagesUsed || 0;
    if (used >= msgAmountLimit) throw new Error("FREE_LIMIT_REACHED");
    transaction.update(ref, { freeMessagesUsed: used + 1 });
    return { userId, kind: "free", period: 0 };
  });
}

export async function releaseMessage(reservation: Reservation) {
  await runTransaction(db, async (transaction) => {
    const ref = doc(db, "users", reservation.userId);
    const user = (await transaction.get(ref)).data();
    if (!user) return;
    if (reservation.kind === "free") {
      transaction.update(ref, {
        freeMessagesUsed: Math.max(0, (user.freeMessagesUsed || 0) - 1),
      });
    } else if (user.firstMsgTimeMonthly?.seconds === reservation.period) {
      transaction.update(ref, {
        msgAmountMonthly: Math.max(0, (user.msgAmountMonthly || 0) - 1),
      });
    }
  });
}
