<template>
  <div class="photo-loader" @click="openLoadOptions">
    <div class="photo-preview" v-if="type === 'avatar'">
      <img
        class="photo-preview__img"
        :src="value || `assets/icon/${icon}.svg`"
        :class="{ 'photo-preview__img--empty': !value }"
      />
      <span class="photo-preview__icon">
        <ion-icon src="assets/icon/change-photo.svg"></ion-icon>
      </span>
    </div>
    <ion-item
      v-else
      class="photo-area"
      :class="{ 'photo-area--empty': !value }"
    >
      <img v-if="value" :src="value" class="photo-area__img" />
      <ion-icon
        v-else-if="!loading"
        src="assets/icon/add-media.svg"
        class="photo-area__add-icon"
      />
      <div class="photo-area__loader" v-if="loading">
        <circle-progress :percent="progress" class="photo-area__progress" />
      </div>
    </ion-item>
  </div>

  <photo-cropper
    :is-open="isCropperOpen"
    @set-open="setCropperOpen"
    :file="uploadedImage"
    @get-uploaded-img="getCroppedImg"
    :circle-shape="circleShape"
  />
</template>

<script lang="ts" setup>
import {
  actionSheetController,
  alertController,
  IonIcon,
  isPlatform,
  IonItem,
} from "@ionic/vue";
import { ref, watch, withDefaults, defineProps, defineEmits } from "vue";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import PhotoCropper from "@/general/components/modals/crop/PhotoCropper.vue";
import CircleProgress from "@/general/components/CircleProgress.vue";

enum actionTypesEnum {
  Delete = "DELETE",
  MakeAPhoto = "MAKE_A_PHOTO",
  PhotoLibrary = "PHOTO_LIBRARY",
}

const props = withDefaults(
  defineProps<{
    photo?: string;
    icon?: string;
    circleShape?: boolean;
    type?: string;
    loading?: boolean;
    progress?: number;
  }>(),
  {
    icon: "person",
    circleShape: false,
    type: "default",
  }
);

const emits = defineEmits<{
  (e: "change", value?: string): void;
}>();

const value = ref<string | undefined>(props.photo);
const uploadedImage = ref<string>("");
const isCropperOpen = ref<boolean>(false);

watch(
  () => props.photo,
  (newVal) => {
    value.value = newVal;
  }
);

const openLoadOptions = async (): Promise<void> => {
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      ...(value.value
        ? [
            {
              text: "Delete photo",
              role: "destructive",
              data: {
                type: actionTypesEnum.Delete,
              },
            },
          ]
        : []),
      {
        text: "Take photo",
        data: {
          type: actionTypesEnum.MakeAPhoto,
        },
      },
      {
        text: "Photo library",
        data: {
          type: actionTypesEnum.PhotoLibrary,
        },
      },
      {
        text: "Cancel",
        role: "cancel",
      },
    ],
  });

  await actionSheet.present();

  const { data } = await actionSheet.onWillDismiss();
  const type: actionTypesEnum = data.type;

  const actions = {
    [actionTypesEnum.Delete]: () => setValue(),
    [actionTypesEnum.MakeAPhoto]: () => getPhoto(CameraSource.Camera),
    [actionTypesEnum.PhotoLibrary]: () => getPhoto(CameraSource.Photos),
  };

  if (actions[type]) {
    actions[type]();
  }
};

const getPhoto = async (source: CameraSource): Promise<void> => {
  if (isPlatform("capacitor")) {
    const permissions = await Camera.requestPermissions();
    if (
      (source === CameraSource.Camera && permissions.camera === "denied") ||
      (source === CameraSource.Photos && permissions.photos === "denied")
    ) {
      const alert = await alertController.create({
        header: "Permissions denied",
        message:
          source === CameraSource.Camera
            ? "You have denied the app from using the camera"
            : "You have denied the app access to your photos",
        buttons: ["OK"],
      });

      await alert.present();
      return;
    }
  }

  const image = await Camera.getPhoto({
    width: 750,
    height: 750,
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source,
  });

  uploadedImage.value = `data:image/jpeg;base64,${image.base64String}`;
  isCropperOpen.value = true;
};

const setValue = (newPhoto?: string): void => {
  value.value = newPhoto;
  emits("change", value.value);
};

const setCropperOpen = (value: boolean) => {
  isCropperOpen.value = value;
};

const getCroppedImg = (image: string) => {
  setValue(image);
  isCropperOpen.value = false;
};
</script>

<style lang="scss" scoped>
.photo-preview {
  display: flex;
  width: 132px;
  height: 132px;
  margin: 0 auto;
  border-radius: 50%;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background: var(--gray-700);

  &__img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    border-radius: 50%;

    &--empty {
      max-width: 80px;
      max-height: 80px;
    }
  }

  &__icon {
    right: 0;
    bottom: 0;
    width: 2em;
    height: 2em;
    display: flex;
    line-height: 1;
    font-size: 24px;
    position: absolute;
    border-radius: 50%;
    align-items: center;
    flex-direction: column;
    color: var(--gray-700);
    justify-content: center;
    background: var(--ion-color-primary);
  }
}

.photo-area {
  margin: 0;
  width: 100%;
  color: var(--ion-color-medium);
  --border-radius: 8px;
  --background: var(--gray-700);
  --box-shadow: none;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: var(--container-offset);
  --inner-padding-end: var(--container-offset);
  --min-height: 158px;
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --padding-top: 0;
  --inner-border-width: 0;
  --padding-bottom: 0;
  --border-width: 1px;
  --border-style: dashed;
  --border-color: transparent;

  &--empty {
    --border-color: var(--ion-color-medium);
  }

  &__img {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
  }

  &__add-icon {
    margin: 0 auto;
    line-height: 1;
    font-size: 24px;
  }

  &__loader {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    position: absolute;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    background: rgba(#262626, 0.8);
  }
}
</style>
