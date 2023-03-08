<template>
  <ion-spinner v-if="percent === undefined" name="lines" class="spinner" />
  <circle-progress
    v-else
    :size="size"
    :border-width="borderWidth"
    :percent="percent"
    fill-color="var(--ion-color-primary)"
    empty-color="var(--ion-color-medium)"
    :border-bg-width="2"
    show-percent
    class="circle-progress"
    :transition="0"
  />
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import "vue3-circle-progress/dist/circle-progress.css";
import CircleProgress from "vue3-circle-progress";
import { IonSpinner } from "@ionic/vue";

withDefaults(
  defineProps<{
    percent?: number;
    size?: number;
    borderWidth?: number;
  }>(),
  {
    size: 70,
    borderWidth: 1,
  }
);
</script>

<style lang="scss">
.current-counter {
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-primary);

  &:after {
    content: "%";
  }
}

.spinner {
  display: block;
}
</style>
