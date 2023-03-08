<template>
  <div class="time">
    <ion-icon class="time__icon" src="assets/icon/time.svg"></ion-icon>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
</script>

<style lang="scss" scoped>
.time {
  display: flex;
  font-size: 14px;
  font-weight: 300;
  align-items: center;
  color: var(--ion-color-white);
  justify-content: flex-start;
  white-space: nowrap;

  &__icon {
    line-height: 1;
    font-size: 24px;
    margin-right: 4px;
    color: var(--ion-color-primary);
  }
}
</style>
