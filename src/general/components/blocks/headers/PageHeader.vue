<template>
  <ion-toolbar
    class="header"
    :class="{
      'header--transparent': transparent,
      'header--buttons-transparent': buttonsTransparent,
      'ios-app-top': isPlatform('ios')
    }"
  >
    <ion-buttons slot="start">
      <ion-button v-if="backBtn" class="back-btn" @click="emits('back')">
        <ion-icon src="assets/icon/arrow-back.svg" />
      </ion-button>
      <ion-button v-if="closeBtn" class="close-btn" @click="$emit('back')">
        <ion-icon src="assets/icon/close.svg" />
      </ion-button>
      <slot name="avatar-field"></slot>
    </ion-buttons>
    <ion-buttons slot="end">
      <slot name="custom-btn"></slot>
      <ion-button
        v-if="skipBtn"
        fill="clear"
        color="medium"
        class="skip-btn"
        @click="emits('skip')"
      >
        Skip
      </ion-button>
    </ion-buttons>
    <ion-title :class="titleClass">{{ title }}</ion-title>
  </ion-toolbar>
</template>

<script lang="ts">
export default {
  name: "page-header",
};
</script>

<script setup lang="ts">
import {
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonTitle,
  isPlatform
} from "@ionic/vue";
import { defineProps, withDefaults, defineEmits } from "vue";

withDefaults(
  defineProps<{
    transparent?: boolean;
    buttonsTransparent?: boolean;
    backBtn?: boolean;
    skipBtn?: boolean;
    closeBtn?: boolean;
    title?: string | null;
    titleClass?: string;
  }>(),
  {
    transparent: false,
    buttonsTransparent: false,
    backBtn: false,
    skipBtn: false,
    closeBtn: false,
    title: null,
    titleClass: "header__title",
  }
);

const emits = defineEmits<{
  (e: "back"): void;
  (e: "skip"): void;
}>();
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  padding-top: var(--ion-safe-area-top);
  --color: var(--ion-color-white);
  --min-height: var(--header-height);
  --background: var(--gray-800);
  --padding-top: 5px;
  --padding-bottom: 5px;
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &--transparent {
    --background: transparent;
  }

  ion-buttons {
    margin: 0 -5px;
    min-width: 80px;

    ion-button {
      margin: 0 5px;

      &:first-child {
        margin-left: 1px;
      }
    }
  }

  &__title {
    padding: 0;
    font-family: "Yantramanav", serif;
    font-size: 20px;
    line-height: 1.5;
    font-weight: 500;
    text-align: center;
  }
  &_trainer__title {
    font: 500 20px Lato;
    text-align: center;
    font-style: normal;
    font-weight: 500;
    color: var(--gold);
  }
}

.buttons-last-slot {
  justify-content: flex-end;
}

.back-btn {
  height: 32px;
  display: block;
  min-width: 32px;
  font-size: 24px;
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

  .header--transparent:not(.header--buttons-transparent) & {
    border-radius: 50%;
    backdrop-filter: blur(4px);
    --background: rgba(var(--ion-color-black-rgb), 0.12);
  }

  ion-icon {
    font-size: 1em;
  }
}

.skip-btn {
  font-size: 16px;
  line-height: 1.5;
}

.close-btn {
  height: 30px;
  display: block;
  min-width: 30px;
  --padding-start: 7px;
  --icon-font-size: 16px;
  --min-height: 30px;
  --min-width: 30px;
}

.header__title{


  text-align: center;
  font-family: Lato;
font-size: 24px;
font-weight: 400;
line-height: 31px;
letter-spacing: 0em;
color:#E1DBC5;

}

</style>
