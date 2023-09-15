<template>
  <div class="dashboard-item__container">
    <div class="dashboard-item">
      <ion-text class="dashboard-item__title">
        <slot name="title"></slot>
      </ion-text>
      <div class="align-items-center gap-16" :class="isWeb ? 'd-flex' : ''">
        <div
        v-for="item in itemsWithIds"
        :key="item._id"
        class="dashboard-item__content d-flex align-items-center"
        >
        <ion-text class="dashboard-item__content-value">
          {{ item.value }}
        </ion-text>
        <ion-text class="dashboard-item__content-descr">
          {{ item.description }}
        </ion-text>
        </div>
        <div class="dashboard-item__content">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import { IonText } from "@ionic/vue";
import { v4 as uuidv4 } from "uuid";

const props = defineProps<{
  items: { value: number | string; description: string }[];
  isWeb?: boolean
}>();

const itemsWithIds = computed(() =>
  props.items.map((item) => ({ ...item, _id: uuidv4() }))
);
</script>

<style scoped lang="scss">
.dashboard-item {
  &__container {
    background: var(--gray-700);
    border-radius: 8px;
    display: flex;
    flex: 0 0 calc(50% - 7px);
    align-items: center;
    padding: 12px 16px;
  }
  &__title {
    display: flex;
    align-items: center;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    // padding-left: 2px;
    color: var(--gold);
    margin-bottom: 10px;
  }

  &__content {
    &-value {
      font-family: "Yantramanav", serif;
      font-style: normal;
      font-weight: 500;
      font-size: 20px;
      line-height: 150%;
      color: var(--ion-color-white);
      padding-right: 8px;
    }

    &-descr {
      font-family: "Yantramanav", serif;
      font-style: normal;
      font-weight: 300;
      font-size: 14px;
      line-height: 150%;
      color: var(--fitnesswhite);
    }
  }
}
.trainer-item {
  .dashboard-item__title {
    font-family: "Yantramanav";
  }
}
</style>
