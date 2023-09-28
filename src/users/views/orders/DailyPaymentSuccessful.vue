<template>
  <ion-spinner v-if="loading || getCartLoading" name="lines" class="spinner" />
  <div v-else class="w-100 h-100 d-flex-col align-items-center justify-content-between">
    <div class="order__head">
      <span class="order__title"> Payment Successfully Complete! </span>
      <ion-text class="font-14 colog-gray">You've purchased a daily, check library to see all bought dailys.</ion-text>
      <div class="workout workout__details">
        <div class="workout__details__head">
          <strong class="workout__details__title color-gold">
            {{ workoutData.title }}
          </strong>
          <ion-chip
            color="primary"
            :outline="true"
            class="workout__details__rating"
          >
            {{
              String(workoutData.trainer?.score).includes(".")
                ? workoutData.trainer?.score
                : `${workoutData.trainer?.score}.0`
            }}
          </ion-chip>
        </div>
        <div class="workout__details__info">
          <ion-icon
            color="primary"
            icon="assets/icon/time.svg"
            class="workout__details__info__icon"
          />
          <span>
            {{ getDurationText(Number(workoutData.duration)) }}
            <ion-text color="light">&nbsp;&nbsp;•&nbsp;&nbsp;</ion-text>
            {{ workoutData.type?.name }}
            <ion-text color="light">&nbsp;&nbsp;•&nbsp;&nbsp;</ion-text>
            {{ workoutData.trainer?.first_name }}
            {{ workoutData.trainer?.last_name }}
          </span>
        </div> 
      </div>
    </div>
    <div class="w-100" style="padding: 0 24px;">
      <ion-button class="w-100" @click="router.push({ name: EntitiesEnum.UserPurchasedWorkouts })">My Library</ion-button>
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
import { computed, ref } from "vue";
import { IonSpinner } from "@ionic/vue";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import dayjs from "dayjs";

const router = useRouter();
const route = useRoute();
const store = paymentGatewaysStore();

const purchasableProductId = computed(() => route.query?.purchasable_product_id);
const cartId = computed(() => route.query?.cart_id);

const { result, loading: getCartLoading } = useQuery(GetCartDocument, {
  id: cartId.value,
});

const workoutData = computed(() => result.value?.getCart?.items[0]?.productable);
const getDurationText = (value: number) => {
  if(value < 60) {
    return value + ' s';
  } else if(value < 3600) {
    return (value / 60).toFixed(0) + ' min ' + value % 60 + ' s';
  } else {
    return (value / 60).toFixed(0) + ' h ' + (value % 3600) / 60 + ' min';
  }
};

</script>
<style scoped lang="scss">
.order {
  &__head {
    padding-top: 24px;
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
.workout {
  padding: 0 24px calc(76px + var(--ion-safe-area-bottom));
  margin-top: 45px;

   &__details {
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 12px 16px;
    background: var(--gray-700);

    &__head {
      display: flex;
      margin-bottom: 4px;
      align-items: center;
      justify-content: flex-start;
    }

    &__title {
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
      color: var(--ion-color-light);
    }

    &__rating {
      height: auto;
      min-width: 36px;
      font-size: 12px;
      padding: 1px 7px;
      font-weight: 500;
      line-height: 1.5;
      margin: 0 0 0 12px;
      text-align: center;
      justify-content: center;
    }

    &__info {
      display: flex;
      font-size: 14px;
      line-height: 1.5;
      font-weight: 300;
      align-items: center;
      justify-content: flex-start;
      color: var(--ion-color-secondary);

      &__icon {
        line-height: 1;
        font-size: 24px;
        margin-right: 4px;
      }
    }

    &__status {
      padding: 14.5px 45px;
      background-color: #262626;
      border-radius: 8px;
    }
  }

  &__price-list {
    display: block;
    margin-top: 12px;
    border-top: 1px solid var(--gray-600);
  }
}
.purchase-details {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2px 16px;
  gap: 10px;

  /* dark grey */

  background: #262626;
  border-radius: 8px;
  margin: 30px 30px;
}
.font-14 {
  font-size: 14px;
}
</style>
