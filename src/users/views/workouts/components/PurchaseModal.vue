<template>
  <ion-modal trigger="open-modal" :is-open="isOpen">
    <ion-content class="modal-content ion-padding">
      <div class="workout">
        <div class="workout__head">
          <ion-title class="workout__label" color="primary">
            Get Access to this daily workout
          </ion-title>
          <ion-text color="secondary">
            This daily contains one video totaling
            <ion-text color="primary">
              {{ getDurationText(Number(workoutData.duration)) }}
            </ion-text>
          </ion-text>
        </div>

        <div class="workout__details">
          <div class="workout__details__head">
            <strong class="workout__details__title">
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
          <ion-radio-group class="workout__price-list" value="1">
            <ion-item lines="none" class="workout__price-item">
              <div class="workout__price-item__info">
                <strong class="workout__price-item__title">
                  ${{ workoutData.price }}/one payment
                </strong>
                <ion-text color="secondary">
                  Get 1 daily-video access
                </ion-text>
              </div>
              <ion-radio slot="end" value="1" />
            </ion-item>
          </ion-radio-group>
        </div>
        <div class="workout__details__status d-flex align-items-center justify-content-between w-100">
          <div class="d-flex-col align-items-center">
            <ion-text class="font-medium color-fitness-white font-16">{{ formatNumber(workoutData.recommended_count, 'normal') }}</ion-text>
            <ion-text class="font-normal color-gold font-14">Likes</ion-text>
          </div>
          <div class="split" />
          <div class="d-flex-col align-items-center">
            <ion-text class="font-medium color-fitness-white font-16">{{ formatNumber(workoutData.views_count, 'noraml') }}</ion-text>
            <ion-text class="font-normal color-gold font-14">Views</ion-text>
          </div>
          <div class="split" />
          <div class="d-flex-col align-items-center">
            <ion-text class="font-medium color-fitness-white font-16">{{ formatNumber(workoutData.reviews_count, 'normal') }}</ion-text>
            <ion-text class="font-normal color-gold font-14">Reviews</ion-text>
          </div>
        </div>
        <div class="font-14 font-normal color-fitness-white workout__description">
          <ion-text>{{ workoutData.description }}</ion-text>
        </div>
        <div class="workout__purchase-button">
          <ion-button expand="block" @click="onPurchase">Purchase Daily</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
export default {
  name: "PurchaseModal",
};
</script>

<script setup lang="ts">
import { IonModal, IonContent, IonButton } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { defineProps, defineEmits, ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { 
  MeDocument, 
  SettingsCodeEnum, 
  GetCartDocument,
  PurchasableProductsEnum
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { EntitiesEnum } from '@/const/entities';
import { Capacitor } from "@capacitor/core";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";

const isTrusted = ref(false);

const props = defineProps<{
  dailyId?: number;
  cartId?: number;
  isOpen: boolean;
}>();

const emits = defineEmits<{
  (e: "purchaseDaily"): void;
}>();

const router = useRouter();
const paymentStore = paymentGatewaysStore();
const dailyId = computed(() => props.dailyId);
const cartId = computed(() => props.cartId);

const { result, loading, refetch, onResult } = useQuery(GetCartDocument, {
  id: cartId.value,
});

const workout = computed(
  () =>
    result.value?.getCart?.items?.find(
      (workout) => workout.productable.id === dailyId.value?.toString()
    )?.productable
);

const workoutData = computed(() => ({
  id: workout.value?.id || null,
  title: workout.value?.title || "",
  description: workout.value?.description || "",
  duration: workout.value?.duration || "",
  exercises: workout.value?.exercises || [],
  media: workout.value?.previewUrl,
  price: workout.value?.front_price || "",
  trainer: workout.value?.trainer || "",
  type: workout.value?.type || "",
  recommended_count: workout.value?.recommended_count,
  views_count: workout.value?.views_count,
  reviews_count: workout.value?.reviews_count
}));

watch(() => props.isOpen,
() => {
  if(dailyId.value && props.isOpen){
    refetch({ id: cartId.value });
  }
});

const onPurchase = () => {
  paymentStore.setValue("purchasable", PurchasableProductsEnum.Workout);
  emits('purchaseDaily');
};

const handleBack = () => {
  router.go(-1);
};

const getDurationText = (value: number) => {
  if(value < 60) {
    return value + ' s';
  } else if(value < 3600) {
    return (value / 60).toFixed(0) + ' min ' + value % 60 + ' s';
  } else {
    return (value / 60).toFixed(0) + ' h ' + (value % 3600) / 60 + ' min';
  }
};
const formatNumber = (num: number, type: string) => {
  if (num < 1e3) {
    if(type === 'normal') {
      return num.toString();
    } else {
      return num.toFixed(2).toString();
    }
  } else if (num < 1e6) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return (num / 1e6).toFixed(1) + 'M';
  }
};

</script>

<style scoped lang="scss">
.workout {
  padding: 0 24px calc(76px + var(--ion-safe-area-bottom));

  &__preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__head {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 24px;
  }

  &__label {
    padding: 0;
    display: block;
    margin: 0 -4px;
    font-size: 20px;
    font-weight: 700;
    line-height: 1.3;
    white-space: normal;
    margin-bottom: 20px;
  }

  &__description {
    font-family: --var(Yantramanav);
    padding-top: 16px;
  }

  &__details {
    border-radius: 8px;
    margin-bottom: 16px;
    padding: 12px 16px 0;
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

  &__price-item {
    display: block;
    font-size: 14px;
    line-height: 1.5;
    margin-left: -8px;
    margin-right: -8px;
    --min-height: 0;
    --padding-top: 12px;
    --padding-bottom: 12px;
    --padding-start: 8px;
    --padding-end: 8px;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --background: transparent;

    &__title {
      display: block;
      font-size: 16px;
      font-weight: 500;
      line-height: 1.5;
      margin-bottom: 2px;
      color: var(--ion-color-light);
    }

    ion-radio {
      width: 18px;
      height: 18px;
      border-width: 1.8px;
      margin: 3px 3px 3px 20px;
      --color: var(--ion-color-medium);
      --mark-width: 12px;
      --mark-height: 9px;

      &::part(mark) {
        background-position: 50% 50%;
        background-repeat: no-repeat;
        width: calc(100% + var(--border-width));
        height: calc(100% + var(--border-width));
        background-size: var(--mark-width) var(--mark-height);
        background-image: url(/public/assets/icon/check-mark.svg);
      }
    }
  }

  &__purchase-button {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 25;
    position: fixed;
    background: var(--ion-background-color);
    padding: 8px 24px calc(20px + var(--ion-safe-area-bottom));

    .button {
      margin: 0;
    }
  }
}
.split {
  margin-top: 12px;
  margin-bottom: 12px;
  width: 1px;
  height: 32px;
  background-color: #3D3D3D;
}
.font-16 {
  font-size: 16px;
}
.font-14 {
  font-size: 14px;
}
ion-modal {
  --border-radius: 12px;
  z-index: 6000000 !important;
}
</style>
