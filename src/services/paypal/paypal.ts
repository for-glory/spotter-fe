import {
  useQuery,
  useMutation,
  provideApolloClient,
} from "@vue/apollo-composable";
import initializeApollo from "@/apollo";
provideApolloClient(initializeApollo());

import {
  PaypalTokenQuery,
  PaypalTokenDocument,
  PayWithPaypalMutation,
  PayWithPaypalDocument,
} from "@/generated/graphql";

export class BackendPaypal {
  createPaypalToken() {
    return useQuery<PaypalTokenQuery>(PaypalTokenDocument);
  }
  makePaymentRequest() {
    return useMutation<PayWithPaypalMutation>(PayWithPaypalDocument);
  }
}
