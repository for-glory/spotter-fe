<template>
  <ion-text :class="{ total: isTotal }" class="rating">
    {{ value.toString().includes(".") ? value : `${value}.0` || "0.0" }}
  </ion-text>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { IonText } from "@ionic/vue";

withDefaults(
  defineProps<{
    value: number;
    isTotal?: boolean;
  }>(),
  {
    isTotal: false,
  }
);
</script>

<style scoped lang="scss">
.rating {
  border: 1px solid var(--gray-400);
  border-radius: 20px;
  padding: 2px 10px;
  font-weight: 500;
  font-size: 12px;
  color: var(--ion-color-white);

  &.total {
    border-color: var(--gold);
    color: var(--gold);
  }
}
</style>
