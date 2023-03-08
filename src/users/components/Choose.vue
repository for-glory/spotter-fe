<template>
  <ion-radio-group>
    <ion-item
      lines="none"
      class="radiobutton"
      v-for="(product, index) in products"
      :key="product.id"
      @click="handleChosenProduct(product)"
    >
      <div class="radiobutton__holder">
        <div class="radiobutton__head">
          <strong class="radiobutton__title">{{ product.title }}</strong>
          <ion-badge class="mark" v-if="index == products?.length - 1">
            TOP
          </ion-badge>
        </div>
        <ion-label class="radiobutton__label">
          ${{ product.front_price }}/one payment
        </ion-label>
        <ion-text class="radiobutton__description">
          {{ product.description }}
        </ion-text>
      </div>
      <ion-radio slot="end"></ion-radio>
    </ion-item>
  </ion-radio-group>
</template>

<script setup lang="ts">
import {
  IonRadioGroup,
  IonItem,
  IonLabel,
  IonRadio,
  IonText,
  IonBadge,
} from "@ionic/vue";
import { defineProps, defineEmits } from "vue";
import { Productable } from "@/ts/types/store";
import { FacilityItem } from "@/generated/graphql";

defineProps<{
  products: FacilityItem[];
}>();

const emits = defineEmits<{
  (e: "handle-chosen-product", product: Productable): void;
}>();

const handleChosenProduct = (product: Productable) => {
  emits("handle-chosen-product", product);
};
</script>

<style lang="scss" scoped>
.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --min-height: 48px;
  --padding-top: 12px;
  --border-radius: 8px;
  margin-bottom: 14px;
  --padding-bottom: 12px;
  --color: var(--ion-color-white);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: transparent;
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;
  --border-color: var(--gray-600);

  &.item-radio-checked {
    --border-color: var(--ion-color-primary);
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: var(--ion-color-medium);
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

  &__holder {
    width: 100%;
  }

  &__head {
    display: flex;
    margin: 0 0 2px;
    align-items: center;
    justify-content: flex-start;
  }

  &__title {
    display: block;
    font-size: 16px;
    overflow: hidden;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__label {
    display: block;
  }

  &__description {
    display: block;
    color: var(--ion-color-secondary);
  }
}

.mark {
  --color: var(--gray-700);
  --background: var(--ion-color-primary);
  --padding-start: 12px;
  --padding-end: 12px;
  --padding-top: 4px;
  --padding-bottom: 4px;
  margin-left: 8px;
  border-radius: 20px;
  font-weight: 500;
  font-size: 12px;
  line-height: 1;
  flex-shrink: 0;
}
</style>
