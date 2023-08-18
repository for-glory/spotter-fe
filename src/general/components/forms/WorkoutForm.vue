<template>
  <div>
    <div class="form-row">
      <ion-label class="label"> Choose cover for workout </ion-label>
      <photo-loader
        :photo="store.workoutPreview"
        @change="photoSelected"
        :loading="filePreloadLoading"
        :progress="percentLoaded"
      />
    </div>

    <div class="form-row">
      <base-input
        v-model:value="titleValue"
        :error-message="titleError"
        placeholder="Enter title"
        name="workoutTitle"
        label="Title of workout"
        required
      />
    </div>

    <div class="form-row">
      <ion-label class="label"> Choose intensity level </ion-label>
      <choose-block
        title="Workout type"
        :value="workoutType"
        @handle-click="onHandleSelect(EntitiesEnum.WorkoutTypes)"
      />
    </div>

    <div class="form-row">
      <ion-label class="label"> Choose muscle group </ion-label>
      <choose-block
        title="Select muscle group"
        :value="muscleTypesValue"
        @handle-click="onHandleSelect(EntitiesEnum.MuscleTypes)"
      />
    </div>

    <div class="form-row">
      <ion-label class="label">
        Choose the duration for the whole workout
      </ion-label>
      <wheel-picker
        :options="durationOptions"
        name="duration"
        :values="[duration, 'min']"
      >
        <template #button>
          <choose-block
            title="Duration"
            :value="duration ? `${duration} min` : ''"
            @handle-click="() => $emit('openPicker', 'duration')"
          />
        </template>
      </wheel-picker>
    </div>

    <div class="form-row">
      <base-input
        v-model:value="priceValue"
        :error-message="priceError"
        placeholder="Enter price"
        type="number"
        name="price"
        label="Set the price for workout (USD $)"
        required
      />
    </div>

    <div class="holder-button">
      <ion-button
        expand="block"
        class="secondary"
        v-if="hasSkipButton"
        @click="() => $emit('onSkip')"
      >
        {{ skipText }}
      </ion-button>
      <ion-button
        @click="() => $emit('submit')"
        type="submit"
        expand="block"
        :disabled="!isValidForm"
      >
        {{submitButtonText}}
      </ion-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, ref, inject, defineProps, defineEmits, withDefaults } from "vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
import {
	IonTitle,
  IonButton,
  IonLabel,
  PickerColumnOption,
  PickerOptions,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { useWorkoutsStore } from "../../../trainers/store/workouts";
import { requiredFieldSchema } from "@/validations/authValidations";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { v4 as uuidv4 } from "uuid";
import { FilePreloadDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { clearAuthItems } from "@/router/middleware/auth";

const percentLoaded = ref(0);

const router = useRouter();

const store = useWorkoutsStore();

const { value: titleValue, errorMessage: titleError } = useField<string>(
  "workoutTitle",
  requiredFieldSchema
);

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

const props = withDefaults(
  defineProps<{
    edit?: boolean;
    loading?: boolean;
    submitButtonText?: string;
    skipText?: string;
    hasSkipButton?: boolean;
  }>(),
  {
    submitButtonText: "Upload & Finish",
  }
);

const emits = defineEmits<{
  (e: "submit"): void;
  (e: "onSkip"): void;
  (e: "openPicker", name?: string): void;
}>();

onMounted(() => {
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

const onHandleSelect = (pathName: string) => {
  router.push({ name: pathName });
};

const photoSelected = (value: string) => {
  if (!value?.length) {
    removePhoto();
    return;
  }
  const file = dataURItoFile(value, uuidv4());

  filePreload({ file })
    .then((res) => {
      store.setValue(
        "workoutPreview",
        `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`
      );
      store.setValue("workoutPath", res?.data.filePreload.path);
    })
    .catch((error) => {
      abort();
      console.error(error);
    });
};

const removePhoto = () => {
  store.setValue("workoutPreview", "");
  store.setValue("workoutPath", "");
};

const resetWorkout = () => {
  store.clearState();
};

const options = minutesDuration(10, 240, 10);
const durationOptions: PickerOptions = {
  columns: [
    {
      name: "duration",
      options,
    },
    {
      name: "minutes",
      options: [
        {
          text: "MIN",
          value: "min",
        },
      ],
    },
  ],
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Choose duration",
      handler: (value: PickerColumnOption) => {
        store.setValue("workoutDuration", value?.duration?.value);
      },
    },
  ],
};
</script>

<style lang="scss">
.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.holder-button {
  display: flex;
  gap: 16px;

  .button {
    margin: 0;
  }
}

.search-form {
  position: relative;
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;
  justify-content: flex-end;
  transition: background-color 0.35s ease;

  &--on-focus {
    background-color: var(--gray-800);
  }

  &__control {
    border: 1px solid;
    margin-top: 10px;
    padding: 0;
    width: 100%;
    z-index: 15;
    transition: right 0.35s ease;
    padding: 15px 20px 12px 20px;
    background: var(--gray-800);
    border-radius: var(--border-radius);
    --border-radius: 8px;
    --color: var(--ion-color-white);
    --placeholder-opacity: 1;
    --background: var(--gray-700);
    --placeholder-font-weight: 300;
    --placeholder-color: var(--gray-500);
    --box-shadow: inset 0 0 0 0.8px var(--gray-600);
  }
}
.address-container {
  display: flex;
  min-height: 48px;
  flex-direction: row;
  border-radius: 8px;
  align-items: center;
  padding: 8px 16px 8px;
  background: var(--gray-700);
  justify-content: space-between;
}
.address-content {
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
}
</style>
