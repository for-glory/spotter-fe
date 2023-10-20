<template>
  <BaseLayout hide-navigation-menu>
    <template #header>
      <PageHeader back-btn @back="$router.back()" title="Employment Type" />
    </template>
    <template #content>
      <div class="emp-container ion-padding">
        <ion-radio-group value="Full Time">
          <ion-item lines="none" class="radiobutton">
            <ion-label class="radiobutton__label"> Full Time </ion-label>
            <ion-radio slot="end" value="Full Time" />
          </ion-item>
          <ion-item lines="none" class="radiobutton">
            <ion-label class="radiobutton__label"> Contract </ion-label>
            <ion-radio slot="end" value="Contract" />
          </ion-item>
        </ion-radio-group>
      </div>
    </template>
  </BaseLayout>
</template>
<script setup lang="ts">
import { IonRadioGroup, IonItem, IonLabel, IonRadio } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
</script>
<style scoped lang="scss">
.emp-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 25px;

  .radiobutton {
    font-size: 14px;
    line-height: 1.5;
    --min-height: 48px;
    --padding-top: 0;
    --border-radius: 8px;
    margin-bottom: 16px;
    --padding-bottom: 0;
    --color: var(--ion-color-medium);
    --inner-padding-top: 4px;
    --inner-padding-bottom: 4px;
    --inner-padding-start: 0;
    --inner-padding-end: 0;
    --background: var(--gray-700);
    --padding-start: var(--container-offset);
    --padding-end: var(--container-offset);

    ion-label {
      font-family: Yantramanav;
      color: #fff;
      font-weight: 300;
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
  }
}
</style>
