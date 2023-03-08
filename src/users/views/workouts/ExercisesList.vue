<template>
  <base-layout :header-fixed="false">
    <template #header>
      <page-header @back="onBack" back-btn :title="workout?.title" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <div v-else class="page-content">
        <router-link
          class="exercise-item"
          v-for="(exercise, idx) in workout?.exercises"
          :key="exercise?.id"
          :to="{
            name: EntitiesEnum.UserPreviewExercise,
            params: { id: route.params.id },
            query: { exercise: exercise.id },
          }"
        >
          <exercise-item :exercise="exercise" :sequenceNumber="Number(idx) + 1"
        /></router-link>
      </div>
    </template>
    <template #footer>
      <transition>
        <ion-note v-if="error">
          {{ error }}
        </ion-note>
      </transition>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IonNote, IonSpinner } from "@ionic/vue";
import ExerciseItem from "@/general/components/ExerciseItem.vue";
import { useQuery } from "@vue/apollo-composable";
import { useRouter, useRoute, onBeforeRouteLeave } from "vue-router";
import { WorkoutDocument } from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";

const route = useRoute();
const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const { result, loading, error } = useQuery(WorkoutDocument, {
  id: route.params.id,
});

onBeforeRouteLeave((to, from, next) => {
  to.name === EntitiesEnum.PaymentsMethods
    ? next({ name: EntitiesEnum.UserPurchasedWorkouts })
    : next();
});

const workout = computed(() => result.value?.workout);
</script>

<style scoped lang="scss">
.page-content {
  padding: 24px 16px calc(16px + var(--ion-safe-area-bottom));
}

ion-note {
  margin-bottom: 2px;
  font-size: 12px;
  padding: 0 16px;
  --color: var(--ion-color-danger);
}
.exercise-item {
  margin-bottom: 16px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
