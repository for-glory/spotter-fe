<template>
  <ion-item lines="none" class="event-item">
    <avatar
      class="event-item__avatar"
      :src="event.media?.length ? event.media[0]?.pathUrl : null"
      :symbols="event.title.charAt(0)"
    />
    <div class="event-item__inner">
      <div class="event-item__head">
        <ion-label class="event-item__title">
          {{ event.title }}
        </ion-label>
        <rating-number
          class="event-item__rating"
          v-if="showRating"
        ></rating-number>
        <div class="event-item__end">
          <slot name="end"></slot>
        </div>
      </div>
      <address-item class="event-item__address">
        {{ event.address?.street }}
      </address-item>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Event } from "@/generated/graphql";
import { IonItem, IonLabel } from "@ionic/vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import Avatar from "@/general/components/blocks/Avatar.vue";

defineProps<{
  event: Event;
  showRating: boolean;
}>();
</script>

<style lang="scss" scoped>
.event-item {
  position: relative;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 16px;
  --background: var(--gray-700);
  --padding-start: 16px;
  --padding-end: var(--container-offset);
  --inner-padding-start: 0;
  --inner-padding-end: 0;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__avatar {
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    --border-radius: 50%;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    margin-right: 16px;
  }

  &__inner {
    max-width: calc(100vw - 148px);
  }

  &__head {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
    justify-content: flex-start;
  }

  &__rating {
    margin-bottom: 1px;
  }

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  &__end {
    position: absolute;
    right: 0;
    top: 6px;
  }

  &__address {
    display: flex;
    align-items: center;
  }

  &__rating {
    margin-left: 12px;
  }
}
</style>
