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
  toastController,
  IonSpinner,
} from "@ionic/vue";
import PaymentMethod from "@/general/components/blocks/payment/PaymentMethod.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Card from "@/general/components/blocks/payment/Card.vue";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { useRouter, useRoute } from "vue-router";
import { BackendStripe } from "@/services/stripe/stripe";
import { Cards } from "@/services/stripe/cards";
import AddCardButton from "@/general/components/blocks/payment/AddCardButton.vue";
import {
  Stripe as capacitorStripe,
  ApplePayEventsEnum,
  GooglePayEventsEnum,
} from "@capacitor-community/stripe";
import { PaymentProvidersEnum, MeDocument } from "@/generated/graphql";
import { useQuery, useLazyQuery } from "@vue/apollo-composable";
import { navigationAfterPaymentCompleted } from "@/helpers/purchaseRouterNavigation";
import debounce from "lodash/debounce";
import { setAuthItems } from "@/router/middleware/auth";
import useSubscription from "@/hooks/useSubscription";

const VUE_APP_STRIPE_PUBLIC_KEY = process.env.VUE_APP_STRIPE_PUBLIC_KEY;
const cardCreation = ref(false);
const preparedCards = ref<typeof Card[]>([]);
const errorMessage = ref("");
const router = useRouter();
const route = useRoute();
const cardsContainer = new Cards();
const interval = ref(null);

const backendStripe = new BackendStripe(VUE_APP_STRIPE_PUBLIC_KEY || "");

onUnmounted(() => {
  clearInterval(interval.value);
});

const {
  loading,
  load: getMyProfile,
  onResult: gotMyProfile,
} = useLazyQuery(MeDocument, {
  fetchPolicy: "no-cache",
});
getMyProfile();

const { type: currentSubscriptionType } = useSubscription();
gotMyProfile(({ data }) => {
  if (data.me.currentSubscription !== currentSubscriptionType) {
    setAuthItems(data.me);
    onBack();
  }
});

onMounted(() => {
  refetch();

  backendStripe.init();

  capacitorStripe
    .initialize({
      publishableKey: VUE_APP_STRIPE_PUBLIC_KEY,
    })

  interval.value = setInterval(() => {
    refetch();
  }, 5000);
});

const { mutate: changeCard } = backendStripe.changePaymentMethod();
const { mutate: createSubscriptionIntent } = backendStripe.createSubscriptionIntent();
const { onResult: cardsResult, refetch } = backendStripe.getCards();

// temporary solution for updating new cards
const getCards = debounce(() => {
  refetch();
}, 5000);

getCards();

const onSubmit = () => {
  errorMessage.value = "";

  createSubscriptionIntent({
    product_id: route.params.subscriptionId,
  })
    .then((data) => {
      console.log("data==>", data)
      console.log("data22====>", data?.data?.paymentIntent)
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
  const { onResult } = backendStripe.createSetupIntent(route.params.subscriptionId);
  onResult((setupIntentResult) => {
    let intent = JSON.parse(setupIntentResult?.data?.setupIntent?.session);
    backendStripe.redirectToCardSaving(intent.id, intent.url);
  });
};

const onBack = () => {
  router.go(-1);
};

capacitorStripe.addListener(ApplePayEventsEnum.Completed, () => {
  // navigationAfterPaymentCompleted(
  //   route.params.orderId,
  //   route.query.cart_id as string
  // );
});

capacitorStripe.addListener(ApplePayEventsEnum.Failed, () => {
  errorMessage.value = "Something went wrong, please try again";
  // @TODO create correct behaviour of failed payment
});

capacitorStripe.addListener(GooglePayEventsEnum.Completed, () => {
  // navigationAfterPaymentCompleted(
  //   route.params.orderId,
  //   route.query.cart_id as string
  // );
  // @TODO create correct behaviour of completed payment
});

capacitorStripe.addListener(GooglePayEventsEnum.Failed, () => {
  errorMessage.value = "Something went wrong, please try again";
  // @TODO create correct behaviour of failed payment
});

</script>
<style lang="scss">
.optional {
  font-weight: 300;
  font-size: 14px;
  line-height: 150%;
  color: var(--gray-500);
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
