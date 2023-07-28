<template>
  <base-auth-layout hideHeader>
    <template  #left-section>
      <router-link
        to="/"
      >
        <ion-img
          src="assets/icon/logo-complete.png"
          class="logo"
          alt="logo"
        />
      </router-link>
      <div class="top-buttons">
        <ion-button class="dashboard-btn" @click="onBack" fill="clear">
          <ion-icon src="assets/icon/arrow-back.svg" />
          Back
        </ion-button>
      </div>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <checkbox-group
        class="content"
        v-else
        @change="onChange"
        :options="bodyParts"
      />
    </template>
  </base-auth-layout>
</template>

<script setup lang="ts">
import { BodyPartsDocument, BodyPartsQuery } from "@/generated/graphql";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { IonSpinner } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter } from "vue-router";
import CheckboxGroup from "@/general/components/blocks/CheckboxGroup.vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
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
.logo {
  width: 220px;
  min-width: 60px;
}
</style>
