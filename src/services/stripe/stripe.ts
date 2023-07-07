import { loadStripe } from "@stripe/stripe-js";
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from "@vue/apollo-composable";
import initializeApollo from "@/apollo";

provideApolloClient(initializeApollo());

import {
  PaymentIntentMutation,
  PaymentIntentDocument,
  SetupIntentDocument,
  SetupIntentQuery,
  StripeCardsDocument,
  StripeCardsQuery,
  ChangePaymentMethodDocument,
  ChangePaymentMethodMutation,
  AppleGooglePaymentIntentQuery,
  AppleGooglePaymentIntentQueryVariables,
  AppleGooglePaymentIntentDocument,
  PaymentProvidersEnum,
  SetupIntentQueryVariables,
} from "@/generated/graphql";
import Card from "./card";

export class BackendStripe {
  private stripe: any;
  private key: string;
  public cards: Array<Card>;
  constructor(key: string) {
    this.key = key;
    this.cards = [];
  }
  async init() {
    this.stripe = await loadStripe(this.key);
  }
  redirectToCheckout(sessionId: string) {
    this.stripe.redirectToCheckout({ sessionId: sessionId });
  }
  async redirectToCardSaving(sessionId: string) {
    // await Browser.open({
    //   url,
    // }).then(() => {
    this.stripe.redirectToCheckout({ sessionId: sessionId });
    // });
  }
  getCards() {
    return useQuery<StripeCardsQuery>(StripeCardsDocument);
  }
  createSetupIntent(product_id: string) {
    return product_id
      ? useQuery<SetupIntentQuery>(SetupIntentDocument, {
          product_id,
        } as SetupIntentQueryVariables)
      : useQuery<SetupIntentQuery>(SetupIntentDocument);
  }
  createAppleGooglePaymentIntent({
    cart_id,
    provider,
  }: {
    cart_id: any;
    provider: PaymentProvidersEnum;
  }) {
    const params: AppleGooglePaymentIntentQueryVariables = {
      provider,
      cart_id: cart_id,
    };
    return useQuery<AppleGooglePaymentIntentQuery>(
      AppleGooglePaymentIntentDocument,
      params
    );
  }
  createPaymentIntent() {
    return useMutation<PaymentIntentMutation>(PaymentIntentDocument);
  }
  createSubscriptionIntent() {
    console.log("create subscription intent")
    return ;
  }
  changePaymentMethod() {
    return useMutation<ChangePaymentMethodMutation>(
      ChangePaymentMethodDocument
    );
  }
}
