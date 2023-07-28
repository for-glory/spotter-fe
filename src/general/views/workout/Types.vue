<template>
  <base-auth-layout hideHeader>
    <template  #left-section>
      <div class="ion-padding-horizontal content">
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
        <radio-group
          v-else
          :value="workoutType"
          @on-change="onChange"
          :options="workoutTypes"
        />
      </div>
    </template>
  </base-auth-layout>
</template>

<script setup lang="ts">
import {
  WorkoutType,
  WorkoutTypesDocument,
  WorkoutTypesQuery,
} from "@/generated/graphql";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { IonSpinner } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter } from "vue-router";
import RadioGroup from "@/general/components/blocks/RadioGroup.vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";

const router = useRouter();

const store = useWorkoutsStore();
const { workoutType } = store;

const { result, loading } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument, {
  first: 100,
  page: 1,
});

const workoutTypes = computed(() => result.value?.workoutTypes?.data);

const onChange = (value: WorkoutType) => {
  store.setValue("workoutType", value);
  router.go(-1);
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
  padding-top: 24px;
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));
}
.logo {
  width: 220px;
  min-width: 60px;
}
</style>
