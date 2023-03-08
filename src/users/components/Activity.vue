<template>
  <ion-item class="activity-item">
    <div class="activity-item__photo">
      <ion-img v-if="activity.photo?.length" :src="activity.photo"></ion-img>
      <template v-else>
        {{ activity.name?.charAt(0) }}
      </template>
    </div>
    <div class="activity-item__inner">
      <div class="activity-item__head">
        <ion-label class="activity-item__title"> {{ activity.name }}</ion-label>
        <rating-number class="activity-item__rating">
          {{ activity.rating }}
        </rating-number>
      </div>
      <address-item class="activity-item__address" v-if="activity.distance">
        <ion-text class="activity-item__distance" color="primary">
          {{ activity.distance }}
        </ion-text>
        far from you
      </address-item>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { IonItem, IonImg, IonLabel, IonText } from "@ionic/vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import { ActivityItem } from "@/interfaces/ActivityItem";

defineProps<{
  activity: ActivityItem;
}>();
</script>

<style lang="scss" scoped>
.activity-item {
  --border-radius: 8px;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: var(--container-offset);
  --inner-padding-end: var(--container-offset);
  --min-height: 160px;
  --inner-padding-top: 10px;
  --inner-padding-bottom: 10px;
  --padding-top: 0;
  --padding-bottom: 0;
  --background: var(--gray-600);

  &:not(:first-of-type) {
    margin-top: 16px;
  }

  &__inner {
    width: 100%;
    display: flex;
    min-height: 100%;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__photo {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -5;
    position: absolute;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 64px;
    font-weight: 700;
    line-height: 68px;
    color: var(--gray-700);

    &:before {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: "";
      position: absolute;
      background: linear-gradient(
        180deg,
        rgba(17, 17, 18, 0) 0%,
        rgba(17, 17, 18, 0.88) 100%
      );
    }

    ion-img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  &__head {
    display: flex;
    margin-bottom: 4px;
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
    margin-right: 12px;
    color: var(--ion-color-white);
  }

  &__distance {
    margin-right: 3px;
  }
}
</style>
