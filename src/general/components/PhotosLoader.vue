<template>
  <div class="add-photo">
    <ion-button
      @click="openImagePicker()"
      class="add-photo__file"
      expand="block"
      :disabled="loading"
    >
      <ion-icon src="assets/icon/payment/plus.svg" class="add-icon" />
      <div class="add-photo__file__loader" v-if="loading">
        <circle-progress :percent="progress" class="add-photo__img__progress" />
      </div>
    </ion-button>
    <ion-button
      v-for="(img, i) in photos"
      :key="i"
      class="add-photo__img"
      :disabled="loading"
    >
      <ion-img @click="onPhotoClick(i, img.id)" :src="img.url" />
    </ion-button>
  </div>
  <photo-cropper
    :is-open="isCropperOpen"
    @set-open="setOpen"
    :file="currentFile"
    @get-uploaded-img="getUploadedImg"
    :circle-shape="circleShape"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonImg,
  IonIcon,
  actionSheetController,
  alertController,
  isPlatform,
} from "@ionic/vue";
import { ref, withDefaults, defineProps, defineEmits } from "vue";
import {
  CameraPro,
  CameraSource,
  CameraResultType,
} from "@deva-community/capacitor-camera-pro";
import PhotoCropper from "@/general/components/modals/crop/PhotoCropper.vue";
import CircleProgress from "@/general/components/CircleProgress.vue";
import { Capacitor } from "@capacitor/core";

enum uploadTypesEnum {
  MakeAPhoto = "MAKE_A_PHOTO",
  PhotoLibrary = "PHOTO_LIBRARY",
}

enum actionTypesEnum {
  DeletePhoto = "DELETE_PHOTO",
  EditPhoto = "EDIT_PHOTO",
}

withDefaults(
  defineProps<{
    circleShape?: boolean;
    photos?: any[];
    loading?: boolean;
    progress?: number;
    disabled?: boolean;
  }>(),
  {
    circleShape: true,
    disabled: false,
  }
);

const emits = defineEmits<{
  (e: "upload", photo: string): void;
  (e: "change", photo: string, index: number, id: string): void;
  (e: "delete", index: number, id?: string): void;
}>();

const openImagePicker = async (index?: number, mediaId?: string) => {
  const mobileButtons = [
    {
      text: "Take photo",
      data: {
        type: uploadTypesEnum.MakeAPhoto,
      },
    },
    {
      text: "Photo library",
      data: {
        type: uploadTypesEnum.PhotoLibrary,
      },
    },
    {
      text: "Cancel",
      role: "cancel",
    },
  ];

  const webButtons = [
    {
      text: "Photo library",
      data: {
        type: uploadTypesEnum.PhotoLibrary,
      },
    },
    {
      text: "Cancel",
      role: "cancel",
    },
  ];

  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: Capacitor.isNativePlatform() ? mobileButtons : webButtons,
  });

  await actionSheet.present();

  const { data } = await actionSheet.onWillDismiss();
  const type: uploadTypesEnum = data?.type;

  const actions = {
    [uploadTypesEnum.MakeAPhoto]: () =>
      getPhoto(CameraSource.Camera, index, mediaId),
    [uploadTypesEnum.PhotoLibrary]: () =>
      getPhoto(CameraSource.Photos, index, mediaId),
  };

  if (actions[type]) {
    actions[type]();
  }
};

const getPhoto = async (
  source: CameraSource,
  index?: number,
  mediaId?: string
): Promise<void> => {
  if (isPlatform("capacitor")) {
    const permissions = await CameraPro.requestPermissions();
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

  const image = await CameraPro.getPhoto({
    width: 1000,
    height: 1000,
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source,
  });

  currentFile.value = `data:image/jpeg;base64,${image.base64String}`;
  currentFileIndex.value = index;
  currentFileId.value = mediaId;
  isCropperOpen.value = true;
};

const onPhotoClick = async (index: number, mediaId: string) => {
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      {
        text: "Delete Photo",
        role: "destructive",
        data: {
          type: actionTypesEnum.DeletePhoto,
        },
      },
      {
        text: "Edit Photo",
        data: {
          type: actionTypesEnum.EditPhoto,
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
  const type: actionTypesEnum = data?.type;

  const actions = {
    [actionTypesEnum.DeletePhoto]: () => deletePhoto(index, mediaId),
    [actionTypesEnum.EditPhoto]: () => openImagePicker(index, mediaId),
  };

  if (actions[type]) {
    actions[type]();
  }
};

const deletePhoto = (index: number, mediaId?: string) => {
  emits("delete", index, mediaId);
};

const currentFile = ref<string>("");
const currentFileIndex = ref<number | undefined>(undefined);
const currentFileId = ref<string | undefined>(undefined);
const isCropperOpen = ref<boolean>(false);

const setOpen = (value: boolean) => {
  isCropperOpen.value = value;
};

const getUploadedImg = (image: string) => {
  currentFileIndex.value !== undefined
    ? emits(
        "change",
        image,
        currentFileIndex.value,
        currentFileId.value as string
      )
    : emits("upload", image);
  currentFileIndex.value = currentFileId.value = undefined;
};
</script>

<style scoped lang="scss">
.add-photo {
  display: flex;
  padding: 2px 0;
  overflow-x: auto;
  margin-right: -24px;
  margin-bottom: 25px;

  &__file {
    flex: 0 0 88px;
    width: 100%;
    height: 88px;
    margin: 0;
    margin-right: 8px;
    font-size: 13px;
    line-height: 1.5;
    --color: var(--ion-color-medium);
    --background: var(--gray-700);
    --border-width: 0.8px;
    --border-style: dashed;
    --border-color: var(--ion-color-medium);
    --border-radius: 8px;

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

  &__img {
    margin: 0 8px 0 0;
    flex: 0 0 88px;
    width: 88px;
    height: 88px;
    --border-radius: 8px;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 0;
    --padding-end: 0;
    --background: transparent;
    --border-width: 0;

    ion-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
