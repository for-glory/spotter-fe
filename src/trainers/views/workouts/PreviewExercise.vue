<template>
  <detail
    edit-button
    hiddenReviews
    class="exercise-preview"
    :name="exercise?.title ? `${exerciseIndex + 1}. ${exercise?.title}` : ''"
    :video-url="exercise?.videoPath"
    advantagesTitle=""
    :photoUrl="exercise?.previewUrl"
    @handle-edit="editExercise"
  >
    <template #info>
      <div class="ion-padding-horizontal">
        <info
          :price="workoutType?.name || ''"
          priceLabel="Level"
          :members="trainer"
          membersLabel="Trainer"
          :start-date="workoutDuration"
          startDateLabel="Duration"
        />
      </div>
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-text>
          {{ exercise?.description }}
        </ion-text>
      </div>
    </template>
  </detail>
</template>

<script setup lang="ts">
import { IonText } from "@ionic/vue";
import Info from "@/general/components/blocks/Info.vue";
import { useRoute, useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useWorkoutsStore } from "../../store/workouts";
import { EntitiesEnum } from "@/const/entities";

const route = useRoute();
const router = useRouter();
const store = useWorkoutsStore();

const exercise = store.exercises[route.params.id.toString()];
const exerciseIndex = Object.keys(store.exercises)?.findIndex(
  (exercise: string) => exercise === route.params.id.toString()
);

const workoutType = store.workoutType;
const workoutDuration = `${store.workoutDuration} min`;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const trainer = `${user.first_name} ${user.last_name}`;

const editExercise = () => {
  router.push({
    name: EntitiesEnum.TrainerCreateExercise,
    params: {
      id: exercise?.id,
    },
    query: {
      edit: "true",
    },
  });
};
</script>

<style scoped lang="scss">
.info {
  font-weight: 300;
  font-size: 14px;
  margin: 24px 0;
  color: var(--ion-color-secondary);
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}

.exercise-preview {
  --video-offset-botton: 12px;
}
</style>
