<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Payment" />
    </template>
    <template #content>
      <card-form />
      <ion-text color="secondary">or pay with</ion-text>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import CardForm from "@/general/components/forms/CardForm.vue";
import { IonText } from "@ionic/vue";
</script>
