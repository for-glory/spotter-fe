<template>
  <div class="empty-state">
    <ion-icon
      :src="require(`../../../../public/assets/icon/${icon}.svg`)"
      class="empty-state__icon"
    />
    <ion-title class="empty-state__title">{{ title }}</ion-title>
    <ion-text class="empty-state__context">{{ context }}</ion-text>
    <ion-button
      v-if="action"
      type="submit"
      expand="block"
      class="empty-state__btn"
      @click="$emit('on-click')"
    >
      {{ action }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { IonIcon, IonTitle, IonText, IonButton } from "@ionic/vue";

defineProps<{
  icon: string;
  title: string;
  context: string;
  action?: string;
}>();
</script>

<style scoped lang="scss">
.empty-state {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
  gap: 24px;

  &__icon {
    width: 29px;
    height: 36px;
  }

  &__title {
    font-weight: 500;
    font-size: 20px;
    line-height: 150%;
    color: var(--gray-500);
    flex: none;
  }

  &__context {
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
    color: var(--gray-500);
  }

  &__btn {
    width: 100%;
  }
}
</style>
