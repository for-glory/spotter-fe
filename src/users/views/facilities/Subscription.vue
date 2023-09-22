<template>
  <base-layout draggable header-fixed :initial-breakpoint="0.4">
    <template #header>
      <page-header back-btn transparent @back="onBack" />
    </template>

    <template #static>
      <ion-img class="img" src="assets/gym.png" />
    </template>
    <template #draggable>
      <div class="subscriptions__content-holder">
        <ion-title class="subscriptions__title" :class="{'font-yantramanav' : role === RoleEnum.User}"> Choose your option </ion-title>
        <choose
          :products="products"
          @handle-chosen-product="handleChosenProduct"
        />
      </div>
    </template>

    <template #footer>
      <div class="button-holder">
        <ion-button
          expand="block"
          class="button-submit"
          @click="onChooseSubscription"
          :disabled="!paymentStore.productItemId"
          :class="{'font-yantramanav' : role === RoleEnum.User}"
        >
          Purchase now
        </ion-button>
      </div>
    </template>
  </base-layout>
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
  />
</template>

<script setup lang="ts">
import { IonImg, IonTitle, IonButton } from "@ionic/vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import Choose from "@/users/components/Choose.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useQuery } from "@vue/apollo-composable";
import {
  FacilityQuery,
  FacilityDocument,
  FacilityQueryVariables,
  FacilityItem,
  PurchasableProductsEnum,
RoleEnum,
} from "@/generated/graphql";
import { Productable } from "@/ts/types/store";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import useRoles from "@/hooks/useRole";

const route = useRoute();
const router = useRouter();
const paymentStore = paymentGatewaysStore();
const products = ref<FacilityItem[] | any[]>([]);
const paymentProductsStore = paymentGatewaysStore();
const isConfirmedModalOpen = ref(false);

const onChooseSubscription = () => {
  paymentStore.setValue("purchasable", PurchasableProductsEnum.FacilityItem);
  router.push({ name: EntitiesEnum.FacilityDates });
};

const facilityQueryVariables: FacilityQueryVariables = {
  id: route.params.id as string,
};

const { onResult } = useQuery<FacilityQuery>(
  FacilityDocument,
  facilityQueryVariables
);

const { role } = useRoles();

onResult((data) => {
  products.value = data?.data?.facility?.productItems || [];
});

onMounted(() => {
  paymentProductsStore.clearCart();
  setTimeout(() => {
    products.value = [{
    id:"1",
    created_at: new Date().toString(),
    description:"Get 1 session at the gym",
    facility:'$9.99/one payment',
    front_price:"9.99",
    price:"$9.99",
    product_id:'premium',
    title:"Premium plan"
  },
  {
    id:"2",
    created_at: new Date().toString(),
    description:"Get 8 sessions at the gym",
    facility:'$39.99/one payment',
    front_price:"39.99",
    price:"$39.99",
    product_id:'premium',
    title:"Premium plan"
  }]
  }, 500);
});

const handleChosenProduct = (product: Productable) => {
  paymentProductsStore.clearCart();
  paymentProductsStore.setValue("productItemId", product.id);
};

const onBack = () => {
  isConfirmedModalOpen.value = true;
};

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    router.go(-1);
  }
};
</script>

<style scoped lang="scss">
.img {
  object-fit: cover;
  height: calc(39vh + 20px);
}

.header {
  background: transparent;
}

.subscriptions {
  &__content-holder {
    padding-top: 4px;
    padding-left: 24px;
    padding-right: 24px;
  }

  &__title {
    padding: 0;
    display: block;
    margin-bottom: 16px;
    color: var(--ion-color-white);
    text-align: center;
    font-weight: 500;
    font-size: 20px;
    line-height: 1.5;
    font-family: var(--ion-font-family);
  }
}

.button-holder {
  padding: 20px 24px calc(20px + var(--ion-safe-area-bottom));
}

.button-submit {
  margin: 0;
}
</style>
