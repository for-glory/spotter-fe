<template>
  <base-auth-layout v-if="!Capacitor.isNativePlatform()" hideHeader>
    <template  #left-section>
      <div class="exercise-form-content">
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
          <ion-button class="dashboard-btn" @click="onBack" fill="clear">
            <ion-icon src="assets/icon/arrow-back.svg" />
            Back
          </ion-button>
        </div>
        <ion-title class="title" color="primary">
          Upload exercise
        </ion-title>
        <div class="form-row">
          <ion-label class="label"> Choose exercise cover </ion-label>
          <photo-loader
            :photo="previewUrl"
            @change="photoSelected"
            :progress="percentLoaded"
            :loading="previewOnLoading"
          />
        </div>

        <div class="form-row">
          <ion-label class="label">
            Choose video for
            <template v-if="exerciseIndex === 0">first</template>
            exercise
          </ion-label>
          <upload-video
            :video="videoPath"
            @delete="removeVideo"
            @change="videoSelected"
            :loading="videoOnLoading"
            :video-size="videoInfo.size"
            :video-name="videoInfo.name"
            button-text="Upload exercise"
            :loadingPercent="percentLoaded"
          />
        </div>

        <div class="form-row">
          <base-input
            v-model:value="exerciseTitle"
            :error-message="titleError"
            placeholder="Enter title"
            name="exerciseTitle"
            label="Create short title for video"
            required
          />
        </div>

        <div class="form-row">
          <base-input
            auto-grow
            v-model:value="exerciseDescription"
            :error-message="titleError"
            placeholder="Enter instruction tips"
            name="exerciseTitle"
            label="Create instruction tip for video"
            :rows="3"
          />
        </div>

        <div class="exercise-action-wrap">
          <ion-button
            @click="handleAddNextExercise"
            type="submit"
            expand="block"
            v-if="!isEditing"
            :disabled="!isValidForm"
          >
            Add next exercise
          </ion-button>
          <ion-button
            @click="handleFinishWorkout"
            type="submit"
            expand="block"
            class="secondary"
            :disabled="!isValidForm||createWorkoutLoading"
          >
            {{ isEditing ? "Save exercise" : "Finish workout" }}
          </ion-button>
        </div>
        <transition>
          <ion-note v-if="errorMessage">
            {{ errorMessage }}
          </ion-note>
        </transition>
      </div>
    </template>
  </base-auth-layout>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Create workout plan" />
    </template>
    <template #content>
      <div class="content">
        <exercise-form 
          ref="exerciseForm"
          :workoutId="workoutId"
          hasSubmitButton
          submitButtonText="Add next exercise"
          hadFinishButton
          @open-picker="(e) => openPicker(e)"
        />
      </div>
    </template>
  </base-layout>
  <discard-changes :is-open="isConfirmationOpen" @close="discardModalClosed" />
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from "vue";
import { IonLabel, IonButton, IonIcon, IonTitle, IonNote } from "@ionic/vue";
import { useField } from "vee-validate";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useWorkoutsStore } from "../../../trainers/store/workouts";
import { EntitiesEnum } from "@/const/entities";
import UploadVideo from "@/general/components/UploadVideo.vue";
import { dataURItoFile } from "@/utils/fileUtils";
import {
  FilePreloadDocument,
  CreateGymWorkoutDocument,
  CreateGymWorkoutInput,
  WorkoutVideosInput,
} from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
import { clearAuthItems } from "@/router/middleware/auth";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import { Capacitor } from '@capacitor/core';
import { Emitter, EventType } from "mitt";
import ExerciseForm from "@/general/components/forms/ExerciseForm.vue";

const router = useRouter();
const route = useRoute();
const store = useWorkoutsStore();
const errorMessage = ref("");

const exerciseDescription = ref<string>("");
const isConfirmationOpen = ref<boolean>(false);
const exerciseIndex = ref<number>(0);

const previewUrl = ref<string>("");
const previewPath = ref<string>("");
const previewOnLoading = ref<boolean>(false);
const videoOnLoading = ref<boolean>(false);
const path = ref<string>("");
const videoPath = ref<string>("");
const percentLoaded = ref<number | undefined>();
const videoInfo = ref<{ name: string; size: string }>({ name: "", size: "" });

const exerciseForm = ref<typeof ExerciseForm | null>(null);

watch(
  () => route.params.id,
  (newVal) => {
    checkExercise(newVal.toString());
  }
);

const { value: exerciseTitle, errorMessage: titleError } =
  useField<string>("exerciseTitle");

const pushValueToStore = async () => {
  store.setExercise({
    title: exerciseTitle.value,
    description: exerciseDescription.value,
    videoPath: videoPath.value,
    previewUrl: previewUrl.value,
    previewPath: previewPath.value,
    path: path.value,
    id: route.params.id as string,
    videoSize: videoInfo.value.size,
    videoName: videoInfo.value.name,
  });
};

const handleAddNextExercise = () => {
  pushValueToStore();
  exerciseTitle.value = "";
  videoPath.value = "";
  exerciseDescription.value = "";
  previewUrl.value = "";
  exerciseIndex.value++;
  router.push({
    name: EntitiesEnum.CreateExercise,
    params: { id: uuidv4() },
  });
};

const isValidForm = computed(
  () => exerciseTitle.value && previewUrl.value && videoPath.value
);

const photoSelected = async (value: string): Promise<void> => {
  if (!value?.length) {
    removePhoto();
    return;
  }
  const file = dataURItoFile(value, uuidv4());
  previewOnLoading.value = true;
  percentLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      previewPath.value = res?.data.filePreload.path;
      previewUrl.value = `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`;
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
    })
    .catch((error) => {
      console.error(error);
      abort();
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
    });
};

const videoSelected = async (
  file: File,
  size: string,
  name: string
): Promise<void> => {
  videoOnLoading.value = true;
  percentLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      path.value = res?.data.filePreload.path;
      videoPath.value = `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`;
      videoOnLoading.value = false;
      percentLoaded.value = undefined;
      videoInfo.value.size = size;
      videoInfo.value.name = name;
    })
    .catch((error) => {
      abort();
      console.error(error);
      path.value = "";
      videoPath.value = "";
      videoOnLoading.value = false;
      percentLoaded.value = undefined;
      videoInfo.value.size = "";
      videoInfo.value.name = "";
    });
};

let abort: any;

const { mutate: filePreload } = useMutation(FilePreloadDocument, {
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
});

const removePhoto = () => {
  previewUrl.value = "";
};

const removeVideo = () => {
  videoPath.value = "";
};

const handleFinishWorkout = () => {
  !isEditing.value ? pushValueToStore() : updateExercise();
  store.setMedia();
  if (isValidForm.value) {
    if (!isEditing.value) {
      createWorkout(params.value)
        .then(() => {
          store.clearState();
          router.push({
            name: EntitiesEnum.DashboardOverview,
          });
        })
        .catch((err) => {
          errorMessage.value = err;
          throw new Error(err);
        });
    } else {
      router.go(-1);
    }
  }
};

const { mutate: createWorkout, loading: createWorkoutLoading } =
  useMutation<CreateGymWorkoutInput>(CreateGymWorkoutDocument);

const params = computed(() => ({
  preview: store.workoutPath,
  body_parts: store.workoutMuscleTypesIds,
  facility_id: localStorage.getItem("first_facility"),
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

const discardModalClosed = (approved: boolean) => {
  isConfirmationOpen.value = false;
  if (approved) {
    if (store.exercises[route.params.id.toString()]) {
      store.removeExercise(route.params.id.toString());
    }
    router.go(-1);
  }
};

const onBack = () => {
  if (
    !isEditing.value &&
    (videoPath.value || exerciseTitle.value || exerciseDescription.value)
  ) {
    isConfirmationOpen.value = true;
  } else {
    router.go(-1);
  }
};

const checkExercise = (id: string) => {
  const exercise = store.exercises[id];
  if (exercise) {
    exerciseTitle.value = exercise.title;
    videoPath.value = exercise.videoPath;
    previewUrl.value = exercise.previewUrl;
    previewPath.value = exercise.previewPath;
    exerciseDescription.value = exercise.description || "";
    videoInfo.value = {
      size: exercise?.videoSize || "",
      name: exercise?.videoName || "",
    };
  }
};

const id = route.params.id;
if (id) {
  checkExercise(id.toString());
}

const exerciseId = ref<string | null>(
  route.params.id ? String(route.params.id) : null
);
const isEditing = ref<boolean>(Boolean(route.query["edit"]));

if (isEditing.value && exerciseId.value) {
  const exercise = store.exercises[exerciseId.value];

  exerciseTitle.value = exercise.title;
  exerciseDescription.value = exercise.description || "";
  videoPath.value = exercise.videoPath;
  previewUrl.value = exercise.previewUrl;
  previewPath.value = exercise.previewPath;
  path.value = exercise.path;
  videoInfo.value = {
    size: exercise.videoSize,
    name: exercise.videoName,
  };
}

const updateExercise = () => {
  store.editExercise(exerciseId.value as string, {
    title: exerciseTitle.value,
    description: exerciseDescription.value,
    videoPath: videoPath.value,
    previewUrl: previewUrl.value,
    previewPath: previewPath.value,
    path: path.value,
    id: route.params.id as string,
    videoSize: videoInfo.value.size,
    videoName: videoInfo.value.name,
  });
};

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter"); // Inject `emitter`

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>

<style lang="scss" scoped>
.exercise-form-content {
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
}

.exercise-action-wrap {
  margin-top: 32px;

  .button {
    margin: 0;

    &:not(:first-child) {
      margin-top: 16px;
    }

    &.secondary {
      --border-width: 0.8px;
    }
  }
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
.logo {
  width: 220px;
  min-width: 60px;
}

.content {
  padding: 0 40px 26px;
}
</style>
