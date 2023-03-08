<template>
  <ion-spinner v-if="loading || getCartLoading" name="lines" class="spinner" />
  <base-layout v-else>
    <template #content>
      <div class="order__head">
        <span class="order__title"> Payment Complete! </span>
        <span class="order__description">
          You've successfully booked your {{ curSession }}
        </span>
        {{ item.start_date }}
      </div>
      <order-item
        hide-price
        hide-title
        class="order"
        date-format="D MMMM YYYY - dddd"
        :type="route?.query?.session?.toUpperCase()"
        :item="order"
        :time-section-title="isFacility ? 'Session quantity' : 'Time'"
        :order-date="orderDate"
        :order-time="isFacility ? sessionQuantity : time"
      />
    </template>
    <template #footer>
      <div class="buttons__container">
        <ion-button class="secondary" @click="handleRemind" v-if="!isFacility"
          >Remind me</ion-button
        >
        <ion-button
          @click="handleClick"
          class="submit-btn"
          :class="{ 'full-width-btn': isFacility }"
          >Got it</ion-button
        >
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import OrderItem from "@/users/components/Order.vue";
import { IonButton, toastController } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import {
  EventDocument,
  FacilityDocument,
  GetCartDocument,
  UserDocument,
} from "@/generated/graphql";
import { computed } from "vue";
import { IonSpinner } from "@ionic/vue";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import dayjs from "dayjs";

const router = useRouter();
const route = useRoute();
const store = paymentGatewaysStore();

const { result, loading: getCartLoading } = useQuery(GetCartDocument, {
  id: route?.query?.cartId,
});

const item = computed(() => result.value?.getCart?.items[0]?.productable);

const sessionQuantity = computed(() =>
  result.value?.getCart?.items[0]?.productable?.is_unlimited_checkin
    ? "Unlimit Sessions"
    : `${result.value?.getCart?.items[0]?.productable?.checkin_counter} Session`
);

const isFacility = computed(
  () => route.query.session === EntitiesEnum.Facility.toLowerCase()
);

const orderDate = computed(() =>
  isFacility.value ? result.value?.getCart?.start_date : item.value?.start_date
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

const { result: userResult, loading } = useQuery(
  UserDocument,
  {
    id: route.params.id,
  },
  () => ({
    enabled: route?.query?.session === EntitiesEnum.Trainer.toLowerCase(),
  })
);

const curSession =
  route.query.session === EntitiesEnum.Trainer.toLowerCase()
    ? route.query.session
    : "session";

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

const { result: eventResult } = useQuery(EventDocument, {
  id: route.params.id,
});

const time = computed(() =>
  dayjs(new Date(item.value?.start_date)).format("hh:mm A")
);

const handleClick = () => {
  store.clearCart();
  router.push({
    name: EntitiesEnum.Facilities,
  });
};

const handleRemind = async () => {
  const startDate = isFacility.value
    ? new Date(result.value?.getCart?.start_date)
    : new Date(item.value?.start_date);
  const endDate = new Date(item.value?.end_date);
  const title = item.value.title;
  const eventLocation = order.value.address?.street;
  const notes =
    route?.query?.session === EntitiesEnum.Trainer.toLocaleLowerCase()
      ? "Upcoming training"
      : "Upcoming event";
  const success = function () {
    store.clearCart();
    store.setValue("isOpenWaitingModal", false);
    router.push({
      name: EntitiesEnum.Facilities,
    });
  };
  const error = async function (message: string) {
    const toast = await toastController.create({
      message,
      duration: 2000,
      icon: "assets/icon/info.svg",
      cssClass: "danger-toast",
    });
    toast.present();
  };

  window?.plugins?.calendar.createEventInteractively(
    title,
    eventLocation,
    notes,
    startDate,
    endDate,
    success,
    error
  );
};
</script>
<style scoped lang="scss">
.order {
  &__head {
    padding-top: 48px;
    text-align: center;
    margin: 105px 30px 32px;
  }

  &__title {
    display: block;
    font-size: 28px;
    line-height: 1.3;
    margin-bottom: 20px;
    color: var(--ion-color-primary);
    font-family: var(--title-font-family);
  }

  &__description {
    display: block;
    padding: 0 58px;
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-400);
  }
}

.buttons__container {
  display: flex;
  justify-content: center;
  gap: 14px;
  margin: 63px auto;
}

.submit-btn {
  width: 49%;
}

.full-width-btn {
  width: 100%;
  margin: 0 24px;
}

.secondary {
  width: 33%;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
