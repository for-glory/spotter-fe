<template>
  <div class="empty-block">
    <div>
      <ion-button
        class="button"
        expand="block"
        color="primary"
        v-if="!hideButton"
        @click="emits('buttonClick')"
      >
        {{ buttonText }}
      </ion-button>
      <div class="empty-block__img" v-if="!hideIcon">
        <ion-icon :src="icon" />
      </div>
      <ion-title class="empty-block__title">{{ title }}</ion-title>
      <ion-text color="medium" class="empty-block__text">
        {{ text }}
      </ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText, IonIcon, IonTitle, IonButton } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

const emits = defineEmits<{
  (e: "buttonClick"): void;
}>();

withDefaults(
  defineProps<{
    title?: string;
    text: string;
    buttonText?: string;
    hideButton?: boolean;
    hideIcon?: boolean;
    icon?: string;
  }>(),
  {
    icon: "assets/icon/shore-run.svg",
    buttonText: "Create",
    hideIcon: false
  }
);
</script>

<style lang="scss" scoped>
.empty-block {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  line-height: 1.5;
  color: var(--ion-color-medium);

  &__img {
    height: 1em;
    line-height: 1;
    font-size: 48px;
    text-align: center;
    margin-bottom: 24px;
    margin-top: 32px;
    color: var(--gray-600);
    ion-icon {
      color: var(--gray-500);
    }
  }

  &__title {
    text-align: center;
    color: var(--ion-color-medium);
    font-weight: 500;
    font-size: 20px;
    margin-bottom: 10px;
  }

  &__text {
    display: block;
    color: var(--ion-color-medium);
    font-weight: 300;
    font-size: 14px;
  }
}

.button {
  margin: 0;
}
</style>
