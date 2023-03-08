<template>
  <base-layout>
    <template #header>
      <page-header @back="onBack" back-btn title="Workouts" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <template v-else-if="workouts.length && !loading">
        <div v-for="workout in workouts" :key="workout.id" class="page-content">
          <workout-item
            hide
            share
            :id="workout.id"
            @click="openWorkout(workout.id)"
            :duration="workout.duration"
            :title="workout.title || ''"
            :pathUrl="`${VUE_APP_CDN}${workout.preview}` || ''"
            :type="workout.type?.name || ''"
            :trainer="
              `${workout.trainer?.first_name} ${workout.trainer?.last_name}` ||
              ''
            "
            :hidden="workout.state === WorkoutStatesEnum.Hidden"
            @hide="hideWorkoutHandle(workout.id)"
            @show="showWorkoutHandle(workout.id)"
            :disabled="workoutHideLoading || workoutShowLoading"
            :is-show-button-visible="
              (subscriptionType === SubscriptionsTierEnum.Silver &&
                activeWorkoutsLength < 10) ||
              (subscriptionType === SubscriptionsTierEnum.Gold &&
                activeWorkoutsLength < 15)
            "
          />
        </div>
      </template>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { IonSpinner } from "@ionic/vue";
import { useRouter } from "vue-router";
import {
  HideWorkoutDocument,
  QueryWorkoutsOrderByColumn,
  ShowWorkoutDocument,
  SortOrder,
  WorkoutsDocument,
  WorkoutStatesEnum,
  SubscriptionsTierEnum,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import WorkoutItem from "@/users/components/Workout.vue";
import { EntitiesEnum } from "@/const/entities";
import useSubscription from "@/hooks/useSubscription";

const router = useRouter();
const { type: subscriptionType } = useSubscription();
const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const { result, loading, refetch } = useQuery(WorkoutsDocument, {
  trainer_id: id,
  page: 1,
  first: 1000,
  dynamic_search: "",
  orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
  order: SortOrder.Desc,
});

const workouts = computed(() => result.value?.workouts?.data || []);

const onBack = () => {
  router.go(-1);
};

const hideWorkoutHandle = (id: string) => {
  hideWorkout({ id }).then(() => {
    refetch();
  });
};

const { mutate: hideWorkout, loading: workoutHideLoading } =
  useMutation(HideWorkoutDocument);

const showWorkoutHandle = (id: string) => {
  showWorkout({ id }).then(() => {
    refetch();
  });
};

const { mutate: showWorkout, loading: workoutShowLoading } =
  useMutation(ShowWorkoutDocument);

const openWorkout = (id: string) => {
  if (workoutHideLoading.value || workoutShowLoading.value) return;
  router.push({
    name: EntitiesEnum.TrainerExerciseList,
    params: { id },
  });
};

const activeWorkoutsLength = computed<number>(
  () =>
    workouts.value?.filter(
      (workout: any) => workout.state === WorkoutStatesEnum.Active
    ).length ?? 0
);
</script>

<style scoped lang="scss">
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.page-content {
  padding: 12px 24px;
}

.workout {
  display: block;

  &:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
