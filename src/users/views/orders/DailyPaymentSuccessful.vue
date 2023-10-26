<template>
  <ion-spinner v-if="loading || getCartLoading" name="lines" class="spinner" />
  <div v-else class="w-100 h-100 d-flex-col align-items-center justify-content-between">
    <div class="order__head">
      <span class="order__title"> Payment Successfully Complete! </span>
      <ion-text class="font-14 colog-gray">{{ successText }}</ion-text>
      <div class="workout workout__details" v-if="type === AddToCartPurchasableEnum.Workout">
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
      <div class="workout workout__details" v-else>
        <div class="ordered-item">
          <ion-thumbnail class="ordered-item__photo">
            <img v-if="resData?.media?.length" :src="resData?.media[0].pathUrl" class="ordered-item__img" />
            <template v-else>
              {{ resData?.title?.charAt(0) }}
            </template>
          </ion-thumbnail>
          <div class="ordered-item__holder">
            <div class="ordered-item__header">
              <div class="ordered-item__header__main">
                <ion-label class="ordered-item__title">{{ resData?.title }}</ion-label>
                <rating-number v-if="resData?.score && type !== AddToCartPurchasableEnum.Event" class="ordered-item__rating">
                  {{ resData?.score }}
                </rating-number>
              </div>
            </div>
            <address-item
              v-if="resData?.address.length"
              class="ordered-item__address"
            >
              {{ resData?.address }}
            </address-item>
          </div>
        </div>
        <div>
          <div v-for="item in resData?.extra" :key="item.label" class="order-info">
            <div class="order-info__label">
              <ion-label>{{ item.label }}</ion-label>
            </div>
            <div class="order-info__info">
              <ion-text>{{ item.value }}</ion-text>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-100" style="padding: 0 24px 24px;">
      <ion-button v-if="type === AddToCartPurchasableEnum.Workout" class="w-100" @click="goToLibrary">My Library</ion-button>
      <ion-button
        v-else
        @click="handleClick"
        class="w-100">
        Continue
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import OrderItem from "@/users/components/Order.vue";
import { IonButton, toastController, IonLabel, IonThumbnail, IonText,  } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import AddressItem from "@/general/components/AddressItem.vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import {
  EventDocument,
  FacilityDocument,
  GetCartDocument,
  UserDocument,
  AddToCartPurchasableEnum,
} from "@/generated/graphql";
import { computed, ref } from "vue";
import { IonSpinner } from "@ionic/vue";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import dayjs from "dayjs";
import { Capacitor } from "@capacitor/core";

const router = useRouter();
const route = useRoute();
const store = paymentGatewaysStore();
console.log(route.params)
console.log(route.query)
const purchasableProductId = computed(() => route.query?.purchasable_product_id);
const cartId = computed(() => route.query?.cart_id);
const type = computed(() => route.query?.type);
const successText = computed(() => {
  if (route.query?.type === AddToCartPurchasableEnum.Event) {
    return "You've successfully registered into an event."
  }
  if (route.query?.type === AddToCartPurchasableEnum.Workout) {
    return "You've purchased a daily, check library to see all bought dailys."
  }
  if (route.query?.type === AddToCartPurchasableEnum.FacilityItem) {
    return "You've successfully booked your session."
  }
  return ""
});

const { result, loading: getCartLoading } = useQuery(GetCartDocument, {
  id: cartId.value,
});

const workoutData = computed(() => result.value?.getCart?.items[0]?.productable);
const resData = computed(() => {
  const data = result.value?.getCart?.items[0]?.productable;
  switch (route.query?.type) {
    case AddToCartPurchasableEnum.Event:
      return {
        title: data.title,
        score: '',
        media: data?.media,
        address: data?.address?.street,
        start_date: data?.start_date,
        extra: [
          {
            label: "Start Date",
            value: dayjs(new Date(data?.start_date)).format("D MMMM YYYY")
          },
          {
            label: "Start Time",
            value: dayjs(new Date(data?.start_date)).format("hh:mm A")
          }
        ]
      }
      break;
    case AddToCartPurchasableEnum.Workout:
      return {
        title: data.title,
        score: String(data.trainer?.score).includes(".") ? data.trainer?.score : `${data.trainer?.score}.0`,
        address: '',
        start_date: result.value?.getCart?.start_date,
        extra: []
      }
      break;
    case AddToCartPurchasableEnum.FacilityItem:
      return {
        title: data.facility?.name,
        score: String(data.facility?.score).includes(".") ? data.facility?.score : `${data.facility?.score}.0`,
        media: data.facility?.media,
        address: data?.facility?.address?.street,
        start_date: result.value?.getCart?.start_date,
        extra: [
          {
            label: "Session quantity",
            value: data.title
          }
        ]
      }
      break;
  
    default:
      break;
  }
  
})
const getDurationText = (value: number) => {
  if(value < 60) {
    return value + ' s';
  } else if(value < 3600) {
    return (value / 60).toFixed(0) + ' min ' + value % 60 + ' s';
  } else {
    return (value / 60).toFixed(0) + ' h ' + (value % 3600) / 60 + ' min';
  }
};

const goToLibrary = () => {
  router.push({
    name: Capacitor.isNativePlatform() ? EntitiesEnum.UserPurchasedWorkouts : EntitiesEnum.DashboardClientPurchasedDailys
  })
}
const handleClick = () => {
  if(type.value === AddToCartPurchasableEnum.Event){
    return router.push({
      name: Capacitor.isNativePlatform() ? EntitiesEnum.UserEventDetail : EntitiesEnum.DashboardEventDetail,
      params: {
        id: purchasableProductId.value
      },
    });
  }
  
  if(type.value === AddToCartPurchasableEnum.FacilityItem){
    return router.push({
      name: Capacitor.isNativePlatform()?EntitiesEnum.DropinsPassesDetail:EntitiesEnum.DashboardDropinsPassesDetail,
      params: {
        id: purchasableProductId.value
      },
    });
  }
  router.push({
    name: EntitiesEnum.Facilities,
  });
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

.ordered-item {
  display: flex;
  padding: 16px;
  min-height: 99px;
  border-radius: 8px;
  position: relative;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-start;
  background: var(--gray-700);
  box-sizing: border-box;

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;
  }

  &__header {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
    justify-content: space-between;

    &__main {
      display: flex;
      overflow: hidden;
      align-items: center;
    }

    &__end {
      margin-left: 8px;
    }
  }

  &__holder {
    align-self: flex-start;
    width: calc(100% - 84px);
  }

  &__title {
    font-size: 16px;
    overflow: hidden;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--ion-color-white);
  }

  &__rating {
    margin-left: 12px;
  }

  &__address {
    display: flex;
  }
}

.order-info {
  padding: 16px;
  &__label {
    text-align: start;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 18px */
  }
  &__info {
    text-align: start;
    color: var(--fitnesswhite);
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
  }
}
</style>
