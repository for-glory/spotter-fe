
<template>
    <div class="dashboard web-bookings d-flex-col h-100">
        <div class="d-flex align-items-center page-header">
            <ion-button class="common-back-btn" fill="clear" @click="router.back()">
                <ion-icon src="assets/icon/arrow-back.svg" />
            </ion-button>
            <ion-title class="banner__title">Back</ion-title>
        </div>
        <div class="d-flex gap-16 h-100 overflow-hidden">
            <div class="flex-1 h-100 d-flex-col justify-content-between hide-scrollbar">
                <div class="holder-dates ion-padding-horizontal" v-if="!orderDetail">
                    <IonTitle class="ion-text-center date-title">Choose start date</IonTitle>
                    <facility-item v-if="!loading" :facility="facility"></facility-item>
                    <base-calendar :showAdditionalContent="false" @change-day="onChangeDay" />
                </div>
                <div v-else>
                    <order :orderDate="selectedDay" :orderTime="'sessionQuantity'" :hourlyRate="200" :type="EntitiesEnum.Facility"
                        :item="facility" timeSectionTitle="Session quantity" :isWaitingModalOpen="true"></order>
                </div>
                <IonButton class="ion-margin" @click="orderDetail = !orderDetail">Confirm</IonButton>
            </div>
            <div class="flex-2 h-100 hide-scrollbar">
                <BaseCustomCalendar class="web-custom-calendar" week-days-format="W" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { IonIcon, IonTitle, IonButton, toastController } from "@ionic/vue";
import BaseCustomCalendar from "@/general/components/base/BaseCustomCalendar.vue";
import BaseCalendar from "@/general/components/base/BaseCalendar.vue";
import { computed, ref } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";
import { useRoute, useRouter } from "vue-router";
import { AddFacilityItemToCartDocument, FacilityDocument } from "@/generated/graphql";
import utc from "dayjs/plugin/utc";
import { EntitiesEnum } from "@/const/entities";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import FacilityItem from "@/general/components/FacilityItem.vue";
import Order from "@/users/components/Order.vue";

dayjs.extend(utc);
const router = useRouter();

const route = useRoute();
const selectedDay = ref(dayjs());
const paymentProductsStore = paymentGatewaysStore();
const orderDetail = ref<boolean>(false);

const { result, loading } = useQuery(FacilityDocument, {
    id: route.params.id,
});

const { mutate: addToCartMutation, loading: addToCartLoading } = useMutation(
    AddFacilityItemToCartDocument
);

const facility = computed(() => result.value?.facility);

const onNext = () => {
    addToCartMutation({
        input: {
            facility_item_id: 52,
            start_date: dayjs(new Date(selectedDay.value as any)).utc(),
        },
    })
        .then((res) => {
            router.push({
                name: EntitiesEnum.FacilityOrder,
                params: {
                    id: 52,
                },
                query: {
                    cart_id: res?.data?.addFacilityItemToCart?.id,
                },
            });
        })
        .catch(async () => {
            const toast = await toastController.create({
                message: "Something went wrong. Try again.",
                duration: 2000,
                icon: "assets/icon/info.svg",
                cssClass: "warning-toast",
            });
            toast.present();
        });
};

const onChangeDay = (day: any) => {
    selectedDay.value = day;
};



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

.web-bookings {
    padding: 0 64px;
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

.flex-1,
.flex-2 {
    width: 100%;
    overflow: auto;
}

.flex-1 {
    max-width: 360px;
    background: var(--gray-700);
    padding-top: 20px;
}

.overflow-hidden {
    overflow: hidden;
}

.date-title {
    font-family: "Yantramanav";
    font-size: 16px;
    font-weight: 500;
    margin-top: 10px;
    margin-bottom: 23px;
}
</style>
  