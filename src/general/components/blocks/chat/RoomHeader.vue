<template>
  <ion-toolbar class="header">
    <ion-buttons slot="start">
      <ion-button v-if="backBtn" class="back-btn" @click="emits('back')">
        <ion-icon src="assets/icon/arrow-back.svg"></ion-icon>
      </ion-button>
    </ion-buttons>
    <div class="header__title">
      <avatar :src="avatarSrc" class="avatar" :symbols="symbols" />
      <div class="header__text">
        <ion-title class="header__title-room">{{ title }}</ion-title>
        <ion-text
          :class="{ 'header__title-status--offline': !isOnline }"
          class="header__title-status"
        >
          {{ isOnline ? "Online" : "Offline" }}
        </ion-text>
      </div>
    </div>
  </ion-toolbar>
</template>

<script setup lang="ts">
import {
  IonToolbar,
  IonButtons,
  IonTitle,
  IonText,
  IonButton,
  IonIcon,
} from "@ionic/vue";
import { defineProps, withDefaults, defineEmits, computed } from "vue";
import Avatar from "@/general/components/blocks/Avatar.vue";

const props = withDefaults(
  defineProps<{
    avatarSrc: string;
    isOnline: boolean;
    backBtn?: boolean;
    title?: string | null;
  }>(),
  {
    backBtn: false,
    title: null,
  }
);

const symbols = computed(
  () =>
    `${props.title?.split(" ")[0]?.charAt(0)} ${props.title
      ?.split(" ")[1]
      ?.charAt(0)}`
);

const emits = defineEmits<{
  (e: "back"): void;
}>();
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  --color: var(--ion-color-white);
  --min-height: var(--header-height);
  --background: var(--gray-800);
  --padding-top: 15px;
  --padding-bottom: 5px;
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  ion-buttons {
    min-width: 64px;
  }

  &__title {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    font-family: "Yantramanav", serif;
    font-size: 20px;
    font-weight: 500;
    text-align: start;
    padding-left: 66px;

    &-room {
      padding: 0 10px;
      font-family: "Yantramanav", serif;
      font-weight: 500;
      font-size: 20px;
    }

    &-status {
      padding: 0 10px;
      font-weight: 300;
      font-size: 14px;
      color: var(--gold);

      &--offline {
        color: var(--gray-500);
      }
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
}

.buttons-first-slot {
  position: absolute;
  left: 8px;
}

.avatar {
  border-radius: 50%;
}

.back-btn {
  height: 32px;
  display: block;
  min-width: 32px;
  --border-radius: 50% !important;
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
}
</style>
