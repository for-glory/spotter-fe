<template>
  <div class="top-buttons">
    <ion-button class="dashboard-btn" @click="onBack" fill="clear">
      <ion-icon src="assets/icon/arrow-back.svg" />
      Back
    </ion-button>
  </div>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <div v-else>
    <ion-text class="title">Fitness Tags</ion-text>
    <checkbox-group
      class="list-content"
      @change="onChange"
      :options="bodyParts"
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
import { BodyPartsDocument, BodyPartsQuery } from "@/generated/graphql";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { IonSpinner, IonButton } from "@ionic/vue";
import { useQuery } from "@vue/apollo-composable";
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import CheckboxGroup from "@/general/components/blocks/CheckboxGroup.vue";

const router = useRouter();

const store = useWorkoutsStore();
const isConfirmedModalOpen = ref(false);
const { result, loading } = useQuery<BodyPartsQuery>(BodyPartsDocument, {
  first: 100,
  page: 1,
});

const bodyParts = computed(
  () =>
    result.value?.bodyParts?.data.map((option) => {
      return {
        id: option?.id,
        label: option?.name,
        value: option?.id,
        isChecked: store.workoutMuscleTypes?.length
          ? !!store.workoutMuscleTypesIds.find((i) => i === option?.id)
          : false,
      };
    }) || []
);

const onChange = (value: string[], option: CheckboxValueType) => {
  store.setMuscleTypes(value, option);
};
const prevWorkoutMuscleTypes = ref<any>();

onMounted(() => {
  let prev = store.workoutMuscleTypes;
  prevWorkoutMuscleTypes.value = prev;
});


const isEqual = (oldTypes: any, newTypes: any) => {
  if (oldTypes.length !== newTypes.length) {
    return false;
  }

  const sortedArr1 = oldTypes.slice().sort((a: any, b: any) => a.id - b.id);
  const sortedArr2 = newTypes.slice().sort((a: any, b: any) => a.id - b.id);

  for (let i = 0; i < sortedArr1.length; i++) {
    const obj1 = sortedArr1[i];
    const obj2 = sortedArr2[i];

    if (JSON.stringify(obj1) !== JSON.stringify(obj2)) {
      return false;
    }
  }

return true;
};

const isChanged = computed(() => isEqual(store.workoutMuscleTypes, prevWorkoutMuscleTypes.value));

const onBack = () => {
  if(store.workoutMuscleTypes?.length && !isChanged.value) {
    isConfirmedModalOpen.value = true;
  }
  else {
    router.go(-1);
  }
};
const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    store.setValue('workoutMuscleTypes', prevWorkoutMuscleTypes.value);
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
  margin: calc(50% - 60px) auto 0;
}
.list-content {
  padding: 0 24px;
  margin-top: 30px;
}
.submit-btn {
  margin-top: 24px;
  width: 60%;
}
.font-16 {
  font-size: 16px;
}
.title {
  font-size: 24px;
  font-weight: 700;
  font-family: var(Lato);
  color: #E1DBC5;
  margin-left: 24px;
}
</style>
