<template>
  <div class="info">
    <div class="info__block" v-if="startDate && startDateLabel">
      <ion-text class="info__main">{{ startDate }}</ion-text>
      <ion-text class="info__secondary"> {{ startDateLabel }}</ion-text>
    </div>
    <div class="info__block">
      <ion-text class="info__main"> {{ price }}</ion-text>
      <ion-text class="info__secondary"> {{ priceLabel }}</ion-text>
    </div>
    <div class="info__block info__block--wide">
      <ion-text class="info__main"> {{ members }}</ion-text>
      <ion-text class="info__secondary"> {{ membersLabel }}</ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import { defineProps } from "vue";

defineProps<{
  startDate: string;
  startDateLabel: string;
  price: string;
  priceLabel: string;
  members: string;
  membersLabel: string;
}>();
</script>

<style scoped lang="scss">
.info {
  display: flex;
  justify-content: space-between;
  margin: 25px auto;
  background-color: var(--gray-700);
  padding: 15px 10px;
  border-radius: 8px;

  &__block {
    flex: 1 1 100%;
    white-space: nowrap;
    display: flex;
    padding: 0 8px;
    position: relative;
    flex-direction: column;
    align-items: center;

    &:not(:first-child) {
      &:before {
        left: 0;
        top: 50%;
        content: "";
        height: 32px;
        margin-top: -16px;
        position: absolute;
        border-left: 1px solid var(--gray-600);
      }
    }
  }

  &__main {
    font-weight: 500;
    font-size: 16px;
    padding: 4px 4px 8px;
    color: var(--ion-color-white);
    white-space: nowrap;
  }

  &__secondary {
    font-weight: 300;
    font-size: 14px;
  }
}
</style>
