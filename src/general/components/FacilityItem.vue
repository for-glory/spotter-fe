<template>
  <ion-item class="facility-item" :class="{'facility-item-user': role === RoleEnum.User}">
    <div class="facility-item__photo">
      <ion-img v-if="photo?.length" :src="photo"></ion-img>
      <template v-else>
        {{ facility.name?.charAt(0) }}
      </template>
    </div>
    <div class="facility-item__inner">
      <div class="facility-item__head">
        <ion-label class="facility-item__title">{{ facility.name }}</ion-label>
        <rating-number class="facility-item__rating">{{
          facility.score
        }}</rating-number>
      </div>
      <address-item class="facility-item__address">
        {{ facility.address?.street }}
      </address-item>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Facility, RoleEnum } from "@/generated/graphql";
import { IonItem, IonImg, IonLabel } from "@ionic/vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import useRoles from "@/hooks/useRole";

const props = defineProps<{
  facility: Facility;
}>();

const { role } = useRoles();

const photo = computed(() => {
  return props.facility.media?.length
    ? `${process.env.VUE_APP_MEDIA_URL}${props.facility.media[0]?.path}`
    : "";
});
</script>

<style lang="scss" scoped>
.facility-item {
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

  &:not(:first-child) {
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
.facility-item-user {
  .facility-item__title {
    font-family: "Yantramanav";
    font-size: 16px;
    font-weight: 500;
    color: var(--fitnesswhite);
  }
  .facility-item__address {
    font-family: Yantramanav;
    color: var(--gray-400);
  }
}
</style>
