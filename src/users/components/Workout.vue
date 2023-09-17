<template>
  <ion-item
    class="workout-item common-style"
    :class="{ 
      'workout-item--hidden': hidden,
      'workout-item__native': !isNative
    }"
    @click="emits('click')"
  >
    <div class="workout-item__photo">
      <ion-img :src="pathUrl"></ion-img>
    </div>
    <div class="d-flex justify-content-between workout-item__inner">
      <div class="d-flex-col align-items-start" :class="hidden ?  'justify-content-end' : 'justify-content-between'">
        <ion-button
          v-show="share && !hidden"
          class="workout-item__btn"
          fill="clear"
          color="light"
          @click.stop="shareWorkout"
          :disabled="disabled"
        >
          <ion-icon icon="assets/icon/share.svg" />
        </ion-button>
        <div>
          <div class="workout-item__head">
            <ion-label class="workout-item__title"> {{ title }}</ion-label>
          </div>
          <ion-text class="workout-item__info">
            <ion-icon icon="assets/icon/time.svg" />
            <span>
              <template v-if="duration">
                {{ getDurationText(duration) }}
                <ion-text color="light" class="workout-item__info-dot"
                  >&nbsp;&#183;&nbsp;</ion-text
                >
              </template>
              {{ type }}
              <ion-text color="light" class="workout-item__info-dot">
                &nbsp;&#183;&nbsp;
              </ion-text>
              {{ trainer }}
            </span>
          </ion-text>
        </div>
      </div>
      <div class="d-flex-col justify-content-between align-items-end">
        <ion-button
          v-if="hide && (!hidden || isShowButtonVisible)"
          class="workout-item__btn workout-item__btn--hide"
          fill="clear"
          color="light"
          @click.stop="toggleWorkout"
          :disabled="disabled"
        >
          <ion-icon
            :icon="hidden ? 'assets/icon/eye.svg' : 'assets/icon/media.svg'"
          />
        </ion-button>
        <div class="d-flex-col gap-6">
          <div class="d-flex align-items-center">
            <ion-icon src="assets/icon/dollar-circle.svg" class="w-24 h-24 color-gold"></ion-icon>
            <ion-text class="font-light font-18 color-fitness-white">{{ formatNumber(total_revenue ?? 0) }}</ion-text>
          </div>
          <div class="d-flex align-items-center">
            <ion-icon src="assets/icon/heart-filled.svg" class="w-24 h-24 color-gold"></ion-icon>
            <ion-text class="font-light font-18 color-fitness-white" styl>{{ formatNumber(recommended_count ?? 0) }}</ion-text>
          </div>
          <div class="d-flex align-items-center">
            <ion-icon src="assets/icon/eye.svg" class="w-24 h-24  color-gold"></ion-icon>
            <ion-text class="font-light font-18 color-fitness-white">{{ formatNumber(reviews_count ?? 0) }}</ion-text>
          </div>
        </div>
      </div>
    </div>
  </ion-item>

  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to hide this workout?"
    description="This workout will become inactive and will be excluded from the search list"
    button-text="Hide workout"
    @discard="onHideConfirmed"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults } from "vue";
import {
  IonItem,
  IonImg,
  IonLabel,
  IonText,
  IonIcon,
  IonButton,
} from "@ionic/vue";
import { timeConvertToHuman } from "@/helpers/date-formater";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Share } from "@capacitor/share";
import { Capacitor } from "@capacitor/core";

const props = withDefaults(
  defineProps<{
    id?: string;
    pathUrl: string;
    title: string;
    trainer: string;
    type: string;
    duration?: number;
    total_revenue?: number;
    reviews_count?: number;
    recommended_count?: number;
    share?: boolean;
    hide?: boolean;
    hidden?: boolean;
    disabled?: boolean;
    isShowButtonVisible?: boolean;
  }>(),
  {
    isShowButtonVisible: true,
  }
);

const emits = defineEmits<{
  (e: "hide"): void;
  (e: "show"): void;
  (e: "share"): void;
  (e: "click"): void;
}>();

const toggleWorkout = () => {
  if (props.hidden) {
    emits("show");
  } else {
    showHideConfirmationModal();
  }
};
let isNative = Capacitor.isNativePlatform();

const {
  showConfirmationModal,
  hideModal,
  showModal: showHideConfirmationModal,
} = useConfirmationModal();

const onHideConfirmed = () => {
  hideModal();
  emits("hide");
};

const shareWorkout = async (event: any) => {
  event.preventDefault();
  await Share.share({
    title: props.title,
    url: `https://${process.env.VUE_APP_URL}/users/workouts/${props.id}`,
    dialogTitle: "Share",
  });
};

const formatNumber = (num: number) => {
  if(num <= 9) {
    return num;
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e5) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return Math.floor(num / 1e3) + (num >= 1e3 ? ',' : '') + (num % 1e3);
  }
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

</script>

<style lang="scss" scoped>
.workout-item {
  --border-radius: 8px;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: var(--container-offset);
  --inner-padding-end: var(--container-offset);
  --min-height: 160px;
  --inner-padding-top: 10px;
  --inner-padding-bottom: 10px;
  --padding-top: 0;
  --padding-bottom: 0;
  --background: var(--gray-600);

  &__native {
    width: 280px;
  }

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__inner {
    width: 100%;
    height: 100%;
  }

  &__btn {
    height: 32px;
    margin: 0 -4px;
    font-size: 24px;
    display: block;
    min-width: 32px;
    --border-radius: 4px;
    --icon-font-size: 24px;
    --padding-bottom: 0;
    --padding-end: 0;
    --padding-start: 0;
    --padding-top: 0;
    --icon-padding-bottom: 0;
    --icon-padding-end: 0;
    --icon-padding-start: 0;
    --icon-padding-top: 0;
    --min-height: 32px;
    --min-width: 32px;

    &--hide {
      margin-left: auto;
    }

    ion-icon {
      font-size: 1em;
      filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.24));
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    align-self: flex-end;
    cursor: pointer;
  }

  &__photo {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -5;
    position: absolute;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 64px;
    font-weight: 700;
    line-height: 68px;
    color: var(--gray-700);

    .workout-item--hidden & {
      filter: grayscale(1);
    }

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    &:before {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: "";
      position: absolute;
      background: linear-gradient(
        180deg,
        rgba(17, 17, 18, 0) 0%,
        rgba(17, 17, 18, 0.88) 100%,
        rgba(17, 17, 18, 0.88) 100%
      );
    }
  }

  &__head {
    display: flex;
    margin-bottom: 4px;
    align-items: center;
    justify-content: flex-start;
  }

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 12px;
    color: var(--ion-color-white);

    .workout-item--hidden & {
      color: var(--ion-color-medium);
    }
  }

  &__info {
    display: flex;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    align-items: center;
    justify-content: flex-start;

    ion-icon {
      line-height: 1;
      font-size: 24px;
      margin-right: 4px;
      color: var(--ion-color-primary);
    }

    .workout-item--hidden & {
      color: var(--ion-color-medium);

      ion-icon {
        color: inherit;
      }
    }
  }
  &__info-dot {
    font-weight: 500;
    font-size: 16px;
  }
}
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
  }
  .font-18 {
    font-size: 18px;
  }
}

</style>
