<template>
  <ion-modal ref="modal" :is-open="isVisible" :backdrop-dismiss="false">
    <div class="wrapper">
      <ion-icon
        src="assets/icon/close.svg"
        @click="handleCancel"
        class="close-btn"
      ></ion-icon>
      <ion-img class="modal__img" src="assets/dumbbells.png" />
      <div class="ion-padding-horizontal">
        <strong class="modal__title">
          {{ title }}
        </strong>
        <div class="modal__content">
          <ion-text color="secondary" class="modal__text">
            {{ description }}
          </ion-text>
        </div>
        <div class="modal__footer">
          <ion-button @click="handleCancel" class="modal__button">
            {{ cancelButtonText }}
          </ion-button>
          <ion-button @click="handleDiscard" class="modal__button secondary">
            {{ buttonText }}
          </ion-button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonText, IonButton, IonIcon, IonImg } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

withDefaults(
  defineProps<{
    title: string;
    description: string;
    buttonText: string;
    isVisible: boolean;
    cancelButtonText?: string;
  }>(),
  {
    cancelButtonText: "Cancel",
  }
);

const emits = defineEmits<{
  (e: "decline", isConfirmed: boolean): void;
  (e: "discard", isConfirmed: boolean): void;
}>();

const handleCancel = () => {
  emits("decline", false);
};

const handleDiscard = () => {
  emits("discard", true);
};
</script>

<style scoped lang="scss">
ion-modal {
  --height: fit-content;
  --border-radius: 16px;
  padding: 16px;
}

ion-modal::part(backdrop) {
  background: rgba(0, 0, 0, 0.9);
  opacity: 1;
}

.wrapper {
  position: relative;
  text-align: center;
  padding-bottom: 24px;
}

.modal {
  &__img {
    margin-bottom: 24px;
    position: relative;
    &::after {
      content: "";
      background: rgba(25, 25, 27, 0.80);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }

  &__title {
    display: block;
    font-family: "Yantramanav", serif;
    font-weight: 500;
    padding: 0;
    font-size: 20px;
    margin-bottom: 3px;
    --color: var(--ion-color-white);
  }

  &__content {
    overflow-y: scroll;
    padding: 12px 12px 0;
    margin-bottom: 18px;
  }

  &__text {
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
  }

  &__footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &__button {
    width: calc(50% - 8px);
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 24px;
  display: block;
  min-width: 24px;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 16px;
  --min-width: 16px;
  z-index: 5;
}
.cancel-training-modal {
  .modal__title {
    font-weight: 700;
    color: var(--gold);
  }
  .modal__text {
    font-family: "Yantramanav";
  }
  .modal__footer {
    .modal__button {
      font-family: "Yantramanav";
      --color: var(--gray-700);
      &.secondary{
        --border-color: var(--gold);
        --border-width: 0.8px;
        --color: var(--fitnesswhite);
      }
    }
  }
}
</style>
