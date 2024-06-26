<template>
  <div class="upload-video">
    <div v-if="video">
      <img v-if="thumbnail" :src="thumbnail" class="w-100" />
      <div class="video">
        <span class="video__metadata">
          {{ videoName }}
        </span>
        <div class="video__actions">
          <ion-button
            class="video__action"
            @click="chooseVideo"
            fill="clear"
            expand="block"
            color="medium"
          >
            <ion-icon slot="icon-only" src="assets/icon/pencil.svg" />
          </ion-button>
          <ion-button
            class="video__action"
            @click="emits('delete')"
            fill="clear"
            expand="block"
            color="medium"
          >
            <ion-icon slot="icon-only" src="assets/icon/trash.svg" />
          </ion-button>
        </div>
      </div>
    </div>
    <ion-button
      v-else
      fill="clear"
      expand="block"
      @click="chooseVideo"
      class="upload-video__upload-btn"
    >
      <ion-icon slot="icon-only" src="assets/icon/pencil.svg" />
      {{ buttonText }}
    </ion-button>

    <div class="upload-video__progress" v-if="loading || preloading">
      <circle-progress :percent="loadingPercent" />
    </div>
  </div>

  <discard-changes
    v-if="alertModalError"
    :is-open="Boolean(alertModalError)"
    @close="alertModalError = null"
    :title="videoErrors[alertModalError]?.title"
    :text="videoErrors[alertModalError]?.text"
    cancelButton="Ok"
    hide-button
  />
  <ion-modal
    ref="modal"
    :is-open="isUploadModalOpen"
    class="upload-modal"
    @willDismiss="isUploadModalOpen = false"
  >
    <div class="main-buttons">
      <ion-button
        @click="chooseVideo('library')"
        expand="block"
      >
        Video Library
      </ion-button>
      <div class="split"/>
      <ion-button
        @click="chooseVideo('record')"
        expand="block"
      >
        Record a video
      </ion-button>
    </div>
    <ion-button
      id="cancel"
      @click="isUploadModalOpen = false"
      expand="block"
    >
      Cancel
    </ion-button>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonIcon, IonButton, IonText, isPlatform } from "@ionic/vue";
import { defineEmits, defineProps, ref } from "vue";
import {
  CameraPro,
  CameraVideoSource,
  Video,
  VideoOptions,
} from "@deva-community/capacitor-camera-pro";
import mime from "mime";
import {
  Filesystem,
  ReadFileOptions,
  ReadFileResult,
} from "@capacitor/filesystem";
import { dataURItoVideo } from "@/utils/videoUtils";
import { v4 as uuidv4 } from "uuid";
import CircleProgress from "@/general/components/CircleProgress.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { EntitiesEnum } from "@/const/entities";
import { Capacitor } from "@capacitor/core";

defineProps<{
  video: string;
  buttonText: string;
  loading: boolean;
  loadingPercent?: number;
  videoSize?: string;
  videoName?: string;
  videoPath?: string;
  thumbnail?: string;
}>();

const emits = defineEmits<{
  (e: "change", file: File, size?: string, name?: string): void;
  (e: "delete"): void;
}>();

const preloading = ref<boolean>(false);

const videoOptions: VideoOptions = {
  highquality: true,
  saveToGallery: true,
  source: CameraVideoSource.Camera,
  promptLabelHeader: 'Upload video',
  promptLabelLibrary: 'Upload from video library',
  promptLabelVideo: 'Record a video'
};

const isUploadModalOpen = ref<boolean>(false);

const chooseVideo = (mode: string) => {
  if(Capacitor.isNativePlatform()) {
    CameraPro.getVideo(videoOptions)
    .then(async (video: Video) => {
      preloading.value = true;
      const blobFile = (video?.path && (await readFile(video.path))) || "";
      const mimeType = (video?.path && mime.getType(video?.path)) || "";
      const file = dataURItoVideo(blobFile.data, uuidv4(), mimeType);
      const videoDuration = await getVideoDuration(file);
      if(videoDuration < minVideoDuration.value) {
        alertModalError.value = EntitiesEnum.MinVideoDuration;
      } else if (file.size > maxVideoSize.value) {
        alertModalError.value = EntitiesEnum.MaxVideoSize;
      }

      preloading.value = false;

      if (alertModalError.value?.length) return;

      const fileSize = bytesToSize(file.size);
      const fileName = `${video.path?.split("/")?.slice(-1) || ""}`;
      emits("change", file, fileSize, fileName);
    })
    .catch(async (error) => {
      console.error("camera error: ", error);
      preloading.value = false;
    });
  } else {
    const input: HTMLInputElement = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/x-m4v,video/*";
    document.body.appendChild(input);
    input.onchange = async (event) => {
      const file = event.target?.files[0];

      const videoDuration = await getVideoDuration(file);
      if(videoDuration < minVideoDuration.value) {
        alertModalError.value = EntitiesEnum.MinVideoDuration;
      } else if (file.size > maxVideoSize.value) {
        alertModalError.value = EntitiesEnum.MaxVideoSize;
      }

      preloading.value = false;

      if (alertModalError.value?.length) return;

      const fileSize = bytesToSize(file.size);
      console.log(file.size);
      const fileName = file.name;
      emits("change", file, fileSize, fileName);
      input.remove();
    };
    input.click();
  }
};

const readFile = async (path: string): Promise<ReadFileResult> => {
  const options: ReadFileOptions = {
    path,
  };
  const result = await Filesystem.readFile(options);
  return result;
};

const bytesToSize = (bytes: number): string => {
  if (bytes == 0) return "0 Bytes";
  const k = 1000,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const maxVideoSize = ref(Number(process.env.VUE_APP_MAX_VIDEO_SIZE));
const maxVideoDuration = ref(Number(process.env.VUE_APP_MAX_VIDEO_DURATION));
const minVideoDuration = ref(Number(process.env.VUE_APP_MIN_VIDEO_DURATION));

const getVideoDuration = async (file: File): Promise<number> => {
  const video = document.createElement("video");
  video.preload = "metadata";
  video.src = URL.createObjectURL(file);
  return new Promise<number>((resolve) => {
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      console.log("video.duration", video.duration);
      resolve(video.duration);
    };
  });
};

const alertModalError = ref<EntitiesEnum | null>();
const videoErrors = {
  [`${EntitiesEnum.MaxVideoDuration}`]: {
    title: "The video is too long.",
    text: `Impossible to upload this video because it's too big. Max duration ${
      maxVideoDuration.value / 1000
    } sec. Edit the video and try again.`,
  },
  [`${EntitiesEnum.MinVideoDuration}`]: {
    title: "The video is too short.",
    text: `Impossible to upload this video because it's too short. Min duration is 1 min. Upload another video.`,
  },
  [`${EntitiesEnum.MaxVideoSize}`]: {
    title: "Video size is too big.",
    text: `Impossible to upload this video because it's too big. Max video size is ${bytesToSize(
      maxVideoSize.value
    )}. Edit the video and try again.`,
  },
};
</script>

<style scoped lang="scss">
.upload-video {
  &__upload-btn {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    --border-radius: 8px;
    --border-width: 0.8px;
    --border-style: solid;
    color: var(--ion-color-secondary);
    --border-color: var(--ion-color-medium);
  }

  &__progress {
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
}

.video {
  display: flex;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.4;
  border-radius: 8px;
  align-items: center;
  padding: 8px 12px 8px 16px;
  justify-content: space-between;
  background: var(--gray-700);

  &__metadata {
    word-break: break-word;
  }

  &__actions {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    margin: 0 -4px 0 12px;
    justify-content: flex-start;
  }

  &__action {
    width: 32px;
    height: 32px;
    margin: 0 4px;
    line-height: 1;
    font-size: 24px;
    --border-radius: 50%;
    --padding-end: 0;
    --padding-start: 0;
    --padding-top: 0;
    --padding-bottom: 0;

    ion-icon {
      font-size: 1em;
    }
  }
}
.upload-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --background: none;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(
      100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );
  }
}
.main-buttons {
  border-radius: 8px;
  background: #262626;

  ion-button {
    --color: #EFEFEF;
    --background: none;
    font: 500 16px/1 Lato;
  }
}
ion-button#cancel {
  --color: #FFFFFF6a;
  --background: #262626;
  font: 500 16px/1 Lato;
  margin-top: 16px;
}
</style>
