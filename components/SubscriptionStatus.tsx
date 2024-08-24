import { getUserDocument } from "@/lib/actions/users";
import PaymentButton from "./PaymentButton";
import ProgressBar from "./ProgressBar";
import { getSettings } from "@/lib/actions/settings";

type Props = {
  userId: string | null;
};

async function SubscriptionStatus({ userId }: Props) {
  let data = null;
  let settings = null;

  if (userId) {
    data = await getUserDocument(userId);
    settings = await getSettings();
  }

  return (
    <div>
      {data?.status !== "active" && (
        <ProgressBar
          amount={data?.msgAmount ?? 0}
          limit={settings?.msgAmountLimit ?? 0}
        />
      )}
      <div className="my-3 ml-1 pt-2 text-sm">
        Plan:{" "}
        <span className="ml-1 rounded-md bg-slate-400 px-1 font-semibold text-primary">
          {data?.status === "active" ? "Premium" : "Free"}
        </span>
      </div>
      {data?.status !== "active" && <PaymentButton userId={userId} />}
    </div>
  );
}

export default SubscriptionStatus;
