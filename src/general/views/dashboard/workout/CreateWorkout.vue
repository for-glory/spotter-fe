<template>
    <div class="top-buttons">
      <ion-button class="dashboard-btn" @click="onBack" fill="clear">
        <ion-icon src="assets/icon/arrow-back.svg" />
        Back
      </ion-button>
    </div>
		<ion-title class="title" color="primary">
			Post dailys
		</ion-title>
    <div>
      <ion-grid class="post-container">
        <ion-row>
          <ion-col size="12">
            <div class="form-row">
              <ion-label class="label"> Choose video for daily </ion-label>
              <video-uploader
                :video="videoPath"
                @delete="removeVideo"
                @change="videoSelected"
                :thumbnail="thumbnail"
                :loading="videoOnLoading"
                :video-size="videoInfo.size"
                :video-name="videoInfo.name"
                button-text="Upload"
                :loadingPercent="percentLoaded"
              />
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6">
            <div class="form-row">
              <base-input
                v-model:value="titleValue"
                :error-message="titleError"
                placeholder="Enter title"
                name="workoutTitle"
                label="Choose a name for daily"
                required
              />
            </div>
          </ion-col>
          <ion-col size="12" size-md="6">
            <base-input
              v-model:value="priceValue"
              :error-message="priceError"
              placeholder="Enter price"
              type="number"
              name="price"
              label="Set price (USD $)"
              required
            />
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12" size-md="6">
            <div class="form-row">
              <ion-label class="label"> Choose intensity level </ion-label>
              <choose-block
                title="Workout type"
                :value="workoutType"
                style="cursor: pointer"
                @handle-click="onHandleSelect(EntitiesEnum.DashboardWorkoutTypes)"
              />
            </div>
          </ion-col>
          <ion-col size="12" size-md="6">
            <div class="form-row">
              <ion-label class="label"> Select fitness tags </ion-label>
              <choose-block
                title="Select Tags"
                :value="muscleTypesValue"
                style="cursor: pointer"
                @handle-click="onHandleSelect(EntitiesEnum.DashboardMuscleTypes)"
              />
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col size="12">
            <div class="form-row">
              <base-input
                :rows="3"
                :maxlength="150"
                label="Create instruction tip for video"
                @change="dailyDescriptionChange"
                v-model:value="dailyDescription"
                placeholder="Enter instruction tips"
              />
            </div>
          </ion-col>
        </ion-row>
        <ion-row>
          <div class="action-wrap">
            <ion-button
              @click="handleSubmit"
              type="submit"
              expand="block"
              :disabled="!isValidForm"
            >
              Post Daily
            </ion-button>
          </div>
        </ion-row>
      </ion-grid>
    </div>
	<transition>
		<ion-note v-if="errorMessage">
			{{ errorMessage }}
		</ion-note>
	</transition>
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
    title="Do you want to discard changes?"
    text="Changes will not be saved"
    cancelButton="Cancel"
    button="Discard changes"
  />
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
import { useWorkoutsStore } from "../../../../trainers/store/workouts";
import { requiredFieldSchema } from "@/validations/authValidations";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import VideoUploader from "@/general/components/VideoUploader.vue";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { Emitter, EventType } from "mitt";
import {
  VideoPreloadDocument,
  CreateDailyDocument,
  CreateDailyInput,
  Workout,
  WorkoutDocument,
  WorkoutVideosInput,
} from "@/generated/graphql";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

const percentLoaded = ref<number | undefined>();

const router = useRouter();

const store = useWorkoutsStore();
const facilityStore = useFacilityStore();
const isConfirmedModalOpen = ref(false);
const errorMessage = ref("");

const videoOnLoading = ref<boolean>(false);
const videoPath = computed(
  () =>store.videoPath
);
const videoInfo = ref<{ name: string; size: string }>({ name: "", size: "" });
const thumbnail = computed(
  () =>store.workoutPreview
);

const { value: titleValue, errorMessage: titleError } = useField<string>(
  "workoutTitle",
  requiredFieldSchema
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

const { value: priceValue, errorMessage: priceError } = useField<string>(
  "workoutPrice",
  requiredFieldSchema
);

const dailyDescription = computed(() => store.description);
const dailyDescriptionChange = (value: string) => {
  store.setValue("description", value);
};

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
    store.workoutPreview &&
    store.videoPath &&
    store.workoutType && 
    store.description
);

const { mutate: createWorkout, loading: createWorkoutLoading } =
  useMutation<CreateDailyInput>(CreateDailyDocument);

const params = computed(() => ({
  preview: store.workoutPath,
  video: store.path,
  body_parts: store.workoutMuscleTypesIds,
  facility_id: facilityStore.facility?.id,
  type_id: store.workoutType?.id,
  title: store.workoutTitle,
  description: store.description,
  duration: Number(store.workoutDuration),
  price: getSumForPayment(store.workoutPrice as number),
}));

const handleSubmit = () => {
  if (isValidForm.value) {
    createWorkout(params.value)
    .then(() => {
      store.clearState();
      router.push({
        name: EntitiesEnum.DashboardWorkout,
      });
    })
    .catch((err) => {
      errorMessage.value = err;
      throw new Error(err);
    });
  }
};

const onHandleSelect = (pathName: string) => {
  router.push({ name: pathName });
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
      store.setValue(
        "videoPath",
        `${process.env.VUE_APP_MEDIA_URL}${res?.data.videoPreload.path}`
      );
      store.setValue("path", res?.data.videoPreload.path);
      store.setValue(
        "workoutPreview",
        `${process.env.VUE_APP_MEDIA_URL}${res?.data.videoPreload.thumbnail_path}`
      );
      store.setValue("workoutPath", res?.data.videoPreload.thumbnail_path);
      videoOnLoading.value = false;
      percentLoaded.value = undefined;
      videoInfo.value.size = size;
      videoInfo.value.name = name;
    })
    .catch((error) => {
      abort();
      console.error(error);
      videoOnLoading.value = false;
      percentLoaded.value = undefined;
      videoInfo.value.size = "";
      videoInfo.value.name = "";
    });
};

const onBack = () => {
  if (titleValue.value ||
    priceValue.value ||
    store.workoutMuscleTypesIds?.length ||
    store.workoutPreview ||
    store.videoPath ||
    store.workoutType || 
    store.description) {
    isConfirmedModalOpen.value = true;
  } else {
    router.go(-1);
  }
};
const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    store.clearState();
    router.go(-1);
  }
};

const removeVideo = () => {
  store.setValue("videoPath", "");
  store.setValue("path", "");
};

const options = minutesDuration(10, 240, 10);
</script>

<style lang="scss" scoped>
.post-container {
  max-width: 640px;
}
.action-wrap {
  display: flex;
  justify-content: end;
  align-items: flex-end;
  width: 100%;
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
</style>
