<template>
  <ion-item lines="none" class="item">
    <ion-thumbnail class="item__photo">
      <img v-if="avatarUrl" :src="avatarUrl" class="item__img" />
      <template v-else>
        {{ title.charAt(0) }}
      </template>
    </ion-thumbnail>
    <div :class="['item__holder', { 'user-item': role === RoleEnum.User }]">
      <div class="item__header" :class="{ 'item__header--offset': $slots.end }">
        <ion-label class="item__title">
          {{ title }}
        </ion-label>
        <rating-number v-if="rating">{{ rating }}</rating-number>
      </div>
      <div class="item__end" v-if="$slots.end">
        <slot name="end"></slot>
      </div>
      <ion-text v-if="date" class="item__date">{{ date }}</ion-text>
      <address-item class="item__address" v-if="address">
        {{ address }}
      </address-item>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { IonThumbnail, IonItem, IonLabel, IonText } from "@ionic/vue";
import AddressItem from "@/general/components/AddressItem.vue";
import { defineProps } from "vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
defineProps<{
  title: string;
  avatarUrl?: string;
  address: string;
  date?: string;
  rating?: number | string;
}>();

const { role } = useRoles()
</script>

<style scoped lang="scss">
.item {
  position: relative;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 14px;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;
  }

  &__header {
    display: flex;
    align-items: center;

    &--offset {
      max-width: calc(100% - 42px);
    }

    .rating-number {
      margin-left: 8px;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    max-width: calc(100% - 62px);
    color: var(--ion-color-white);
  }

  &__date {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
  }

  &__end {
    position: absolute;
    display: flex;
    align-items: center;
    top: -2px;
    right: 2px;
  }

  &__holder {
    width: calc(100% - 68px);
  }
}

.user-item {
  .item__title, .item__date {
    font-family: Yantramanav;
  }
}
</style>
