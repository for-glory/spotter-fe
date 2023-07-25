import { SubscriptionsTierEnum } from "@/generated/graphql";

export default function useSubscription() {
  const currentSubscription =  localStorage.getItem("currentSubscription")

  return {
    type: currentSubscription ?? SubscriptionsTierEnum.Basic,
  };
}
