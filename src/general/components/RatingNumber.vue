<template>
  <ion-text
    :color="color"
    class="rating-number"
    :class="`rating-number--${color}`"
    :style="{ '--border-color': `var(--ion-color-${color})` }"
  >
    <slot></slot>
  </ion-text>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { IonText } from "@ionic/vue";

withDefaults(
  defineProps<{
    color?: string;
  }>(),
  {
    color: "primary",
  }
);
</script>

<style lang="scss" scoped>
.rating-number {
  min-width: 37px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  border-radius: 11px;
  display: inline-block;
  padding: 3px 8px 2px 8px;
  box-shadow: inset 0 0 0 1px var(--border-color);
}
</style>
