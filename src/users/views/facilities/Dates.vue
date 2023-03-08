<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Choose dates" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-dates ion-padding-horizontal">
        <facility-item v-if="!loading" :facility="facility"></facility-item>
        <base-calendar
          :showAdditionalContent="false"
          @change-day="onChangeDay"
        />
      </div>
    </template>
    <template #footer>
      <div class="holder-button">
        <ion-button
          class="button--submit"
          expand="block"
          @click="onNext"
          :disabled="addToCartLoading"
        >
          Next
        </ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import FacilityItem from "@/general/components/FacilityItem.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  AddFacilityItemToCartDocument,
  FacilityDocument,
} from "@/generated/graphql";
import { computed, ref } from "vue";
import BaseCalendar from "@/general/components/base/BaseCalendar.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import dayjs from "dayjs";
import { toastController } from "@ionic/core";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const route = useRoute();
const selectedDay = ref(dayjs());
const paymentProductsStore = paymentGatewaysStore();

const { result, loading } = useQuery(FacilityDocument, {
  id: route.params.id,
});

const { mutate: addToCartMutation, loading: addToCartLoading } = useMutation(
  AddFacilityItemToCartDocument
);

const router = useRouter();

const facility = computed(() => result.value?.facility);

const onNext = () => {
  addToCartMutation({
    input: {
      facility_item_id: paymentProductsStore.productItemId,
      start_date: dayjs(new Date(selectedDay.value)).utc(),
    },
  })
    .then((res) => {
      router.push({
        name: EntitiesEnum.FacilityOrder,
        params: {
          id: route.params.id,
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

const onChangeDay = (day) => {
  selectedDay.value = day;
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.holder-dates {
  padding-top: 25px;
}

.facility-item {
  margin-bottom: 16px;
  --min-height: 160px;
}

.holder-button {
  padding: 16px 24px calc(20px + var(--ion-safe-area-bottom));

  .button {
    &--submit {
      margin: 0;
    }
  }
}
</style>
