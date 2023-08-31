<template>
  <base-layout hideNavigationMenu>
    <template #header>
      <page-header back-btn @back="onBack" :title="step === 'upload' ? 'Create your Dailys' : 'Post Dailys'" />
    </template>
    <template #content>
      <div v-if="step === 'upload'" class="content d-flex align-items-center justify-content-center">
        <ion-button
        @click="uploadVideo"
          expand="block"
        >
          Create first Dailys
        </ion-button>
      </div>
      <div v-else class="content">
        <div class="form-row" id="video">
          <video :src="videoPath" controls autoplay muted style="max-width: 100%; width: 100%;"></video>
        </div>
        <div class="form-row">
          <base-input
            v-model:value="titleValue"
            :error-message="titleError"
            placeholder=""
            name="workoutTitle"
            label="Choose a name for daily"
            required
          />
        </div>

        <div class="form-row">
          <base-input
            v-model:value="priceValue"
            :error-message="priceError"
            placeholder="Enter price"
            type="number"
            name="price"
            label="Set price (USD $)"
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
          <ion-label class="label"> Select fitness tags </ion-label>
          <choose-block
            title="Select tags"
            :value="muscleTypesValue"
            @handle-click="onHandleSelect(EntitiesEnum.MuscleTypes)"
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
        <div
          class="actions-wrapper"
          :class="{ 'actions-wrapper--fixed': footerFixed }"
        >
          <ion-button
            expand="block"
            @click="onSave"
          >
            Save and Exit
          </ion-button>
        </div>
      </div>
      <div class="upload-video-progress" v-if="videoOnLoading">
        <circle-progress :percent="percentLoaded" />
      </div>
    </template>
  </base-layout>
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonTitle,
  isPlatform,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted, watch } from "vue";
import { toastController } from "@ionic/vue";
import { CreateEventDocument, CreateEventInput, FilePreloadDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import {
  CameraPro,
  CameraVideoSource,
  Video,
  VideoOptions,
} from "@deva-community/capacitor-camera-pro";
import {
  Filesystem,
  ReadFileOptions,
  ReadFileResult,
} from "@capacitor/filesystem";
import { Capacitor } from '@capacitor/core';
import { dataURItoFile } from "@/utils/fileUtils";
import { v4 as uuidv4 } from "uuid";
import mime from "mime";
import { dataURItoVideo } from "@/utils/videoUtils";
import { useDailysStore } from "@/general/stores/create-dailys";
import UploadVideo from "@/general/components/UploadVideo.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import CircleProgress from "@/general/components/CircleProgress.vue";

const router = useRouter();
const route = useRoute();
const percentLoaded = ref<number | undefined>();
const step = computed(() => route.params.step);
let abort: any;

const store = useDailysStore();

const titleValue = ref<string>("");
const priceValue = ref<string>("");
const muscleTypesValue = computed(() =>
  store.workoutMuscleTypes?.length > 1
    ? store.workoutMuscleTypes?.length
    : store.workoutMuscleTypes[0]?.label || ""
);
const workoutType = computed(() => store.workoutType?.name || "");
const exerciseDescription = ref<string>("");

onMounted(() => {
  console.log(step.value)
  if (store.workoutTitle) {
    titleValue.value = store.workoutTitle;
  }
  if (store.workoutPrice) {
    priceValue.value = store.workoutPrice.toString();
  }
  if(store.exercises?.description) {
    exerciseDescription.value = store.exercises?.description;
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
watch(
  () => exerciseDescription.value,
  (newVal: string) => {
    store.setExercise({
      ... store.exercises,
      description: newVal,
    });
  }
);

// <----video uploading
const videoOptions: VideoOptions = {
  duration: 60,
  highquality: true,
  source: CameraVideoSource.Prompt,
  promptLabelLibrary: "Albums",
  promptLabelVideo: "Make a video",
};
const preloading = ref<boolean>(false);

const maxVideoSize = ref(Number(process.env.VUE_APP_MAX_VIDEO_SIZE));
const maxVideoDuration = ref(Number(process.env.VUE_APP_MAX_VIDEO_DURATION));
const alertModalError = ref<EntitiesEnum | null>();
const path = ref<string>("");
const videoOnLoading = ref<boolean>(false);
const previewUrl = ref<string>("");
const previewPath = ref<string>("");
const videoPath = store.exercises?.videoPath;
const videoInfo = { name: store.exercises?.videoName, size: store.exercises?.videoSize };
const previewOnLoading = ref<boolean>(false);
const videoName = store.exercises?.videoName;

const bytesToSize = (bytes: number): string => {
  if (bytes == 0) return "0 Bytes";
  const k = 1000,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
const readFile = async (path: string): Promise<ReadFileResult> => {
  const options: ReadFileOptions = {
    path,
  };
  const result = await Filesystem.readFile(options);
  return result;
};
const getVideoDuration = async (file: File): Promise<number> => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = URL.createObjectURL(file);
  return new Promise<number>((resolve) => {
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
  });
};

const uploadVideo = async () => {
  try {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/x-m4v,video/*";
    document.body.appendChild(input);
    input.onchange = async (event) => {
      const file = event.target?.files[0];

      const videoDuration = await getVideoDuration(file);
      if (videoDuration > maxVideoDuration.value / 1000) {
        alertModalError.value = EntitiesEnum.MaxVideoDuration;
      } else if (file.size > maxVideoSize.value) {
        alertModalError.value = EntitiesEnum.MaxVideoSize;
      }

      preloading.value = false;

      if (alertModalError.value?.length) return;

      const fileSize = bytesToSize(file.size);
      const fileName = file.name;
      videoOnLoading.value = true;
      router.push({
        name: router?.currentRoute?.value?.name,
        params: { step: 'create' },
      });
      await filePreload({ file })
        .then((res) => {
          path.value = res?.data.filePreload.path;
          videoOnLoading.value = false;
          percentLoaded.value = undefined;
          store.setExercise({
            description: exerciseDescription.value,
            videoPath: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
            // previewUrl: previewUrl.value,
            // previewPath: previewPath.value,
            id: uuidv4(),
            videoSize: fileSize,
            videoName: fileName,
          });
        })
        .catch((error) => {
          abort();
          console.error(error);
          path.value = "";
          videoOnLoading.value = false;
          percentLoaded.value = undefined;
        });
      input.remove();
    };
    input.click();
  } catch (error) {
    console.error('Error uploading video:', error);
  }
};

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

// video uploading ----->
const onHandleSelect = (pathName: string) => {
  router.push({ name: pathName });
};

const onSave = () => {
  console.log("save");
}

const onBack = () => {
  if (step.value === 'upload') {
    router.go(-1);
  } else {
    router.push({
      name: router?.currentRoute?.value?.name,
      params: { step: 'upload' },
    });
  }
};
</script>

<style scoped lang="scss">
.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: center;
}
.content {
  padding: 24px 24px;
  width: 100%;
  height: 100%;
}

.top-buttons {
  display: flex;
  justify-content: end;
}
.dashboard-btn {
  margin-top: 10px;
}
.upload-video-progress {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  position: fixed;
  z-index: 99999;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: rgba(#262626, 0.8);
}
.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
.actions-wrapper {
  display: flex;
  flex-direction: column;
  padding-bottom: 36px;
  gap: 16px;

  &--fixed {
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 25;
    position: fixed;
    padding: 0 24px calc(16px + var(--ion-safe-area-bottom));
  }

  ion-button {
    width: 100%;
  }
}
</style>
