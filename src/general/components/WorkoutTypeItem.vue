<template>
  <div :class="{ 'workout-type--large': large }" class="workout-type">
    <ion-icon
      :class="{ 'workout-type__icon--large': large }"
      class="workout-type__icon"
      src="assets/icon/workout.svg"
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
  }>(),
  {
    large: false,
  }
);
</script>

<style lang="scss" scoped>
.workout-type {
  display: flex;
  font-size: 14px;
  font-weight: 300;
  align-items: center;
  color: var(--gray-400);
  justify-content: flex-start;
  overflow: hidden;
  white-space: nowrap;
  gap: 10px;

  &--large {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
  }

  &__icon {
    line-height: 1;
    font-size: 24px;
    margin-right: -4px;
    color: var(--ion-color-primary);

    &--large {
      font-size: 28px;
    }
  }
}
</style>
