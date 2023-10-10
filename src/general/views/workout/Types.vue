<template>
  <base-layout hideNavigationMenu>
    <template #header>
      <page-header back-btn @back="onBack" title="Workout type" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <div v-else class="content">
        <radio-group :value="workoutType" @on-change="onChange" :options="workoutTypes" />
        <ion-button expand="block" @click="submit">
          Save
        </ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  WorkoutType,
  WorkoutTypesDocument,
  WorkoutTypesQuery,
} from "@/generated/graphql";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { IonSpinner, IonButton } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter } from "vue-router";
import RadioGroup from "@/general/components/blocks/RadioGroup.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { clearAuthItems } from "@/router/middleware/auth";
import { EntitiesEnum } from "@/const/entities";
import { useDailysStore } from "@/general/stores/useDailysStore";

const router = useRouter();

const store = useDailysStore();
const { workoutType } = store;

const { result, loading } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument, {
  first: 100,
  page: 1,
});

const workoutTypes = computed(() => result.value?.workoutTypes?.data);

const onChange = (value: WorkoutType) => {
  store.setValue("workoutType", value);
};
const submit = () => {
  router.go(-1);
};
const onBack = () => {
  router.go(-1);
};
const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>

<style scoped lang="scss">
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50% - 60px) auto 0;
}

.content {
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;

  ion-button {
    width: 100%;
    margin-top: 16px;
  }
}
</style>
