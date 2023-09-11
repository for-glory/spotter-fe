<template>
  <div
    :class="{ 'address--large': large, 'address--trainer': isTrainer }"
    class="address address--trainer"
  >
    <ion-icon
      :class="{ 'address__icon--large': large }"
      class="address__icon"
      src="assets/icon/location.svg"
    ></ion-icon>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { defineProps, withDefaults } from "vue";

withDefaults(
  defineProps<{
    large?: boolean;
    isTrainer?: boolean;
  }>(),
  {
    large: false,
    isTrainer: false,
  }
);
</script>

<style lang="scss" scoped>
.address {
  font-size: 14px;
  font-weight: 300;
  line-height: 24px;
  color: var(--gray-400);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  &--large {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
  }

  &__icon {
    flex-shrink: 0;
    line-height: 1;
    font-size: 24px;
    margin-right: 4px;
    vertical-align: top;
    color: var(--ion-color-primary);

    &--large {
      font-size: 28px;
    }
  }
}
.address--trainer {
  font-family: "Yantramanav";
  color: var(--fitnesswhite);
  // ion-icon {
  //   color: var(--gold) !important;
  // }
}
</style>
