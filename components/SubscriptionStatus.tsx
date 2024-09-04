import PaymentButton from "./PaymentButton";
import ProgressBar from "./ProgressBar";

type Props = {
  userId: string | null;
  msgAmountLimit: number;
  status?: string;
  msgAmount?: number;
};

async function SubscriptionStatus({
  userId,
  msgAmountLimit,
  status,
  msgAmount,
}: Props) {
  return (
    <div>
      {status !== "active" && (
        <ProgressBar amount={msgAmount ?? 0} limit={msgAmountLimit} />
      )}
      <div className="my-3 ml-1 pt-2 text-sm">
        Plan:{" "}
        <span className="ml-1 rounded-md bg-slate-400 px-1 font-semibold text-primary">
          {status === "active" ? "Premium" : "Free"}
        </span>
      </div>
      {status !== "active" && <PaymentButton userId={userId} />}
    </div>
  );
}

export default SubscriptionStatus;
