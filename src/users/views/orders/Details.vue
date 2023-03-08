<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="My Order" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" class="spinner" />
      <order
        v-else
        :orderDate="date"
        :orderTime="sessionQuantity"
        :hourlyRate="price"
        :type="EntitiesEnum.Facility"
        :item="facility"
        timeSectionTitle="Session quantity"
        :isWaitingModalOpen="true"
      ></order>
    </template>
    <template #footer>
      <div class="holder-button">
        <ion-button class="button--submit" expand="block" @click="onConfirm">
          Confirm
        </ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton } from "@ionic/vue";
import { IonSpinner } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import Order from "@/users/components/Order.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useQuery } from "@vue/apollo-composable";
import { FacilityDocument, GetCartDocument } from "@/generated/graphql";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();

const onConfirm = () => {
  router.push({
    name: EntitiesEnum.PaymentsMethods,
    params: { orderId: route.params.id },
    query: { cart_id: route.query.cart_id },
  });
};

const onBack = () => {
  router.go(-1);
};

const { result: getFacilityResult } = useQuery(FacilityDocument, {
  id: route.params.id,
});

const { result, loading } = useQuery(GetCartDocument, {
  id: route.query.cart_id,
});

const price = computed(() => result.value?.getCart?.items[0]?.front_total);

const sessionQuantity = computed(() =>
  result.value?.getCart?.items[0]?.productable?.is_unlimited_checkin
    ? "Unlimit Sessions"
    : `${result.value?.getCart?.items[0]?.productable?.checkin_counter} Session`
);

const date = computed(() => result.value?.getCart?.start_date);

const facility = computed(() => getFacilityResult.value?.facility);
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
