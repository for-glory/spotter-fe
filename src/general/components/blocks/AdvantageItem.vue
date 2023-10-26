<template>
  <div :class="['certificate', { 'light-certificate': lightItem }]">
    <ion-icon :src="icon" class="certificate-icon" />
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { defineProps } from "vue";

defineProps<{
  icon: string;
  title: string;
  lightItem?: boolean;
}>();
</script>

<style scoped lang="scss">
.certificate {
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 9px 16px;
  font-weight: 400;
  font-size: 14px;
  color: var(--gray-500);
  margin-right: 12px;
  margin-bottom: 12px;
  box-shadow: inset 0 0 0 1px var(--gray-600);
  cursor: pointer;
  line-height: 14px;

  &-icon {
    width: 1em;
    height: 1em;
    font-size: 24px;
    margin-right: 8px;
  }
}

.light-certificate {
  color: var(--grey-text);
}
</style>
