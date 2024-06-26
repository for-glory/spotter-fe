<template>
  <div>
    <div class="content">
      <div class="form-row">
        <ion-label class="label">
          Choose video for daily
          <ion-text color="danger">{{ `(We recommend a 10 sec intro and a minimum of 1 minute video)` }}</ion-text>
        </ion-label>
        <upload-video
          :video="videoPath"
          @delete="removeVideo"
          @change="videoSelected"
          :loading="videoOnLoading"
          :video-size="videoSize"
          :video-name="videoName"
          :video-path="videoPath"
          button-text="Upload or record a video"
          :loadingPercent="percentLoaded"
          :thumbnail="thumbnail"
        />
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
    </div>

    <div class="holder-button">
      <ion-button
        expand="block"
        @click="submit('finish')"
        :disabled="!isValidForm"
      >
        {{ exitButtonText }}
      </ion-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch, onMounted, ref, defineProps, defineEmits, withDefaults } from "vue";
import {
  IonButton,
  IonLabel,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { requiredFieldSchema } from "@/validations/authValidations";
import { v4 as uuidv4 } from "uuid";
import { VideoPreloadDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import UploadVideo from "@/general/components/UploadVideo.vue"; 
import { useDailysStore } from "@/general/stores/useDailysStore";


const router = useRouter();
const store = useDailysStore();

const videoPath = computed(() => store.exercises?.videoPath);
const videoName = computed(() => store.path);
const videoSize = computed(() => store.exercises?.videoSize);
const videoOnLoading = ref<boolean>(false);
const percentLoaded = ref<number | undefined>();

const { value: titleValue, errorMessage: titleError } = useField<string>(
  "workoutTitle",
  requiredFieldSchema
);
const { value: priceValue, errorMessage: priceError } = useField<string>(
  "workoutPrice",
  requiredFieldSchema
);
const { value: exerciseDescription, errorMessage: descriptionError } = useField<string>(
  "exerciseDescription",
  requiredFieldSchema
);

const thumbnail = computed(
  () =>store.workoutPreview
);

const workoutType = computed(() => store.workoutType?.name || "");
const muscleTypesValue = computed(() =>
  store.workoutMuscleTypes?.length > 1
    ? store.workoutMuscleTypes?.length
    : store.workoutMuscleTypes[0]?.label || ""
);

let abort: any;

const { mutate: videoPreload, loading: videoPreloadLoading } = useMutation(
  VideoPreloadDocument,
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

const props = withDefaults(
  defineProps<{
    edit?: boolean;
    loading?: boolean;
    exitButtonText?: string
  }>(),
  {
    exitButtonText: "Finish",
  }
);

const emits = defineEmits<{
  (e: "submit"): void;
}>();

onMounted(() => {
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

const isValidForm = computed(
  () =>
    !titleError.value &&
    titleValue.value &&
    !priceError.value &&
    priceValue.value &&
    !descriptionError.value &&
    exerciseDescription.value &&
    videoPath.value &&
    store.workoutMuscleTypesIds?.length &&
    store.workoutType
);

const onHandleSelect = (pathName: string) => {
  router.push({ name: pathName });
};

const resetWorkout = () => {
  store.clearState();
};

const videoSelected = async (
  file: File,
  size: string,
  name: string
): Promise<void> => {
  videoOnLoading.value = true;
  percentLoaded.value = 0;
  await videoPreload({ file })
    .then((res) => {
      videoOnLoading.value = false;
      percentLoaded.value = undefined;
      store.setValue("path", res?.data.videoPreload.path);
      store.setValue(
        "workoutPreview",
        `${process.env.VUE_APP_MEDIA_URL}${res?.data.videoPreload.thumbnail_path}`
      );
      store.setValue("workoutPath", res?.data.videoPreload.thumbnail_path);
      store.setValue("workoutDuration", res?.data.videoPreload.duration);
      store.setExercise({
        description: exerciseDescription.value,
        videoPath: `${process.env.VUE_APP_MEDIA_URL}${res?.data.videoPreload.path}`,
        id: uuidv4(),
        videoSize: size,
        videoName: name,
      });
      store.setValue("updates", { video: store.path, preview: store.workoutPath, duration: store.workoutDuration });
    })
    .catch((error) => {
      abort();
      console.error(error);
      videoOnLoading.value = false;
      percentLoaded.value = undefined;
    });
};

const removeVideo = () => {
  store.setExercise({});
}

const submit = (type: string) => {
  emits('submit');
}

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

  ion-button {
    width: 100%;
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
