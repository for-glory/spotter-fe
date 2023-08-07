<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <radio-group
    v-else
    :value="workoutType"
    @on-change="onChange"
    :options="workoutTypes"
  />
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
</script>

<style scoped>
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50% - 60px) auto 0;
}
</style>
