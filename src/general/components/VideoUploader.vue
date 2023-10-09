<template>
  <div class="upload-video" @click="chooseVideo">
    <div v-if="video">
      <div class="video">
				<img v-if="thumbnail" :src="thumbnail" class="photo-area__img" />
      </div>
    </div>
    <div class="upload-video__upload-btn description" v-else-if="newDedc">
        Drag and Drop file &nbsp; or &nbsp;
        <span>Choose file</span>
    </div>
    <div
      v-else
      class="upload-video__upload-btn"
    >
			<span>Choose file</span>
		</div>

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

defineProps<{
  video: string;
  buttonText: string;
  loading: boolean;
  loadingPercent?: number;
  videoSize?: string;
  videoName?: string;
  videoPath?: string;
	thumbnail?: string;
  newDedc?: boolean;
}>();

const emits = defineEmits<{
  (e: "change", file: File, size?: string, name?: string): void;
  (e: "delete"): void;
}>();

const preloading = ref<boolean>(false);

const videoOptions: VideoOptions = {
  duration: 60,
  highquality: true,
  source: CameraVideoSource.Prompt,
  promptLabelLibrary: "Video library",
  promptLabelVideo: "Record a video",
};

const chooseVideo = () => {
  console.log(maxVideoSize.value);
  if (isPlatform("capacitor")) {
    CameraPro.getVideo(videoOptions)
      .then(async (video: Video) => {
        preloading.value = true;
        const blobFile = (video?.path && (await readFile(video.path))) || "";
        const mimeType = (video?.path && mime.getType(video?.path)) || "";
        const file = dataURItoVideo(blobFile.data, uuidv4(), mimeType);
        const videoDuration = await getVideoDuration(file);
        if (videoDuration > maxVideoDuration.value / 1000) {
          alertModalError.value = EntitiesEnum.MaxVideoDuration;
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
      if (videoDuration > maxVideoDuration.value) {
        alertModalError.value = EntitiesEnum.MaxVideoDuration;
      } else if(videoDuration < minVideoDuration.value) {
        alertModalError.value = EntitiesEnum.MinVideoDuration;
      } else if (file.size > maxVideoSize.value) {
        alertModalError.value = EntitiesEnum.MaxVideoSize;
      }

      preloading.value = false;

      if (alertModalError.value?.length) {
        alert(alertModalError.value);
        return;
      }

      const fileSize = bytesToSize(file.size);
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
	height: 112px;
	border-radius: 10px;
	border: 0.5px dashed var(--gray-400);
	overflow: hidden;

  &__upload-btn {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: var(--ion-color-secondary);
    cursor: pointer;
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

.description {
    color: var(--gray-60);
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;

    span {
      border-bottom: 1px solid;
    }
  }
</style>
