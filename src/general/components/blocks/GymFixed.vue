<template>
  <div id="footer-info" class="fixed-holder">
    <div class="fixed-holder__info" v-if="title || location">
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <template v-else>
        <h3 v-if="!!title">{{ title }}</h3>
        <ion-label v-if="!!location">{{ location }}</ion-label>
      </template>
    </div>
    <div class="fixed-holder__button-holder">
      <slot name="button" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { IonSpinner, IonLabel } from "@ionic/vue";

withDefaults(
  defineProps<{
    title: string;
    location: string;
    loading?: boolean;
  }>(),
  {
    title: "",
    location: "",
    loading: false,
  }
);
</script>

<style lang="scss" scoped>
.fixed-holder {
  display: flex;
  width: 100vw;
  min-height: 88px;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 10px 20px calc(19px + var(--ion-safe-area-bottom));
  background: rgba(var(--ion-color-gray-900-rgb), 0.88);
  backdrop-filter: blur(10px);

  &__info {
    margin: 0 8px 0 0;
    overflow: hidden;
    white-space: nowrap;
    width: calc(44%);
    text-overflow: clip;
    display: flex;
    flex-direction: column;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 2px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--fitnesswhite);
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: "Yantramanav";
  }

  ion-label {
    font-size: 14px;
    line-height: 1.5;
    color: var(--gray-400);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: "Yantramanav";
  }

  &__button-holder {
    flex: 1 1 auto;

    &:deep(ion-button) {
      margin: 0 0 0 8px;
    }
  }
}

.spinner {
  position: fixed;
  top: 3vh;
  left: 22vw;
  --color: var(--ion-color-white);
}
</style>
