<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Create workout plan" />
    </template>
    <template #content>
      <div class="content">
        <workout-form 
          ref="workoutForm"
          exit-button-text="Finish"
          @submit="createDailys"
        />
      </div>
    </template>
  </base-layout>
  <discard-changes :is-open="isConfirmationOpen" @close="discardModalClosed" />
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
import {
	IonTitle,
  IonButton,
  IonLabel,
  PickerColumnOption,
  PickerOptions,
	IonGrid,
	IonRow,
	IonCol
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { requiredFieldSchema } from "@/validations/authValidations";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { v4 as uuidv4 } from "uuid";
import { FilePreloadDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { Emitter, EventType } from "mitt";
import WorkoutForm from "@/general/components/forms/WorkoutForm.vue";
import ExerciseForm from "@/general/components/forms/ExerciseForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useDailysStore } from "@/general/stores/create-dailys";

const percentLoaded = ref(0);

const router = useRouter();

const store = useDailysStore();
const isConfirmationOpen = ref<boolean>(false);

const { value: titleValue, errorMessage: titleError } = useField<string>(
  "workoutTitle",
  requiredFieldSchema
);

const workoutForm = ref<typeof WorkoutForm | null>(null);
const exerciseForm = ref<typeof ExerciseForm | null>(null);

let abort: any;

const { mutate: filePreload, loading: filePreloadLoading } = useMutation(
  FilePreloadDocument,
  {
    context: {
      fetchOptions: {
        useUpload: true,
        onProgress: (ev: ProgressEvent) => {
          percentLoaded.value = (ev.loaded / ev.total) * 100;
        },
        onAbortPossible: (abortHandler: any) => {
          abort = abortHandler;
        },
      },
    },
  }
);

const duration = computed(() =>
  store.workoutDuration ? store.workoutDuration : ""
);

const { value: priceValue, errorMessage: priceError } = useField<string>(
  "workoutPrice",
  requiredFieldSchema
);

const workoutType = computed(() => store.workoutType?.name || "");

const muscleTypesValue = computed(() =>
  store.workoutMuscleTypes?.length > 1
    ? store.workoutMuscleTypes?.length
    : store.workoutMuscleTypes[0]?.label || ""
);

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter"); // Inject `emitter`

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

onMounted(() => {
  router.push({
    name: router?.currentRoute?.value?.name,
    params: { id: uuidv4() },
  });
  if (store.workoutTitle) {
    titleValue.value = store.workoutTitle;
  }
  if (store.workoutPrice) {
    priceValue.value = store.workoutPrice.toString();
  }
});

watch(
  () => priceValue.value,
  (newVal: string) => {
    store.setValue("workoutPrice", newVal);
  }
);
watch(
  () => titleValue.value,
  (newVal: string) => {
    store.setValue("workoutTitle", newVal);
  }
);

const isValidForm = computed(
  () =>
    !titleError.value &&
    titleValue.value &&
    !priceError.value &&
    priceValue.value &&
    store.workoutMuscleTypesIds?.length &&
    store.workoutDuration &&
    store.workoutPreview &&
    store.workoutType
);

const createDailys = () => {
  console.log("create dailys");
};

const onHandleSelect = (pathName: string) => {
  router.push({ name: pathName });
};

const resetWorkout = () => {
  store.clearState();
};

const discardModalClosed = (approved: boolean) => {
  isConfirmationOpen.value = false;
  if (approved) {
    store.clearState();
    router.go(-1);
  }
};

const onBack = () => {
  if (store.workoutTitle ||
    store.workoutPrice ||
    store.workoutMuscleTypesIds?.length ||
    store.workoutType
  ) {
    isConfirmationOpen.value = true;
  } else {
    store.clearState();
    router.go(-1);
  }
};
</script>

<style lang="scss" scoped>

.action-wrap {
  margin-top: 20px;
}
.logo {
  width: 220px;
  min-width: 60px;
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: center;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.dashboard-btn {
  margin-top: 10px;
}
.content {
  padding: 0 40px 26px;
}
.sub-title {
  margin: 0;
  padding: 0 0 16px;
}

.holder-button {
  ion-button {
    width: 100%;
  }
}
</style>
