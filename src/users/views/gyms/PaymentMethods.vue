<template>
    <div class="dashboard web-bookings d-flex-col h-100">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" fill="clear" @click="router.back()">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">Payment method</ion-title>
        </div>
        <div class="cards__container" v-if="preparedCards?.length">
            <base-carousel show-start :items="preparedCards" :slides-offset-after="16" :slides-offset-before="16">
                <template #start>
                    <ion-button class="add-card">
                        <ion-icon src="assets/icon/payment/plus.svg" class="add-icon" />
                    </ion-button>
                </template>
                <template v-slot:default="preparedCards">
                    <card v-for="card in preparedCards" :key="card.id" :card-holder="card.card_holder"
                        :card-number="card.pm_last_four" :exp-date="card.exp_month + '/' + card.exp_year"
                        :is-default="card.is_default" class="card-slide" />
                </template>
            </base-carousel>
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
                <order :orderDate="selectedDay" :orderTime="'sessionQuantity'" :hourlyRate="200"
                :type="EntitiesEnum.Facility" :item="facility" timeSectionTitle="Session quantity"
                :isWaitingModalOpen="true"></order>
            </div>
            <IonButton fill="outline" class="w-100 ion-margin-bottom">Remind me</IonButton>
            <IonButton class="w-100">Got it!</IonButton>
        </div>
    </IonModal>
</template>

<script setup lang="ts">
import { IonIcon, IonTitle, IonButton, IonModal, IonImg, IonLabel } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { Cards } from "@/services/stripe/cards";
import Card from "@/general/components/blocks/payment/Card.vue";
import { computed, ref } from "vue";
import { BackendStripe } from "@/services/stripe/stripe";
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import dayjs from "dayjs";
import { FacilityDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import Order from "@/users/components/Order.vue";

const VUE_APP_STRIPE_PUBLIC_KEY = process.env.VUE_APP_STRIPE_PUBLIC_KEY;
const backendStripe = new BackendStripe(VUE_APP_STRIPE_PUBLIC_KEY || "");
const preparedCards = ref<typeof Card[]>([]);
const { onResult: cardsResult, refetch } = backendStripe.getCards();

const router = useRouter();
const route = useRoute();
const cardsContainer = new Cards();
const isPaymentModal = ref<boolean>(false);
const selectedDay = ref(dayjs());

const { result, loading } = useQuery(FacilityDocument, {
    id: route.params.id,
});


const facility = computed(() => result.value?.facility);
cardsResult((response) => {
    cardsContainer.init(response?.data?.cards?.data || []);
    preparedCards.value = cardsContainer.cards;
});
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
                .order__info,.order__label {
                    font-family: "Yantramanav";
                }
                .order__info{
                    color: var(--fitnesswhite);
                }
                .order__label {
                    color: var(--gray-400);
                }
            }
        }
    }
}
</style>
  