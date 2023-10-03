<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="My Order" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" class="spinner" />
      <order
        v-else
        :type="EntitiesEnum.Event"
        :item="event"
        :hourlyRate="event?.front_price"
        :orderDate="displayDate"
        :orderTime="dispayTime"
      ></order>
    </template>
    <template #footer>
      <div class="holder-button">
        <ion-button class="button--submit" expand="block" @click="onConfirm">
          Confirm
        </ion-button>
        <template>
          <ion-button
          color="medium"
          expand="block"
          fill="outline"
          :class="{ 'native-app': role === RoleEnum.User }"
          >
          Cancel session
        </ion-button>
      </template>
      </div>
    </template>
  </base-layout>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to cancel training?"
    description="Training will be deleted from your upcoming events"
    button-text="Cancel session"
    cancel-button-text="No, keep session"
    @discard="onCancelTraining"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import { IonButton, IonSpinner } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import Order from "@/users/components/Order.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import { GetCartDocument, PurchasableProductsEnum, RoleEnum } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import useRoles from "@/hooks/useRole";


const router = useRouter();
const route = useRoute();
const paymentProductsStore = paymentGatewaysStore();
const { role } = useRoles();
const showConfirmationModal = ref(false);

const onConfirm = () => {
  paymentProductsStore.clearCart();
  paymentProductsStore.setValue("purchasable", PurchasableProductsEnum.Event);

  router.push({
    name: EntitiesEnum.PaymentsMethods,
    params: { orderId: route.params.id },
    query: { cart_id: route.query.cart_id },
  });
};

const onBack = () => {
  router.go(-1);
};

const { result, loading } = useQuery(GetCartDocument, {
  id: route.query.cart_id,
});

const event = computed(
  () =>
    result.value?.getCart?.items.find(
      (event: any) => event.productable.id === route.params.id.toString()
    ).productable
);

const displayDate = computed(() => event.value?.start_date);

const dispayTime = computed(() =>
  dayjs(new Date(event.value?.start_date).getTime()).format("hh:mm A")
);

const onCancelTraining = () => {
  console.log('onCancelTraining');
}

const hideModal = () => {
  console.log('hideModal');  
}
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 24px;
}

:deep .trainer-item {
  &__avatar {
    --border-radius: 8px;
    border-radius: 8px;
  }
}

.holder-button {
  padding-inline: 24px;
  padding-bottom: calc(20px + var(--ion-safe-area-top));
  display: flex;
  flex-direction: column;
  gap: 16px;
  .button {
    margin: 0;
  }
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
</style>
