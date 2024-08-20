import { getUserDocument } from "@/lib/actions/users";
import PaymentButton from "./PaymentButton";

type Props = {
  userId: string | null;
};

async function SubscriptionStatus({ userId }: Props) {
  let data = null;

  if (userId) {
    data = await getUserDocument(userId);
  }

  return (
    <div>
      <div className="mb-3 ml-1 text-sm text-slate-200">
        Plan:{" "}
        <span className="ml-1 rounded-md bg-slate-300 px-1 font-semibold text-primary">
          {data?.status === "active" ? "Premium" : "Free"}
        </span>
      </div>
      {data?.status !== "active" && <PaymentButton userId={userId} />}
    </div>
  );
}

export default SubscriptionStatus;
