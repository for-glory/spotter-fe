<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header @back="handleBack" back-btn title="Your feedback matters" />
    </template>
    <template #content>
      <div class="ion-padding-horizontal review">
        <div class="review__holder">
          <ion-radio-group v-model="feedback">
            <ion-label class="review__question">
              Would you recommend this gym?
            </ion-label>
            <ion-item lines="none" class="radiobutton radiobutton--positive">
              <ion-icon class="radiobutton__icon" src="assets/icon/like.svg" />
              <ion-label class="radiobutton__label"> Yes, sure!</ion-label>
              <ion-radio
                slot="end"
                :value="EntitiesEnum.Positive.toLowerCase()"
              ></ion-radio>
            </ion-item>
            <ion-item lines="none" class="radiobutton radiobutton--negative">
              <ion-icon
                class="radiobutton__icon"
                src="assets/icon/dislike.svg"
              />
              <ion-label class="radiobutton__label"> Absolutely not</ion-label>
              <ion-radio
                slot="end"
                :value="EntitiesEnum.Negative.toLowerCase()"
              ></ion-radio>
            </ion-item>
          </ion-radio-group>
          <div class="review__bottom-button">
            <ion-button
              @click="goNextStep"
              class="button--submit"
              expand="block"
              :disabled="!feedback"
            >
              Next
            </ion-button>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonIcon,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";

const route = useRoute();
const router = useRouter();

const handleBack = () => {
  router.go(-1);
};

const feedback = ref<string>("");

const goNextStep = () => {
  router.push({
    name: EntitiesEnum.AddReview,
    params: { id: route.params.id },
    query: { feedback: feedback.value },
  });
};
</script>

<style scoped lang="scss">
.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --min-height: 48px;
  --padding-top: 0;
  --border-radius: 8px;
  margin-bottom: 14px;
  --padding-bottom: 0;
  --color: var(--ion-color-medium);
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
    --color: var(--ion-color-white);
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

  &__icon {
    margin-right: 4px;
    font-size: 24px;
    width: 1em;
    height: 1em;

    .radiobutton--positive & {
      color: var(--ion-color-success);
    }

    .radiobutton--negative & {
      color: var(--ion-color-danger-tint);
    }
  }
}

.review {
  height: 100%;
  text-align: center;
  padding-top: 25px;

  &__holder {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 80px 8px 0;
  }

  &__question {
    display: block;
    margin-bottom: 32px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  &__bottom-button {
    margin-top: auto;
    margin-bottom: 16px;

    ion-button {
      margin-bottom: 16px;
      letter-spacing: 0;
    }
  }
}
</style>
