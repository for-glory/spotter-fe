<template>
  <base-layout hideNavigationMenu>
    <template #header>
      <page-header back-btn @back="onBack" :title="step === 'upload' ? 'Create your Dailys' : 'Post Dailys'" />
    </template>
    <template #content>
      {{
        log
      }}
      <div v-if="step === 'upload'" class="content d-flex align-items-center justify-content-center">
        <ion-button
        @click="uploadVideo"
          expand="block"
        >
          Create first Dailys
        </ion-button>
      </div>
      <div v-else>
        <div class="form-row" id="video">
          <span class="video__metadata">
            {{ videoPath }}
            <ion-text color="medium">({{ videoSize }})</ion-text>
          </span>
        </div>
        <!-- <div class="form-row">
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
          <ion-label class="label"> Choose muscle group </ion-label>
          <choose-block
            title="Select muscle group"
            :value="muscleTypesValue"
            @handle-click="onHandleSelect(EntitiesEnum.MuscleTypes)"
          />
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

        <div class="form-row">
          <ion-label class="label"> Choose intensity level </ion-label>
          <choose-block
            title="Workout type"
            :value="workoutType"
            @handle-click="onHandleSelect(EntitiesEnum.WorkoutTypes)"
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
        </div> -->
      </div>
      <div class="upload-video-progress" v-if="videoOnLoading">
        <circle-progress :percent="loadingPercent" />
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
import { ref } from "vue";
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
import UploadVideo from "@/general/components/UploadVideo.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import CircleProgress from "@/general/components/CircleProgress.vue";

const router = useRouter();
const route = useRoute();
const percentLoaded = ref<number | undefined>();
const log = ref<any[]>([]);
const step = ref<string>('upload');
let abort: any;


// video uploading
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
const videoPath = ref<string>("");
const videoInfo = ref<{ name: string; size: string }>({ name: "", size: "" });
const previewOnLoading = ref<boolean>(false);

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
    log.value.push('isCapacitor:  ', isPlatform('capacitor'));
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
      log.value.push({fileName});
      log.value.push({fileSize});
      videoOnLoading.value = true;
      await filePreload({ file })
        .then((res) => {
          path.value = res?.data.filePreload.path;
          videoPath.value = `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`;
          videoOnLoading.value = false;
          percentLoaded.value = undefined;
          videoInfo.value.size = fileSize;
          videoInfo.value.name = fileName;
          log.value.push({videoPath});
          log.value.push({videoInfo});
          step.value = 'create';
        })
        .catch((error) => {
          abort();
          console.error(error);
          log.value.push(error);
          path.value = "";
          videoPath.value = "";
          videoOnLoading.value = false;
          percentLoaded.value = undefined;
          videoInfo.value.size = "";
          videoInfo.value.name = "";
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

const onBack = () => {
  if (step.value === 'upload') {
    router.go(-1);
  } else {
    step.value = 'upload';
  }
};
</script>

<style scoped lang="scss">
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
.content {
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
  width: 100%;
  height: 100%;

  ion-button {
    color: #262626;
    font: 600 16px/1 Lato;
    height: 40px;
    
    --border-radius: 8px;
    width: 70%;
  }
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
</style>
