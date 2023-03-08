<template>
  <ion-item lines="none" class="radiobutton">
    <avatar
      square
      :src="photo"
      class="radiobutton__photo"
      :symbols="facility?.name.charAt(0)"
    />
    <div class="radiobutton__holder">
      <ion-label class="radiobutton__title">{{ facility?.name }}</ion-label>
      <address-item class="radiobutton__address">
        {{ address }}
      </address-item>
    </div>
    <ion-radio :value="id" slot="end"></ion-radio>
  </ion-item>
</template>

<script setup lang="ts">
import { IonRadio, IonItem, IonLabel } from "@ionic/vue";
import AddressItem from "@/general/components/AddressItem.vue";
import { defineProps, computed } from "vue";
import { Facility, Maybe } from "@/generated/graphql";
import Avatar from "@/general/components/blocks/Avatar.vue";

const props = defineProps<{
  id?: number | string;
  facility?: Maybe<Facility>;
}>();

const photo = computed(() =>
  props.facility?.media?.length ? props.facility.media[0]?.pathUrl : null
);
const address = computed(() => props.facility?.address?.street || "");
</script>

<style scoped lang="scss">
.radiobutton {
  position: relative;
  margin-bottom: 15px;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 15px;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;
  --border-color: var(--gray-700);

  &.item-radio-checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: transparent;
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }

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

    &--rounded {
      --border-radius: 50%;
    }
  }

  &__holder {
    flex: 1 1 auto;
    max-width: 100%;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 13px;
    color: var(--ion-color-white);
  }
}
</style>
