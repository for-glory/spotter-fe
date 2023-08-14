import { SubscriptionsTierEnum } from "@/generated/graphql";

export default function useSubscription() {
  const currentSubscription =  localStorage.getItem("currentSubscription")
  // const {currentSubscription} =  JSON.parse(localStorage.getItem("user") || "{}");

  return {
    type: currentSubscription ?? SubscriptionsTierEnum.Basic,
    currentSubscription,
  };
}
