<template>
  <ion-spinner v-if="loading || getCartLoading" name="lines" class="spinner" />
  <div v-else>
    <div class="order__head">
      <span class="order__title"> Payment Complete! </span>
      {{
        item
      }}
    </div>
  </div>
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
