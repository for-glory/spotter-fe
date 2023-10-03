<template>
  <div
    :class="[
      'dashboard-item__container',
      { 'user-dashboard-item-web': role === RoleEnum.User && !Capacitor.isNativePlatform() },
      { 'user-item': role === RoleEnum.User && Capacitor.isNativePlatform() }
    ]"
  >
    <div class="dashboard-item">
      <ion-text class="dashboard-item__title">
        <slot name="title"></slot>
      </ion-text>
      <div class="dashboard-item__sub-title align-items-center gap-16" :class="isWeb ? 'd-flex' : ''">
        <div
          v-for="item in itemsWithIds"
          :key="item._id"
          class="dashboard-item__content d-flex align-items-center"
        >
          <ion-text class="dashboard-item__content-value">
            {{ item.value  }}
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
import { RoleEnum } from "@/generated/graphql";
import { Capacitor } from "@capacitor/core";
import useRoles from "@/hooks/useRole";

const props = defineProps<{
  items: { value: number | string; description: string }[];
  isWeb?: boolean;
}>();

const { role } = useRoles()

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
.user-item {
  .dashboard-item__title {
    font-family: "Yantramanav";
  }
}
.user-dashboard-item-web {
  padding: 8px 39px 16px 16px;
  .dashboard-item {
    width: 100%;
    &__title {
      color: var(--FITNESS-BEIGE, var(--Beige, #e1dbc5));
      font-family: Lato;
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      ion-icon {
        font-size: 24px;
      }
    }

    &__sub-title {
      justify-content: space-between;
    }
  }
}
</style>
