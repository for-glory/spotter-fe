<template>
  <ion-modal ref="modal" :is-open="isOpen" :backdrop-dismiss="false">
    <div class="wrapper">
      <ion-icon
        src="assets/icon/close.svg"
        @click="closeModal"
        class="close-btn"
      ></ion-icon>
      <ion-img class="modal__img" src="assets/unsplash.png" />
      <div class="ion-padding-horizontal">
        <ion-title class="modal__title"> Waiting for approving... </ion-title>
        <div class="modal__content">
          <ion-text color="secondary" class="modal__text">
            Your training is waiting for being approved by trainer
          </ion-text>
        </div>
        <div class="modal__footer">
          <ion-button @click="openChat" class="modal__button">
            Open chat
          </ion-button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  IonTitle,
  IonText,
  IonButton,
  IonIcon,
  IonImg,
} from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

withDefaults(
  defineProps<{
    isOpen: boolean;
  }>(),
  {
    isOpen: false,
  }
);

const emits = defineEmits<{
  (e: "close"): void;
  (e: "open-chat"): void;
}>();

const closeModal = () => {
  emits("close");
};

const openChat = () => {
  emits("open-chat");
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
  }

  &__title {
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    padding: 0;
    margin-bottom: 3px;
    --color: var(--ion-color-white);
  }

  &__content {
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
    gap: 0 16px;
    display: flex;
    justify-content: space-between;
  }

  &__button {
    margin: 0;
    flex: 1 1 50%;
  }
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 20px;
  height: 16px;
  display: block;
  min-width: 16px;
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
</style>
