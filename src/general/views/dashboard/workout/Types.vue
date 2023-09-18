<template>
  <div class="top-buttons">
    <ion-button class="dashboard-btn" @click="onBack" fill="clear">
      <ion-icon src="assets/icon/arrow-back.svg" />
      Back
    </ion-button>
  </div>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <div v-else>
    <radio-group
      :value="workoutType"
      @on-change="onChange"
      :options="workoutTypes"
    />
    <div class="d-flex align-items-center justify-content-center w-100">
      <ion-button
        :disabled="isChanged"
        expand="block"
        class="submit-btn"
        @click="submit"
      >
        Save
      </ion-button>
    </div>
  </div>
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
    title="Do you want to discard changes?"
    text="Changes will not be saved"
    cancelButton="Cancel"
    button="Discard changes"
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
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import RadioGroup from "@/general/components/blocks/RadioGroup.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

const router = useRouter();

const store = useWorkoutsStore();
const { workoutType } = store;
const isConfirmedModalOpen = ref(false);
const { result, loading } = useQuery<WorkoutTypesQuery>(WorkoutTypesDocument, {
  first: 100,
  page: 1,
});

const workoutTypes = computed(() => result.value?.workoutTypes?.data);
const prevWorkoutType = ref<any>();
onMounted(() => {
  let prev = store.workoutType?.name;
  prevWorkoutType.value = prev;
});

const onChange = (value: WorkoutType) => {
  store.setValue("workoutType", value);
};

const isChanged = computed(() => store.workoutType?.name === prevWorkoutType.value);

const onBack = () => {
  if(store.workoutType?.name && !isChanged.value) {
    isConfirmedModalOpen.value = true;
  }
  else {
    router.go(-1);
  }
};
const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    store.setValue("workoutType", prevWorkoutType.value);
    router.go(-1);
  }
};
const submit = () => {
  router.go(-1);
}
</script>

<style scoped>
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30% - 60px) auto 0;
}
.submit-btn {
  margin-top: 24px;
  width: 60%;
}
</style>
