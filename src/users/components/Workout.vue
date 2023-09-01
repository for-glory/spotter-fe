<template>
  <ion-item
    class="workout-item"
    :class="{ 'workout-item--hidden': hidden }"
    @click="emits('click')"
  >
    <div class="workout-item__photo">
      <!-- <ion-img :src="pathUrl"></ion-img> -->
    </div>

    <div class="workout-item__inner">
      <div class="workout-item__icons">
        <ion-button
          v-if="share && !hidden"
          class="workout-item__btn"
          fill="clear"
          color="light"
          @click.stop="shareWorkout"
          :disabled="disabled"
        >
          <ion-icon icon="assets/icon/share.svg" />
        </ion-button>
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
      </div>

      <div>
        <div class="workout-item__head">
          <ion-label class="workout-item__title"> {{ title }}</ion-label>
        </div>
        <ion-text class="workout-item__info">
          <ion-icon icon="assets/icon/time.svg" />
          <span>
            <template v-if="duration">
              {{ timeConvertToHuman(duration) }}
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

const props = withDefaults(
  defineProps<{
    id?: string;
    pathUrl: string;
    title: string;
    trainer: string;
    type: string;
    duration?: number;
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

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__inner {
    width: 100%;
    display: flex;
    min-height: 100%;
    flex-direction: column;
    justify-content: space-between;
  }

  &__icons {
    display: flex;
    justify-content: space-between;
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
</style>
