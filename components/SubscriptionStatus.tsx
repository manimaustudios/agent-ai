import { getUserDocument } from "@/lib/actions/users";
import PaymentButton from "./PaymentButton";
import ProgressBar from "./ProgressBar";

type SubscriptionStatusProps = {
  userId: string | null;
  msgAmountLimit: number;
  status?: string;
  hasPremium: boolean;
};

async function SubscriptionStatus({
  userId,
  msgAmountLimit,
  status,
  hasPremium,
}: SubscriptionStatusProps) {
  let userData;

  if (userId) {
    userData = await getUserDocument(userId);
  }

  return (
    <div>
      {!hasPremium && (
        <ProgressBar amount={userData?.msgAmount ?? 0} limit={msgAmountLimit} />
      )}
      <div className="my-3 ml-1 pt-2 text-sm">
        Plan:{" "}
        <span className="ml-1 rounded-md bg-slate-400 px-1 font-semibold text-primary">
          {hasPremium ? "Premium" : "Free"}
        </span>
      </div>
      {!hasPremium && <PaymentButton userId={userId} />}
    </div>
  );
}

export default SubscriptionStatus;
