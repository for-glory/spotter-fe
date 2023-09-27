<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Add new card" @back="onBack" />
    </template>
    <template #content>
      <div class="add-card__form">
        <card-form />
        <ion-button class="add-card__submit-btn">Add card</ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import CardForm from "@/general/components/forms/CardForm.vue";
import { IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
const router = useRouter();

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.add-card {
  &__form {
    display: flex;
    flex-direction: column;
  }
  &__submit-btn {
    margin: 0px 24px;
    font-family: Yantramanav;
  }
}
</style>
