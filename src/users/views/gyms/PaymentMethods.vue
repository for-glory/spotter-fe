<template>
    <div class="dashboard web-bookings d-flex-col h-100" :class="{ 'user-payment': role === RoleEnum.User }">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" v-if="role !== RoleEnum.User" fill="clear" @click="router.back()">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">Payment method</ion-title>
        </div>
        <div class="cards__container">
            <IonSpinner class="spinner" name="lines" v-if="loading"></IonSpinner>
            <base-carousel v-else-if="preparedCards?.length" show-start :items="preparedCards" :slides-offset-after="16"
                :slides-offset-before="16">
                <template #start>
                    <ion-button class="add-card">
                        <ion-icon src="assets/icon/payment/plus.svg" class="add-icon" />
                    </ion-button>
                </template>
                <template v-slot:default="preparedCards">
                    <card v-for="card in preparedCards" :key="card.id" :card-holder="card.card_holder"
                        :card-number="card.pm_last_four" :exp-date="card.exp_month + '/' + card.exp_year"
                        :is-default="card.is_default" class="card-slide" @click="changePaymentMethod(card.id)" />
                </template>
            </base-carousel>
            <div class="add-new-card" v-else>
                <AddCardButton :is-web="true" />
            </div>
        </div>
        <div class="payment-footer" v-if="role === RoleEnum.User">
            <IonButton @click="onSubmit">
                {{ preparedCards?.length ? "Confirm" : "Creare card" }}
            </IonButton>
        </div>
    </div>
    <IonModal class="payment-modal-wrapper" :is-open="isPaymentModal" @didDismiss="isPaymentModal = false">
        <div class="payment-modal">
            <ion-icon src="assets/icon/close.svg" class="close-btn cursor-pointer"
                @click="isPaymentModal = false"></ion-icon>
            <div class="logo">
                <router-link to="/">
                    <ion-img src="assets/icon/logo-complete.png" alt="logo" />
                </router-link>
            </div>
            <h1>Payment successfully completed!</h1>
            <ion-label class="payment-desc">
                You have successfully booked your session
            </ion-label>
            <div class="order-wrapper">
                <order-item hide-price hide-title class="order" date-format="D MMMM YYYY - dddd"
                    :type="route?.query?.session?.toUpperCase()" :item="order"
                    :time-section-title="isFacility ? 'Session quantity' : 'Time'" :order-date="orderDate"
                    :order-time="isFacility ? sessionQuantity : time" />
            </div>
            <IonButton fill="outline" class="w-100 ion-margin-bottom">Remind me</IonButton>
            <IonButton class="w-100">Got it!</IonButton>
        </div>
    </IonModal>
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
    IonModal,
    IonLabel,
    IonImg
} from "@ionic/vue";
import PaymentMethod from "@/general/components/blocks/payment/PaymentMethod.vue";
import { computed, onMounted, onUnmounted, ref } from "vue";
import Card from "@/general/components/blocks/payment/Card.vue";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { useRouter, useRoute } from "vue-router";
import { BackendStripe } from "@/services/stripe/stripe";
import { BackendPaypal } from "@/services/paypal/paypal";
import OrderItem from "@/users/components/Order.vue";

import AddCardButton from "@/general/components/blocks/payment/AddCardButton.vue";
import {
    Stripe as capacitorStripe,
    ApplePayEventsEnum,
    GooglePayEventsEnum,
} from "@capacitor-community/stripe";
import { EventDocument, FacilityDocument, GetCartDocument, PaymentProvidersEnum, RoleEnum, UserDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { navigationAfterPaymentCompleted } from "@/helpers/purchaseRouterNavigation";
import debounce from "lodash/debounce";
import { Capacitor } from "@capacitor/core";
import useRoles from "@/hooks/useRole";
import { EntitiesEnum } from "@/const/entities";
import { Cards } from "@/services/stripe/cards";

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
const { role } = useRoles();
const isPaymentModal = ref<boolean>(false);

const backendStripe = new BackendStripe(VUE_APP_STRIPE_PUBLIC_KEY || "");
const backendPaypal = new BackendPaypal();
declare const braintree: any;

const isFacility = computed(
  () => route.query.session === EntitiesEnum.Facility.toLowerCase()
);

onUnmounted(() => {
    if(interval.value){
        clearInterval(interval?.value);
    }
    
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
            // checkIfGpayAvailable();
            // checkIfApplepayAvailable();
        });
    // addPaypal();

    //   interval.value = setInterval(() => {
    //     refetch();
    //   }, 5000);
});

const { mutate: changeCard } = backendStripe.changePaymentMethod();
const { mutate: createPaymentIntent } = backendStripe.createPaymentIntent();
const { onResult: cardsResult, refetch } = backendStripe.getCards();

// temporary solution for updating new cards
// const getCards = debounce(() => {
//   refetch();
// }, 5000);

// getCards();

const { onResult: getPaypalToken } = backendPaypal.createPaypalToken();
const { mutate: makePaymentRequest } = backendPaypal.makePaymentRequest();

const { result: userResult } = useQuery(
  UserDocument,
  {
    id: route.params.id,
  },
  () => ({
    enabled: route?.query?.session === EntitiesEnum.Trainer.toLowerCase(),
  })
);
const { result: facilityResult } = useQuery(
  FacilityDocument,
  {
    id: route.params.id,
  },
  () => ({
    enabled: route?.query?.session === EntitiesEnum.Facility.toLowerCase(),
  })
);
const { result: eventResult } = useQuery(EventDocument, {
  id: route.params.id,
});

const orderDate = computed(() =>
  isFacility.value ? result.value?.getCart?.start_date : item.value?.start_date
);
const item = computed(() => result.value?.getCart?.items[0]?.productable);

const order = computed(() => {
  let result;

  switch (route?.query?.session) {
    case EntitiesEnum.Trainer.toLowerCase():
      result = userResult.value?.user;
      break;
    case EntitiesEnum.Facility.toLowerCase():
      result = facilityResult.value?.facility;
      break;
    case EntitiesEnum.Event.toLowerCase():
      result = eventResult.value?.event;
      break;
    default:
      break;
  }
  return result;
});

const products = computed(() => result.value?.getCart?.items);

const onSubmit = () => {
  errorMessage.value = "";
  if (products.value?.length < 1) {
    errorMessage.value = "Select the products first.";

    return;
  }

  createPaymentIntent({
    cart_id: route.query.cart_id,
    purchasable_product_id: route.params.id,
  })
    .then((data) => {
        console.log(data);
        
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
    preparedCards.value = cardsContainer.cards as any;
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
    const { onResult } = backendStripe.createSetupIntent(route.params.orderId as string);
    onResult((setupIntentResult) => {
        let intent = JSON.parse(setupIntentResult?.data?.setupIntent?.session as any);
        backendStripe.redirectToCardSaving(intent.id);
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

const isFreeProducts = computed(
    () => result.value?.getCart?.items[0].productable?.booked_count === 0
);
</script>

<style scoped lang="scss">
.dashboard {
    padding: 24px 16px 64px;

    &__navigation {
        width: 16vw;
        display: flex;
        align-items: flex-end;
        font-size: 18px;
        color: var(white);
        gap: 25px;
    }
}

.banner__title {
    margin-top: -3px;
}

.empty-block {
    margin-top: 48px;
}

.page-header {
    padding-top: 21px;
    margin-bottom: 26px;

    ion-title {
        font-size: 24px;
        padding-left: 7px;
        color: var(--gold);
    }

    ion-icon {
        color: var(--gray-500);
        font-size: 20px;
    }
}

.add-card {
    height: 200px;
    --padding-start: 16px;
    --padding-end: 16px;
    --background: var(--gray-700);
    --box-shadow: none;
    color: var(--ion-color-white);
    margin: 0;
}

.card-slide {
    height: 200px;

    :deep {
        .card__content {
            height: 100%;
        }

        .card__footer {
            max-height: unset;
        }

        .card__holder__title {
            overflow: auto;
            white-space: normal;
        }
    }
}

.payment-modal-wrapper {
    --min-height: 700px;
}

.payment-modal {
    padding: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;
    max-width: 422px;
    justify-content: center;
    align-items: center;
    margin: auto;

    .close-btn {
        font-size: 24px;
        cursor: pointer;
        position: absolute;
        top: 32px;
        left: 32px;
        z-index: 99;
    }

    .logo {
        width: 15rem;
        margin: auto;
        text-align: center;
    }

    h1 {
        color: var(--gold);
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        text-align: center;
    }

    .payment-desc {
        display: block;
        font-weight: 300;
        font-size: 14px;
        color: var(--gray-400);
        margin-bottom: 22px;
        margin-top: 22px;
    }

    .order-wrapper {
        :deep {
            .content__title {
                display: none;
            }

            .content__container {
                border: 0.5px solid var(--gold);
            }

            .order__container {
                .order__item:nth-child(3) {
                    display: none;
                }

                .order__info,
                .order__label {
                    font-family: "Yantramanav";
                }

                .order__info {
                    color: var(--fitnesswhite);
                }

                .order__label {
                    color: var(--gray-400);
                }
            }
        }
    }
}

.spinner {
    display: block;
    margin: 25vh auto;
}

.add-new-card {
    margin-left: 15px;
}

.user-payment {
    padding: 24px 40px 40px;

    .cards__container {
        flex: 2;
    }
}

.payment-footer {
    display: flex;
    justify-content: center;

    ion-button {
        width: 327px;
        color: var(--gray-700);
        text-align: center;
        font-family: Yantramanav;
        font-size: 16px;
        font-weight: 500;
    }
}
</style>
  