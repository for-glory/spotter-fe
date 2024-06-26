<template>
  <base-auth-layout hideHeader>
    <template  #left-section>
      <div v-if="Capacitor.isNativePlatform()">
				<div class="d-flex justify-content-between align-items-center">
          <ion-icon src="assets/icon/arrow-back.svg" class="back-button" @click="goToCreateEvent"/>
				</div>
        <ion-title class="title" color="primary">
          Create your workout plan
        </ion-title>
        <workout-form 
          ref="workoutForm"
          @submit="handleSubmit"
          @onSkip="onBack"
			    @open-picker="(e) => openPicker(e)"
          skipText="Exit"
        />
        <ion-title class="title-mini" color="primary">
          Upload Exercise
        </ion-title>
        <exercise-form 
          ref="exerciseForm"
          @submit="handleSubmit"
          @onSkip="onBack"
			    @open-picker="(e) => openPicker(e)"
          skipText="Exit"
        />
        <div class="holder-button">
          <ion-button
            expand="block"
            class="secondary"
            @click="onBack"
          >
            Exit
          </ion-button>
          <ion-button
            @click="handleSubmit"
            expand="block"
            :disabled="!isValidForm"
          >
            Upload & Finish
          </ion-button>
        </div>
      </div>
      <div v-else class="content ion-padding-horizontal">
				<div class="d-flex justify-content-between align-items-center">
					<router-link
						to="/"
					>
						<ion-img
							src="assets/icon/logo-complete.png"
							class="logo"
							alt="logo"
						/>
					</router-link>
					<ion-button
						class="login-btn"
						type="button"
						fill="clear"
						@click="onLogout"
					>
						Log out
					</ion-button>
				</div>
        <div class="top-buttons">
          <ion-button class="dashboard-btn" @click="goToCreateEvent" fill="clear">
            <ion-icon src="assets/icon/arrow-back.svg" />
            Back to Create Event
          </ion-button>
          <ion-button class="dashboard-btn" @click="goToDashboard" fill="clear">
            Go to Dashboard
            <ion-icon src="assets/icon/arrow-next.svg" />
          </ion-button>
        </div>
        <ion-title class="title" color="primary">
          Create your workout plan
        </ion-title>
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
                @handle-click="openPicker('duration')"
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

        <div class="action-wrap">
          <ion-button
            @click="handleSubmit"
            type="submit"
            expand="block"
            :disabled="!isValidForm"
          >
						Next step
          </ion-button>
        </div>
      </div>
    </template>
  </base-auth-layout>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
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
import { Emitter, EventType } from "mitt";
import { clearAuthItems } from "@/router/middleware/auth";
import WorkoutForm from "@/general/components/forms/WorkoutForm.vue";
import ExerciseForm from "@/general/components/forms/ExerciseForm.vue";
import { Capacitor } from '@capacitor/core';

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

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter"); // Inject `emitter`

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};
const workoutForm = ref<typeof WorkoutForm | null>(null);
const exerciseForm = ref<typeof ExerciseForm | null>(null);

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

const handleSubmit = () => {
  if (isValidForm.value) {
    if(Capacitor.isNativePlatform()) {
      router.push({
        name: EntitiesEnum.Profile
      });
    }
    else {
      router.push({
        name: EntitiesEnum.CreateExercise,
        params: { id: uuidv4() },
      });
    }
  }
};

const onHandleSelect = (pathName: string) => {
  router.push({ name: pathName });
};

const onBack = () => {
  resetWorkout();
  router.go(-1);
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

const goToDashboard = () => {
  resetWorkout();
  router.push({ name: EntitiesEnum.DashboardOverview });
};

const goToCreateEvent = () => {
  resetWorkout();
  router.push({ name: EntitiesEnum.CreateEvent });
};

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>

<style lang="scss" scoped>
.back-button {
  width: 24px;
  height: 24px;
}
.content {
  padding: 24px 24px calc(12px + var(--ion-safe-area-bottom));
}

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
  margin-bottom: 64px;
  margin-top: 44px;
  text-align: center;
}
.title-mini {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 24px;
  margin-top: 24px;
  text-align: center;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.dashboard-btn {
  margin-top: 10px;
}
.holder-button {
  display: flex;
  gap: 16px;

  .button {
    margin: 0;
  }
}
</style>
