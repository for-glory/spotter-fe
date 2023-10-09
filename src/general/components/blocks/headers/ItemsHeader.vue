<template>
  <ion-toolbar :class="['items-header', { 'user-items-header': role === RoleEnum.User || !Capacitor.isNativePlatform() }]">
    <ion-title slot="start" class="items-header__title">{{ title }} </ion-title>
    <ion-button
      slot="end"
      fill="clear"
      color="primary"
      v-if="hideViewMore"
      class="items-header__btn"
      @click="$emit('handle-view')"
    >
      View {{ linkTo }}
    </ion-button>
  </ion-toolbar>
</template>
<!-- v-if="!hideViewMore" -->
<script setup lang="ts">
import { RoleEnum } from "@/generated/graphql";
import { IonToolbar, IonButton, IonTitle } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";
import useRoles from "@/hooks/useRole";
import { Capacitor } from "@capacitor/core";

withDefaults(
  defineProps<{
    title: string;
    linkTo?: string;
    hideViewMore?: boolean;
    role?:RoleEnum
  }>(),
  {
    hideViewMore: true,
    linkTo: "all",
  }
);

const { role } = useRoles()

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
    --padding-start: 8px;
    --padding-end: 8px;
    font-family: "Yantramanav";
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

.user-items-header {
  --background: transparent;

  ion-title {
    color: var(--fitnesswhite);
  }
}
</style>
