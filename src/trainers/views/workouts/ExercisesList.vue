<template>
  <base-layout>
    <template #header>
      <page-header @back="onBack" back-btn :title="store.workoutTitle" />
    </template>
    <template #content>
      <ion-spinner
        v-if="createWorkoutLoading || loading"
        name="lines"
        class="spinner"
      />
      <div v-else class="page-content ion-padding-horizontal">
        <template v-for="(exercise, idx) in exercises" :key="exercise.id">
          <router-link
            :to="
              !route.params.id
                ? {
                    name: EntitiesEnum.TrainerPreviewExercise,
                    params: { id: exercise.id },
                  }
                : {
                    name: EntitiesEnum.WorkoutPreview,
                    params: { id: exercise.id },
                  }
            "
          >
            <exercise-item
              :exercise="exercise"
              :sequenceNumber="Number(idx) + 1"
              class="exercise-item"
            />
          </router-link>
        </template>
      </div>
    </template>
    <template #footer>
      <div
        class="action-wrap ion-padding-horizontal"
        v-if="!route.params.id && !createWorkoutLoading"
      >
        <ion-button
          type="submit"
          expand="block"
          @click="handleSubmit"
          :disabled="createWorkoutLoading"
        >
          <template v-if="!createWorkoutLoading">Upload workout</template>
          <ion-spinner v-else name="lines" />
        </ion-button>
      </div>
      <transition>
        <ion-note v-if="errorMessage">
          {{ errorMessage }}
        </ion-note>
      </transition>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { IonButton, IonNote, IonSpinner } from "@ionic/vue";
import ExerciseItem from "@/general/components/ExerciseItem.vue";
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  CreateTrainerWorkoutDocument,
  CreateTrainerWorkoutInput,
  Workout,
  WorkoutDocument,
  WorkoutVideosInput,
} from "@/generated/graphql";
import { useWorkoutsStore } from "../../store/workouts";
import { EntitiesEnum } from "@/const/entities";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";

const router = useRouter();
const route = useRoute();
const store = useWorkoutsStore();

const { result, loading, onResult } = useQuery(
  WorkoutDocument,
  { id: route.params.id },
  () => ({
    enabled: route?.params?.id,
  })
);

onResult(({ data }) => {
  store.setWorkout(data?.workout as Workout);
});

const workoutExercises = computed(() => result.value.workout.exercises);

const exercises = computed(() =>
  route.params.id ? workoutExercises.value : store.media
);

const errorMessage = ref("");

const onBack = () => {
  if (route.params.id) {
    store.clearState();
  }
  router.go(-1);
};

const { mutate: createWorkout, loading: createWorkoutLoading } =
  useMutation<CreateTrainerWorkoutInput>(CreateTrainerWorkoutDocument);

const params = computed(() => ({
  preview: store.workoutPath,
  body_parts: store.workoutMuscleTypesIds,
  type_id: store.workoutType?.id,
  title: store.workoutTitle,
  description: store.workoutDuration,
  price: getSumForPayment(store.workoutPrice as number),
  duration: Number(store.workoutDuration),
  exercises: store.media.reduce((acc: WorkoutVideosInput[], cur) => {
    acc.push({
      id: cur.id,
      title: cur.title,
      file: cur.path,
      preview: cur.previewPath,
      description: cur.description,
    });
    return acc;
  }, []),
}));

const handleSubmit = () => {
  createWorkout(params.value)
    .then(() => {
      store.clearState();
      router.push({
        name: EntitiesEnum.TrainerWorkouts,
      });
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });
};
</script>

<style scoped lang="scss">
.action-wrap {
  padding: 20px 24px calc(20px + var(--ion-safe-area-bottom));
}
.page-content {
  margin-top: 20px;
}
ion-note {
  margin-bottom: 2px;
  font-size: 12px;
  padding: 0 16px;
  --color: var(--ion-color-danger);
}
.exercise-item {
  margin-bottom: 10px;
}
.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
</style>
