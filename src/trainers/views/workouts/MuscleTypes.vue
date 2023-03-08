<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header @back="onBack" back-btn title="Muscle Group" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <checkbox-group
        class="content"
        v-else
        @change="onChange"
        :options="bodyParts"
      />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { BodyPartsDocument, BodyPartsQuery } from "@/generated/graphql";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { IonSpinner } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter } from "vue-router";
import CheckboxGroup from "@/general/components/blocks/CheckboxGroup.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { CheckboxValueType } from "@/ts/types/checkbox-value";

const router = useRouter();

const store = useWorkoutsStore();

const { result, loading } = useQuery<BodyPartsQuery>(BodyPartsDocument, {
  first: 100,
  page: 1,
});

const bodyParts = computed(
  () =>
    result.value?.bodyParts?.data.map((option) => {
      return {
        id: option?.id,
        label: option?.name,
        value: option?.id,
        isChecked: store.workoutMuscleTypes?.length
          ? !!store.workoutMuscleTypesIds.find((i) => i === option?.id)
          : false,
      };
    }) || []
);

const onChange = (value: string[], option: CheckboxValueType) => {
  store.setMuscleTypes(value, option);
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped>
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50% - 60px) auto 0;
}
.content {
  padding: 0 24px;
  margin-top: 30px;
}
</style>
