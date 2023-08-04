import { SubscriptionsTierEnum } from "@/generated/graphql";

export default function useSubscription() {
  const currentSubscriptionUser =  localStorage.getItem("currentSubscription")
  const {currentSubscription} =  JSON.parse(localStorage.getItem("user") || "{}");

  return {
    type: currentSubscriptionUser ?? SubscriptionsTierEnum.Basic,
    currentSubscription,
  };
}
