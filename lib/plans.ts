export type PremiumPlan = "monthly" | "lifetime";
export const MONTHLY_PRICE_USD = 4.99;
export const LIFETIME_PRICE_USD = 49.99;
export const FREE_MESSAGE_ALLOWANCE = 10;
export const LIVE_LIFETIME_PRICE_ID = "price_1UR8dZGIRNfFNwjggxF0WuaV";
export function isPremiumPlan(value: unknown): value is PremiumPlan {
  return value === "monthly" || value === "lifetime";
}
