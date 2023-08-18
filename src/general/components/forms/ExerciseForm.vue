<template>
  <div>
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
        :video-size="videoInfo?.size"
        :video-name="videoInfo?.name"
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
        v-if="hasSubmitButton"
      >
        {{submitButtonText}}
      </ion-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, defineProps, defineEmits, withDefaults, onMounted } from "vue";
import { IonLabel, IonButton, IonIcon, IonTitle } from "@ionic/vue";
import { useField } from "vee-validate";
import { useRouter, useRoute } from "vue-router";
import { v4 as uuidv4 } from "uuid";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useWorkoutsStore } from "../../../trainers/store/workouts";
import { EntitiesEnum } from "@/const/entities";
import UploadVideo from "@/general/components/UploadVideo.vue";
import { dataURItoFile } from "@/utils/fileUtils";
import { FilePreloadDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
import { clearAuthItems } from "@/router/middleware/auth";

const router = useRouter();
const route = useRoute();
const store = useWorkoutsStore();

const props = withDefaults(
  defineProps<{
    edit?: boolean;
    loading?: boolean;
    submitButtonText?: string;
    skipText?: string;
    hasSkipButton?: boolean;
    hasSubmitButton?: boolean;
  }>(),
  {
    submitButtonText: "Upload & Finish",
  }
);

const emits = defineEmits<{
  (e: "submit"): void;
  (e: "onSkip"): void;
}>();

const { value: exerciseTitle, errorMessage: titleError } =
  useField<string>("exerciseTitle");

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

const removePhoto = () => {
  previewUrl.value = "";
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
