<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Session" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-text class="content__title">Event details</ion-text>
        <training v-if="event" :event="event" />
        <router-link :to="{ name: EntitiesEnum.ProfileScan }">
          <ion-button class="secondary" expand="block">
            Open QR-code reader
          </ion-button>
        </router-link>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton, IonText } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import Training from "@/general/components/Training";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { EventDocument, Query } from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const route = useRoute();
const { result } = useQuery<Pick<Query, "event">>(EventDocument, {
  id: route.params.id ?? 1001,
});

const event = computed(() => {
  return result.value?.event;
});
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 24px;
}

.holder-content {
  .secondary {
    margin-left: 8px;
    margin-right: 8px;
  }
}

:deep(.avatar) {
  --border-radius: 50%;
}

:deep(.avatar__image) {
  border-radius: 8px;
}
</style>
