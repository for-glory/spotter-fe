<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Drop-ins" @back="$router.go(-1)">
        <template #custom-btn>
          <ion-button @click="handleCreate" class="header-btn">
            <ion-icon src="assets/icon/chat.svg" />
            <span class="header-btn__badge"></span>
          </ion-button>
          <ion-button @click="openQR" class="header-btn">
            <ion-icon src="assets/icon/scan.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <div class="main-content">
        <div
          class="empty-pass d-flex-col align-items-center justify-content-center gap-25"
        >
          <EmptyBlock
            hide-button
            icon="assets/icon/drop-ins.svg"
            buttonText="View Drop-ins"
            title="Drop-ins Empty"
            text="No drop-ins created yet"
          />
          <ion-button @click="handleCreate">Create Drop-ins</ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton, IonIcon } from "@ionic/vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { EntitiesEnum } from "@/const/entities";
import router from "@/router";

const handleCreate = () => {
  router.push({ name: EntitiesEnum.CreateItem, params: { type: "drop-ins" } });
};

const openQR = () => {
  router.push({ name: EntitiesEnum.ProfileScan });
};
</script>
<style lang="scss" scoped>
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;

  .empty-pass {
    width: 100%;
    height: 100%;

    ion-button {
      width: 100%;
      color: var(--dark-gray);
      font-family: Lato;
      font-size: 16px;
      font-weight: 500;
      min-height: 48px;
      margin: 20px 0;
    }
  }
}
</style>
