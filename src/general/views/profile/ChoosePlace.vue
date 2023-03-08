<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <ion-buttons>
        <ion-back-button
          class="back-btn"
          icon="assets/icon/arrow-back.svg"
          @click="handleBack"
        >
        </ion-back-button>
      </ion-buttons>
      <search-form :type="EntitiesEnum.Facilities" hide-results />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-radio-group>
          <choice-location />
          <choice-location />
          <choice-location />
          <choice-location />
          <choice-location />
        </ion-radio-group>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonBackButton, IonButtons, IonRadioGroup } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import ChoiceLocation from "@/general/components/ChoiceLocation.vue";

const router = useRouter();

const handleBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
:deep(.header) {
  display: flex;
  margin-bottom: 23px;
}

.search-form {
  position: static;
  flex: 1 1 auto;
  height: 80px;
  padding-left: 10px;
  background: var(--ion-background-color);
}

.back-btn {
  display: inline-block;
  height: 32px;
  min-width: 32px;
  margin-left: 15px;
  margin-top: calc(15px + var(--ion-safe-area-top));
  border-radius: 50%;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --color: var(--ion-color-white);
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.holder-content {
  padding-bottom: 80px;
}
</style>
