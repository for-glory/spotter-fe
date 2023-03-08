<template>
  <div class="card__container">
    <div class="card__content">
      <ion-icon src="assets/icon/payment/card.svg" class="card__icon" />
      <div class="card__number">
        <div class="hidden-numbers">
          <ion-icon
            v-for="index in 4"
            :key="index"
            src="assets/icon/payment/circle.svg"
            class="hidden-number"
          />
        </div>
        <div class="hidden-numbers">
          <ion-icon
            v-for="index in 4"
            :key="index"
            src="assets/icon/payment/circle.svg"
            class="hidden-number"
          />
        </div>
        <div class="hidden-numbers">
          <ion-icon
            v-for="index in 4"
            :key="index"
            src="assets/icon/payment/circle.svg"
            class="hidden-number"
          />
        </div>
        <ion-text class="visible-numbers">{{ cardNumber }} </ion-text>
        <ion-icon
          class="card__action-icon"
          :src="`assets/icon/${deletable ? 'delete' : 'verified'}.svg`"
          @click="onDelete"
        />
      </div>
      <div class="card__footer">
        <div class="card__holder">
          <ion-text class="card__holder__desrc desrc">Cardholder</ion-text>
          <ion-text class="card__holder__title title">
            {{ cardHolder }}
          </ion-text>
        </div>
        <div class="card__exp-date">
          <ion-text class="card__exp-date__desrc desrc">Exp. date</ion-text>
          <ion-text class="card__exp-date__title title">{{ expDate }}</ion-text>
        </div>
        <div v-if="isDefault" class="title">Default card for the payments</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonText, IonIcon } from "@ionic/vue";
import { defineProps, withDefaults, defineEmits } from "vue";

const props = withDefaults(
  defineProps<{
    cardHolder: string;
    cardNumber: number;
    expDate: string;
    deletable?: boolean;
    isDefault?: boolean;
  }>(),
  {
    deletable: false,
    isDefault: false,
  }
);

const emits = defineEmits<{
  (e: "delete"): void;
}>();

const onDelete = () => {
  if (props.deletable) {
    emits("delete");
  }
};
</script>
<style scoped lang="scss">
.card {
  &__container {
    display: inline-block;
    height: 170px;
    border-radius: 8px;
    width: 100%;
    background: var(--gray-700)
      url("../../../../../public/assets/icon/payment/visa-logo.png") no-repeat
      50% 50%;
    border: 1px solid var(--gray-600);
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: 27px 20px 16px 20px;
  }

  &__action-icon {
    font-size: 22px;
  }

  &__icon {
    font-size: 36px;
    margin-bottom: 2px;
  }

  &__number {
    display: inline-grid;
    grid-template-columns: repeat(4, 36px) 14px;
    gap: 5px;
    font-weight: 500;
    align-items: center;
    font-size: 16px;
    line-height: 150%;
    color: var(--ion-color-white);
    margin-bottom: 22px;
  }

  &__footer {
    display: flex;
    gap: 16px;
  }

  &__holder,
  &__exp-date {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  &__exp-date {
    white-space: nowrap;
  }
}

.title {
  font-weight: 300;
  font-size: 12px;
  color: var(--ion-color-white);
}

.desrc {
  font-weight: 500;
  font-size: 12px;
  color: var(--gray-500);
}

.hidden-number {
  font-size: 6px;
  padding-right: 3px;
}

.visible-numbers {
  padding-top: 3px;
}
</style>
