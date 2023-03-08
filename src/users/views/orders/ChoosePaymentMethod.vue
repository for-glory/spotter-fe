<template>
  <base-layout :full-width-footer="false">
    <template #header>
      <page-header back-btn @back="onBack" title="Payment" />
    </template>
    <template #content>
      <ion-spinner class="spinner" name="lines" v-if="loading" />
      <template v-else>
        <card-form v-if="cardCreation" />
        <div v-else class="cards">
          <ion-title class="cards__title">Payment Method</ion-title>
          <div class="cards__container" v-if="preparedCards?.length">
            <base-carousel
              show-start
              :items="preparedCards"
              :slides-offset-after="16"
              :slides-offset-before="16"
            >
              <template #start>
                <ion-button @click="onCardCreation" class="add-card">
                  <ion-icon
                    src="assets/icon/payment/plus.svg"
                    class="add-icon"
                  />
                </ion-button>
              </template>
              <template v-slot:default="preparedCards">
                <card
                  v-for="card in preparedCards"
                  :key="card.id"
                  :card-holder="card.card_holder"
                  :card-number="card.pm_last_four"
                  :exp-date="card.exp_month + '/' + card.exp_year"
                  :is-default="card.is_default"
                  class="card-slide"
                  @click="changePaymentMethod(card.id)"
                />
              </template>
            </base-carousel>
          </div>
          <template v-else>
            <add-card-button class="add-card-btn" @click="onCardCreation" />
          </template>
        </div>
        <div class="separator" v-if="!isZeroPayment">
          <ion-text class="optional">or pay with</ion-text>
        </div>
        <ion-title class="separator text-align-center" v-else
          >Products you've chosen are free. Click "Confirm" button to
          continue.</ion-title
        >
        <div class="payment__methods">
          <ion-note v-if="errorMessage">
            {{ errorMessage }}
          </ion-note>
          <payment-method
            v-for="paymentMethod in paymentMethods"
            :icon="paymentMethod.icon"
            :title="paymentMethod.title"
            :key="paymentMethod.key"
            :id="paymentMethod.key"
            :hidden="paymentMethod.isHidden"
            @click="handleAdditionalPaymentMethod(paymentMethod.key)"
          />
        </div>
      </template>
    </template>
    <template #footer>
      <ion-button
        @click="onSubmit"
        class="submit-btn"
        :disabled="preparedCards.length < 1"
      >
        {{ preparedCards.length < 1 ? "Create card" : "Confirm" }}
      </ion-button>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import CardForm from "@/general/components/forms/CardForm.vue";
import {
  IonText,
  IonButton,
  IonTitle,
  IonIcon,
  IonNote,
  isPlatform,
  toastController,
  IonSpinner,
} from "@ionic/vue";
import PaymentMethod from "@/general/components/blocks/payment/PaymentMethod.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Card from "@/general/components/blocks/payment/Card.vue";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { useRouter, useRoute } from "vue-router";
import { BackendStripe } from "@/services/stripe/stripe";
import { BackendPaypal } from "@/services/paypal/paypal";
import { Cards } from "@/services/stripe/cards";
import AddCardButton from "@/general/components/blocks/payment/AddCardButton.vue";
import {
  Stripe as capacitorStripe,
  ApplePayEventsEnum,
  GooglePayEventsEnum,
} from "@capacitor-community/stripe";
import { GetCartDocument, PaymentProvidersEnum } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { navigationAfterPaymentCompleted } from "@/helpers/purchaseRouterNavigation";
import debounce from "lodash/debounce";

const paymentMethods = ref([
  { icon: "apple", title: "Pay", key: "applePay", isHidden: true },
  {
    icon: "google",
    title: "Pay with Google Pay",
    key: "googlePay",
    isHidden: true,
  },
  { icon: "paypal", title: "PayPal", key: "paypal", isHidden: true },
]);

const VUE_APP_STRIPE_PUBLIC_KEY = process.env.VUE_APP_STRIPE_PUBLIC_KEY;
const VUE_APP_APPLE_MERCHANT_ID = process.env.VUE_APP_APPLE_MERCHANT_ID;
const cardCreation = ref(false);
const preparedCards = ref<typeof Card[]>([]);
const errorMessage = ref("");
const isGoogleAvailable = ref();
const isAppleAvailable = ref();
const router = useRouter();
const route = useRoute();
const cardsContainer = new Cards();
const isZeroPayment = ref(false);
const isACardInAppleWallet = ref(true);
const interval = ref(null);

const backendStripe = new BackendStripe(VUE_APP_STRIPE_PUBLIC_KEY || "");
const backendPaypal = new BackendPaypal();
declare const braintree: any;

onUnmounted(() => {
  clearInterval(interval.value);
});

const { result, loading } = useQuery(
  GetCartDocument,
  {
    id: route.query.cart_id,
  },
  {
    fetchPolicy: "no-cache",
  }
);

onMounted(() => {
  refetch();
  if (isFreeProducts.value) {
    isZeroPayment.value = true;
    return;
  }

  backendStripe.init();

  capacitorStripe
    .initialize({
      publishableKey: VUE_APP_STRIPE_PUBLIC_KEY,
    })
    .then(() => {
      checkIfGpayAvailable();
      checkIfApplepayAvailable();
    });
  addPaypal();

  interval.value = setInterval(() => {
    refetch();
  }, 5000);
});

const { mutate: changeCard } = backendStripe.changePaymentMethod();
const { mutate: createPaymentIntent } = backendStripe.createPaymentIntent();
const { onResult: cardsResult, refetch } = backendStripe.getCards();

// temporary solution for updating new cards
const getCards = debounce(() => {
  refetch();
}, 5000);

getCards();

const { onResult: getPaypalToken } = backendPaypal.createPaypalToken();
const { mutate: makePaymentRequest } = backendPaypal.makePaymentRequest();

const addPaypal = () => {
  const script = document.createElement("script");
  script.src = "https://js.braintreegateway.com/js/braintree-2.32.1.min.js";
  script.addEventListener("load", initializeBraintree());
  document.body.appendChild(script);
};

const products = computed(() => result.value?.getCart?.items);

const initializeBraintree = () => {
  if (products.value?.length < 1) {
    errorMessage.value = "Paypal not initialized: select the products first.";

    return;
  }
  getPaypalToken((response) => {
    paymentMethods.value.forEach((paymentMethod) => {
      if (!isZeroPayment.value && paymentMethod.key === "paypal")
        paymentMethod.isHidden = false;
    });

    let checkout: any;
    braintree.setup(response?.data?.paypalToken?.token, "custom", {
      paypal: {
        container: "paypal",
      },
      onReady: function (integration: any) {
        checkout = integration;
      },
      onError: function () {
        // Paypal Checkout page errors output here, before calling backend
        initializeBraintree();
      },
      onCancelled: () => {
        checkout.teardown(() => {
          checkout = null;
        });
        initializeBraintree();
      },
      onPaymentMethodReceived: (obj: any) => {
        checkout.teardown(() => {
          checkout = null;
          handleBraintreePayment(obj.nonce);
        });
      },
    });
  });
};

const handleBraintreePayment = (nonce: any) => {
  errorMessage.value = "";

  makePaymentRequest({
    cart_id: route.query.cart_id,
    nonce: nonce,
  })
    .then((response: any) => {
      const payload = JSON.parse(response?.data?.payWithPaypal?.result);
      // only when 'payload.success === true' it means that payment gateway call was successfull
      if (payload.success === true) {
        navigationAfterPaymentCompleted(
          route.params.orderId,
          route.query.cart_id as string
        );
        return true;
      }
      //otherwise we need to let user know what was the reason of failure.
      errorMessage.value = payload.message;

      return;
    })
    .catch((response: any) => {
      const payload = response?.data?.payWithPaypal?.result;
      errorMessage.value = payload.message;

      return false;
    });
  initializeBraintree();
};

const onSubmit = () => {
  errorMessage.value = "";
  if (products.value?.length < 1) {
    errorMessage.value = "Select the products first.";

    return;
  }

  createPaymentIntent({
    cart_id: route.query.cart_id,
    purchasable_product_id: route.params.orderId,
  })
    .then((data) => {
      let isZeroPayment = data?.data?.paymentIntent?.zeroPayment;
      if (isZeroPayment) {
        navigationAfterPaymentCompleted(
          route.params.orderId,
          route.query.cart_id as string
        );
      }

      let intent = JSON.parse(data?.data?.paymentIntent?.session);
      backendStripe.redirectToCheckout(intent.id);
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });

  if (cardCreation.value) {
    cardCreation.value = !cardCreation.value;
  } else {
    // TODO need find solution how to transit user to Payment Success page
  }
};

cardsResult((response) => {
  cardsContainer.init(response?.data?.cards?.data || []);
  preparedCards.value = cardsContainer.cards;
});

const changePaymentMethod = (cardId: number) => {
  changeCard({ card_id: cardId })
    .then(() => {
      preparedCards.value.forEach((element: typeof Card) => {
        element.is_default = element.id === cardId;
      });
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });
};

const onCardCreation = async () => {
  const { onResult } = backendStripe.createSetupIntent(route.params.orderId);
  onResult((setupIntentResult) => {
    let intent = JSON.parse(setupIntentResult?.data?.setupIntent?.session);
    backendStripe.redirectToCardSaving(intent.id, intent.url);
  });
};

const onBack = () => {
  router.go(-1);
};

capacitorStripe.addListener(ApplePayEventsEnum.Completed, () => {
  navigationAfterPaymentCompleted(
    route.params.orderId,
    route.query.cart_id as string
  );
});

capacitorStripe.addListener(ApplePayEventsEnum.Failed, () => {
  errorMessage.value = "Something went wrong, please try again";
  // @TODO create correct behaviour of failed payment
});

capacitorStripe.addListener(GooglePayEventsEnum.Completed, () => {
  navigationAfterPaymentCompleted(
    route.params.orderId,
    route.query.cart_id as string
  );
  // @TODO create correct behaviour of completed payment
});

capacitorStripe.addListener(GooglePayEventsEnum.Failed, () => {
  errorMessage.value = "Something went wrong, please try again";
  // @TODO create correct behaviour of failed payment
});

const handleAdditionalPaymentMethod = async (paymentMethod: string) => {
  switch (paymentMethod) {
    case "applePay":
      await applepay();
      break;
    case "googlePay":
      await googlepay();
      break;
    default:
      break;
  }
};

const applepay = async () => {
  if (isACardInAppleWallet.value) {
    const { onResult } = backendStripe.createAppleGooglePaymentIntent({
      cart_id: route.query.cart_id,
      provider: PaymentProvidersEnum.Apple,
    });
    onResult(async (result) => {
      const paymentIntent = JSON.parse(
        result.data.appleGooglePaymentIntent.paymentIntent
      );

      await capacitorStripe.createApplePay({
        paymentIntentClientSecret: paymentIntent.client_secret,
        paymentSummaryItems: [
          {
            label: products.value[0].productable?.title,
            amount: products.value[0].productable?.price / 100,
            // (be aware that apple shows a one thousand and ninty nine), while google shows 10.99
          },
        ],
        merchantIdentifier: VUE_APP_APPLE_MERCHANT_ID,
        countryCode: "US",
        currency: "USD",
      });

      await capacitorStripe.presentApplePay();
    });
  } else {
    const toast = await toastController.create({
      message: "Please, add a card to Apple Wallet to use with Apple Pay",
      duration: 3000,
      icon: "assets/icon/info.svg",
      cssClass: "warning-toast",
    });
    toast.present();
  }
};

const checkIfGpayAvailable = async () => {
  isGoogleAvailable.value = capacitorStripe
    .isGooglePayAvailable()
    .then(() => {
      paymentMethods.value.forEach((element: any) => {
        if (element.key === "googlePay") element.isHidden = false;
      });
    })
    .catch(() => {
      // not available
    });
};

const checkIfApplepayAvailable = async () => {
  isAppleAvailable.value = capacitorStripe
    .isApplePayAvailable()
    .then(() => {
      paymentMethods.value.forEach((element: any) => {
        if (element.key === "applePay") element.isHidden = false;
      });
      return true;
    })
    .catch(async (err) => {
      // not available
      if (
        err &&
        err.errorMessage === "Can not use on this Device." &&
        isPlatform("ios")
      ) {
        isACardInAppleWallet.value = false;
        paymentMethods.value.forEach((element: any) => {
          if (element.key === "applePay") element.isHidden = false;
        });
        return true;
      }
      return undefined;
    });
};

const googlepay = async () => {
  if (isGoogleAvailable.value === undefined) {
    // stop further logic from work
    return;
  }

  const { onResult } = backendStripe.createAppleGooglePaymentIntent({
    cart_id: route.query.cart_id,
    provider: PaymentProvidersEnum.Google,
  });
  onResult(async (result) => {
    const paymentIntent = JSON.parse(
      result.data.appleGooglePaymentIntent.paymentIntent
    );
    await capacitorStripe.createGooglePay({
      paymentIntentClientSecret: paymentIntent.client_secret,
      paymentSummaryItems: [
        {
          label: products.value[0].productable?.title,
          amount: products.value[0].productable?.price / 100,
          // (be aware that apple shows a one thousand and ninty nine), while google shows 10.99
        },
      ],
      merchantIdentifier: VUE_APP_APPLE_MERCHANT_ID,
      countryCode: "US",
      currency: "USD",
    });

    await capacitorStripe.presentGooglePay();
  });
};

const isFreeProducts = computed(
  () => result.value?.getCart?.items[0].productable?.booked_count === 0
);
</script>
<style lang="scss">
.optional {
  font-weight: 300;
  font-size: 14px;
  line-height: 150%;
  color: var(--gray-500);
}

.payment__methods {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 24px;

  #paypal {
    position: relative;
  }

  #braintree-paypal-button {
    position: absolute;
    width: 100% !important;
    height: 100% !important;
    left: 0;
    top: 0;
    img {
      display: none !important;
    }
  }
}

.separator {
  display: flex;
  justify-content: center;
}

.submit-btn {
  width: 100%;
}

.cards {
  margin: 24px 0;

  &__container {
    height: 170px;
    display: flex;
    gap: 8px;
  }

  &__title {
    font-family: "Yantramanav", serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: var(--ion-color-white);
    margin-bottom: 12px;
    padding: 0 16px;
  }
}

.add-card {
  height: 170px;
  --padding-start: 16px;
  --padding-end: 16px;
  --background: var(--gray-700);
  --box-shadow: none;
  color: var(--ion-color-white);
  margin: 0;
}

.add-icon {
  font-size: 16px;
}

.card-slide {
  width: calc(100vw - 98px);
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.add-card-btn {
  margin: 18px 24px;
}

.text-align-center {
  text-align: center;
}
</style>
