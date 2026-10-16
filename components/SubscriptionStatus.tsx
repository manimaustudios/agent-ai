import { getUserDocument } from "@/lib/actions/users";
import PaymentButton from "./PaymentButton";
import ProgressBar from "./ProgressBar";

type SubscriptionStatusProps = {
  userId: string | null;
  msgAmountLimit: number;
  status?: string;
  hasPremium: boolean;
  monthlyLimit?: number;
};

async function SubscriptionStatus({
  userId,
  msgAmountLimit,
  status,
  hasPremium,
  monthlyLimit,
}: SubscriptionStatusProps) {
  let userData;

  if (userId) {
    userData = await getUserDocument(userId);
  }

  return (
    <div>
      {!hasPremium && (
        <ProgressBar
          amount={userData?.freeMessagesUsed ?? 0}
          limit={msgAmountLimit}
        />
      )}
      <div className="my-3 ml-1 pt-2 text-sm">
        Plan:{" "}
        <span className="ml-1 rounded-md bg-slate-400 px-1 font-semibold text-primary">
          {hasPremium ? "Premium" : "Free"}
        </span>
      </div>
      {!hasPremium && (
        <PaymentButton userId={userId} monthlyLimit={monthlyLimit} />
      )}
    </div>
  );
}

export default SubscriptionStatus;
