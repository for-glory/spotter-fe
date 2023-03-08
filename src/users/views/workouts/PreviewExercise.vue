<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <detail
    hiddenFooter
    hiddenReviews
    class="exercise-preview"
    :name="
      exercise?.title ? `${exercise.exerciseIndex + 1}. ${exercise?.title}` : ''
    "
    :video-url="exercise?.pathUrl"
    advantagesTitle=""
    :photoUrl="exercise?.previewUrl"
  >
    <template #info>
      <div class="ion-padding-horizontal">
        <info
          :price="workoutType || ''"
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
import { IonText, IonSpinner } from "@ionic/vue";
import Info from "@/general/components/blocks/Info.vue";
import { useRoute } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { WorkoutDocument } from "@/generated/graphql";
import { computed } from "vue";
import { ExerciseType } from "@/ts/types/store";
import { useQuery } from "@vue/apollo-composable";

const route = useRoute();

const { result, loading } = useQuery(WorkoutDocument, {
  id: route.params.id,
});

const exercise = computed(() =>
  result.value?.workout?.exercises.reduce(
    (acc, cur: ExerciseType, idx: number) => {
      if (cur.id === route.query.exercise) {
        acc = {
          ...cur,
          exerciseIndex: idx,
        };
      }
      return acc;
    },
    {}
  )
);

const workoutType = computed(() => result.value?.workout?.type?.name);
const workoutDuration = computed(
  () => `${result.value?.workout?.duration} min`
);
const trainer = computed<string>(
  () =>
    `${result.value?.workout?.trainer?.first_name} ${result.value?.workout?.trainer?.last_name}`
);
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

.spinner {
  position: fixed;
  top: 3vh;
  left: 22vw;
  --color: var(--ion-color-white);
}
</style>
