<template>
  <ion-toolbar class="items-header">
    <ion-title slot="start" class="items-header__title">{{ title }} </ion-title>
    <ion-button
      slot="end"
      fill="clear"
      color="primary"
      v-if="!hideViewMore"
      class="items-header__btn"
      @click="$emit('handle-view')"
    >
      View {{ linkTo }}
    </ion-button>
  </ion-toolbar>
</template>

<script setup lang="ts">
import { IonToolbar, IonButton, IonTitle } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

withDefaults(
  defineProps<{
    title: string;
    linkTo?: string;
    hideViewMore?: boolean;
  }>(),
  {
    linkTo: "all",
  }
);

defineEmits<{
  (e: "handle-view"): void;
}>();
</script>

<style scoped lang="scss">
.items-header {
  margin-bottom: 16px;
  --min-height: 24px;
  --padding-top: 24px;
  --padding-bottom: 0;

  &__btn {
    height: 24px;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
  }

  &__title {
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    padding-left: 0;
    line-height: 150%;
    color: var(--ion-color-white);
  }
}
</style>
