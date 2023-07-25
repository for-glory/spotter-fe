export default function useStripeConnect() {
  const { stripeAccountId, stripeAccountState } = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  return {
    stripeAccountId: stripeAccountId ?? "",
    stripeAccountState: stripeAccountState ?? "",
  };
}
