<template>
  <base-layout>
    <template #header>
      <page-header @back="onBack" back-btn title="Workouts" />
    </template>
    <template #content>
      <ion-spinner
        v-if="
          recommendedLoading ||
          recommendedByTypeLoading ||
          recommendedByBodyLoading ||
          loading
        "
        name="lines"
        class="spinner"
      />
      <div class="page-content ion-padding-horizontal" v-else>
        <router-link
          class="workout"
          :key="workout.id"
          v-for="workout in workouts"
          :to="{
            name: EntitiesEnum.UserWorkout,
            params: { id: workout.id },
          }"
        >
          <workout-item
            :title="workout.title || ''"
            :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
            :type="workout.type?.name || ''"
            :trainer="
              `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
              ''
            "
            :showStatus="false"
          />
        </router-link>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { IonSpinner } from "@ionic/vue";
import { useRouter, useRoute } from "vue-router";
import {
  QueryWorkoutsOrderByColumn,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  RecommendedWorkoutsDocument,
  SortOrder,
  WorkoutsDocument,
  WorkoutsQueryVariables,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import WorkoutItem from "@/users/components/Workout.vue";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();
const route = useRoute();

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);

const workoutsParams = () => {
  const params: WorkoutsQueryVariables = {
    first: 10000,
    page: 1,
    dynamic_search: "",
    order: SortOrder.Desc,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
  };

  if (route?.query?.bodyParts)
    params.has_body_parts = route?.query?.bodyParts as string[];
  if (route?.query?.workoutType)
    params.type_id = route?.query?.workoutType as string[];

  return params;
};

const { result, loading } = useQuery(
  WorkoutsDocument,
  workoutsParams(),
  () => ({
    enabled: route?.query?.type === "allWorkouts",
  })
);

const allWorkouts = computed(() => result.value?.workouts?.data);

const workouts = computed(
  () =>  allWorkouts.value
);

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.page-content {
  padding-top: 24px;
  padding-bottom: 16px;
}

.workout {
  display: block;

  &:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
