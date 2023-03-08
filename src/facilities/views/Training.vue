<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Training" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-text class="content__title">Training details</ion-text>
        <training-detail
          v-if="training"
          :event="training"
          :type="EntitiesEnum.Training"
          @click="openProfile(training.user.id)"
        />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import TrainingDetail from "@/general/components/Training";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { Query, TrainingDocument } from "@/generated/graphql";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const route = useRoute();
const { result } = useQuery<Pick<Query, "training">>(TrainingDocument, {
  id: route.params.id ?? 1001,
});

const training = computed(() => {
  return result.value?.training;
});

const openProfile = (id: number | string) => {
  router.push({
    name: EntitiesEnum.TrainerUserProfile,
    params: { id },
  });
};
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 24px;
}
</style>
