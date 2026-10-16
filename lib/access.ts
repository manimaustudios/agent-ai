export function hasPremiumAccess(
  user: { lifetimeStatus?: string },
  subscription?: {
    status?: string;
    currentPeriodEnd?: string;
    nextBillingDate?: string;
  },
  now = Date.now(),
) {
  if (user.lifetimeStatus === "active") return true;
  if (
    !subscription ||
    !["active", "trialing", "canceled"].includes(subscription.status || "")
  )
    return false;
  return (
    new Date(
      subscription.currentPeriodEnd || subscription.nextBillingDate || "",
    ).getTime() > now
  );
}
