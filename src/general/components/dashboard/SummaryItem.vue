<template>
  <div class="content">
    <div class="flex-container">
      <ion-label class="text-title">{{ title }}</ion-label>
      <ion-text class="text-key">{{ keyText }}</ion-text>
    </div>
    <div class="text-box">
      <ion-text class="text-value">{{ value }}</ion-text>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import {
  IonLabel,
  IonText,
} from "@ionic/vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    keyText?: string;
    value?: number;
    type?: string;
  }>(),
  {
    title: "Total",
    keyText: "Default",
    value: 0,
    type: "normal",
  }
);
</script>
<style scoped lang="scss">
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 16px;
}

.flex-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  gap: 4px;
}

.text-title {
  font: 14px/1 "Lato";
  color: var(--gold);
}

.text-key {
  font: 500 16px/1 "Lato";
  color: var(--gray-500);

  @media (max-width: 320px) {
    font-size: 14px;
  }
}

.text-value {
  font: 600 26px/1 var(--ion-font-family);
  color: var(--gray-500);

  @media (max-width: 320px) {
    font-size: 22px;
  }
}

.text-box {
  height: 100%;
  display: flex;
  align-items: flex-end;
}</style>
