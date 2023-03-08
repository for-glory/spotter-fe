<template>
  <ion-button
    :id="`${icon}`"
    class="payment-method__btn"
    :class="{ 'payment-method__btn--google-pay': id === 'googlePay' }"
  >
    <ion-icon
      class="payment-method__icon"
      :src="`assets/icon/payment/${icon}.svg`"
    />
    <ion-text class="payment-method__title">{{ title }}</ion-text>
  </ion-button>
</template>

<script setup lang="ts">
import { IonButton, IonIcon, IonText } from "@ionic/vue";
import { defineProps } from "vue";

defineProps<{
  id?: string;
  icon: string;
  title: string;
}>();
</script>

<style lang="scss" scoped>
.payment-method {
  &__btn {
    margin: 0;
    --background: var(--gray-700);
    --box-shadow: none;

    &--google-pay {
      --border-radius: 24px;
      --background: var(--ion-color-black);
      --ripple-color: #3c4043;
      --background-activated: #3c4043;
    }

    &::part(native) {
      display: flex;
      align-items: center;
    }
  }

  &__icon {
    font-size: 24px;
    margin-right: 8px;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }
}
</style>
