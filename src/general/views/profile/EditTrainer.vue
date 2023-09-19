<template>
  <ion-page ref="page" v-if="!isWebView">
    <base-layout hide-navigation-menu>
      <template #header>
        <page-header back-btn @back="onBack" title="Create trainer profile" />
      </template>
      <template #content>
        <ion-spinner
          v-if="loading || updateUserLoading"
          name="lines"
          class="spinner"
        />
        <div class="edit" v-else>
          <div class="cards__container">
            <photos-loader
              @upload="uploadPhoto"
              @delete="deletePhoto"
              @change="uploadPhoto"
              :circle-shape="false"
              :photos="media"
              :loading="photoOnLoad"
              :progress="percentPhotoLoaded"
              :disabled="loading || updateUserLoading"
            />
          </div>

          <div class="form-row">
            <base-input
              label="What’s your full name"
              v-model:value="firstName"
              :error-message="firstNameError"
              placeholder="First Name"
              name="firstName"
              class="form-row__control form-row__input"
              required
            />
            <base-input
              v-model:value="lastName"
              :error-message="lastNameError"
              placeholder="Last Name"
              name="lastName"
              class="form-row__control form-row__input"
              required
            />
          </div>

          <div
            class="form-row"
            v-if="
              trainerType === TrainerTypeEnum.WorkingInGym ||
              trainerType === TrainerTypeEnum.Both
            "
          >
            <base-input
              label="Set the hourly rate (USD $)"
              v-model:value="hourlyRate"
              :error-message="hourlyRateError"
              placeholder="Hourly Rate"
              name="hourlyRate"
              class="form-row__input"
              required
            />
          </div>

          <!-- <div
            class="form-row"
            v-if="
              trainerType === TrainerTypeEnum.Freelancer ||
              trainerType === TrainerTypeEnum.Both
            "
          >
            <base-input
              label="Set the remote hourly rate (USD $)"
              v-model:value="remoteHourlyRate"
              :error-message="remoteHourlyRateError"
              placeholder="Remote Hourly Rate"
              name="remoteHourlyRate"
              class="form-row__input"
              required
            />
          </div> -->

          <div class="form-row">
            <ion-label class="label font-yantramanav">
              Choose the gym if you work in it
            </ion-label>
            <div class="form-row toggle-row">
              <base-toggle
                :value="trainerType === TrainerTypeEnum.WorkingInGym"
                content="I’m working in the gym"
                class="toggle-wrapper"
              />
            </div>
            <choose-block
              title="Choose gym"
              :value="chosenGym?.name"
              @handle-click="openChooseGym"
              :disabled="!workingInGym"
            />
          </div>

          <div class="form-row" @click="goToSchedule">
            <ion-label class="label font-yantramanav">
              Set working schedule
            </ion-label>
            <choose-block title="working schedule" />
          </div>

          <div class="form-row">
            <base-input
              class="form-row__control form-row__input"
              value="EES Sport Certificate 2022"
              placeholder="Enter your certification name"
              label="Add certification"
              required
            />
            <ion-item class="form-row__control certificate-item">
              <ion-label>
                certificate.pdf (64,5 MB)
                <ion-text color="medium"></ion-text>
              </ion-label>
              <ion-icon src="assets/icon/pencil.svg" class="edit__edit-icon" />
              <!-- <ion-icon src="assets/icon/eye.svg" color="light" class="edit__edit-icon"/> -->
              <ion-icon src="assets/icon/trash.svg" class="edit__edit-icon" />
            </ion-item>
          </div>

          <!-- <template v-if="certificates.length">
            <div
              class="form-row"
              v-for="certificate in certificates"
              :key="certificate.id"
            >
              <base-input
                class="form-row__control"
                v-model:value="certificate.title"
                placeholder="Enter your certification name"
                label="Add certification"
                required
              />
              <ion-item
                @click="onEdit(DocumentsTypeEnum.Certificate, certificate.id)"
                class="form-row__control certificate-item"
              >
                <ion-label>
                  {{ certificate.path.split("/")[1] }}
                  <ion-text color="medium"></ion-text>
                </ion-label>
                <ion-icon src="assets/icon/pencil.svg" class="edit__edit-icon" />
                <ion-icon src="assets/icon/eye.svg" color="light" class="edit__edit-icon"/>
                <ion-icon src="assets/icon/trash.svg" class="edit__edit-icon" />
              </ion-item>
            </div>
          </template> -->

          <template v-if="weiverAndLabilities.length">
            <div
              class="form-row"
              v-for="weiverAndLability in weiverAndLabilities"
              :key="weiverAndLability.id"
            >
              <base-input
                class="form-row__control"
                v-model:value="weiverAndLability.title"
                placeholder="Enter your certification name"
                label="Add weiver and labilities"
                required
                :disabled="subscriptionType === SubscriptionsTierEnum.Basic"
              />
              <ion-item
                @click="
                  onEdit(
                    DocumentsTypeEnum.WaiverAndLabilities,
                    weiverAndLability.id
                  )
                "
                class="form-row__control certificate-item"
              >
                <ion-label>
                  {{ weiverAndLability.path.split("/")[1] }}
                  <ion-text color="medium"></ion-text>
                </ion-label>
                <ion-icon
                  src="assets/icon/pencil.svg"
                  class="edit__edit-icon"
                  v-if="subscriptionType !== SubscriptionsTierEnum.Basic"
                />
                <ion-icon
                  src="assets/icon/eye.svg"
                  color="light"
                  class="edit__edit-icon"
                />
                <ion-icon src="assets/icon/trash.svg" class="edit__edit-icon" />
              </ion-item>
            </div>
          </template>

          <div class="certificate-controls">
            <ion-button
              class="primary-outline font-yantramanav"
              fill="outline"
              expand="block"
              @click="role === RoleEnum.Trainer ? onEdit(DocumentsTypeEnum.Certificate, undefined, true) : uploadFile(DocumentsTypeEnum.Certificate)"
            >
              Upload certificate
            </ion-button>
            <ion-button
              class="primary-outline font-yantramanav"
              fill="outline"
              expand="block"
              @click="uploadFile(DocumentsTypeEnum.WaiverAndLabilities)"
            >
              Add waiver or liability
            </ion-button>
          </div>
          <div class="holder-button">
            <ion-button
              class="button--submit font-yantramanav font-bold"
              expand="block"
              @click="handleSubmit"
              :disabled="!isValidForm"
            >
              Save
            </ion-button>
          </div>
        </div>
      </template>
    </base-layout>
  </ion-page>
  <div class="web-trainer-edit" v-else>
    <ion-spinner
      v-if="loading || updateUserLoading"
      name="lines"
      class="spinner"
    />
    <div class="edit" v-else>
      <div class="cards__container">
        <photos-loader
          @upload="uploadPhoto"
          @delete="deletePhoto"
          @change="uploadPhoto"
          :circle-shape="false"
          :photos="media"
          :loading="photoOnLoad"
          :progress="percentPhotoLoaded"
          :disabled="loading || updateUserLoading"
        />
      </div>
      <div class="grid">
        <div class="form-row">
          <base-input
            label="What’s your full name"
            v-model:value="firstName"
            :error-message="firstNameError"
            placeholder="First Name"
            name="firstName"
            class="form-row__input-web"
            required
          />
        </div>

        <div
          class="form-row"
          v-if="
            trainerType === TrainerTypeEnum.WorkingInGym ||
            trainerType === TrainerTypeEnum.Both
          "
        >
          <base-input
            label="Set the hourly rate (USD $)"
            v-model:value="hourlyRate"
            :error-message="hourlyRateError"
            placeholder="Hourly Rate"
            name="hourlyRate"
            class="form-row__input-web"
            required
          />
        </div>

        <div class="form-row">
          <base-input
            class="form-row__control form-row__input-web"
            value="EES Sport Certificate 2022"
            placeholder="Enter your certification name"
            label="Add certification"
            required
          />
          <ion-item class="form-row__control certificate-item">
            <ion-label class="font-lato">
              certificate.pdf (64,5 MB)
              <ion-text color="medium"></ion-text>
            </ion-label>
            <ion-icon src="assets/icon/pencil.svg" class="edit__edit-icon" />
            <!-- <ion-icon src="assets/icon/eye.svg" color="light" class="edit__edit-icon"/> -->
            <ion-icon src="assets/icon/trash.svg" class="edit__edit-icon" />
          </ion-item>
        </div>

        <div class="form-row">
          <base-input
            class="form-row__control form-row__input-web"
            value="Advance Trainer ISSA2022"
            placeholder="Enter your certification name"
            label="Attach waiver or liability form (Compulsory)"
            required
          />
          <ion-item class="form-row__control certificate-item">
            <ion-label>
              certificate.pdf (64,5 MB)
              <ion-text color="medium"></ion-text>
            </ion-label>
            <ion-icon src="assets/icon/pencil.svg" class="edit__edit-icon" />
            <!-- <ion-icon src="assets/icon/eye.svg" color="light" class="edit__edit-icon"/> -->
            <ion-icon src="assets/icon/trash.svg" class="edit__edit-icon" />
          </ion-item>
        </div>

        <div class="form-row">
          <ion-label class="label font-yantramanav label-web">
            Choose the gym if you work in it
          </ion-label>
          <div class="form-row toggle-row">
            <base-toggle
              :value="trainerType === TrainerTypeEnum.WorkingInGym"
              content="I’m working in the gym"
              class="toggle-wrapper"
            />
          </div>
          <choose-block
            title="Choose gym"
            :value="chosenGym?.name"
            @handle-click="openChooseGym"
            :disabled="!workingInGym"
          />
        </div>

        <div class="form-row" @click="goToSchedule">
          <ion-label class="label font-yantramanav label-web"> Set working schedule </ion-label>
          <choose-block title="working schedule" />
        </div>
      </div>

      <div class="certificate-controls">
        <ion-button
          class="primary-outline font-yantramanav"
          fill="outline"
          expand="block"
          @click="uploadFile(DocumentsTypeEnum.Certificate)"
        >
          Upload certificate
        </ion-button>
        <ion-button
          class="primary-outline font-yantramanav"
          fill="outline"
          expand="block"
          @click="uploadFile(DocumentsTypeEnum.WaiverAndLabilities)"
        >
          Add waiver or liability
        </ion-button>
      </div>
      <div class="holder-button-web d-flex align-items-center justify-content-end gap-16">
        <ion-button
          class="secondary font-yantramanav font-bold"
          expand="block"
        >
          Cancel
        </ion-button>
        <ion-button
          class="button--submit font-yantramanav font-bold"
          expand="block"
          @click="handleSubmit"
          :disabled="!isValidForm"
        >
          Save
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonText,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonSpinner,
  actionSheetController,
  toastController,
  modalController,
  ActionSheetController
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import PhotosLoader from "@/general/components/PhotosLoader.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import {
  Document,
  FilePreloadDocument,
  MeDocument,
  SettingsCodeEnum,
  TrainerTypeEnum,
  UpdateUserDocument,
  DocumentsTypeEnum,
  DeleteDocumentDocument,
  DeleteMediaDocument,
  SubscriptionsTierEnum,
RoleEnum,
} from "@/generated/graphql";
import { Browser } from "@capacitor/browser";
import useId from "@/hooks/useId";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { computed, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import { requiredFieldSchema } from "@/validations/authValidations";
import { useField } from "vee-validate";
import { dataURItoFile } from "@/utils/fileUtils";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { v4 as uuidv4 } from "uuid";
import { UploadPdfFile } from "@/ts/types/user";
import { Filesystem } from "@capacitor/filesystem";
import useSubscription from "@/hooks/useSubscription";
import { defineProps, withDefaults } from "vue";
import { Capacitor } from "@capacitor/core";
import WorkingSchedule from "./WorkingSchedule.vue";
import useRoles from "@/hooks/useRole";

const store = useSelectedAddressStore();

const router = useRouter();
const { id } = useId();
const percentFileLoaded = ref<number | undefined>();
const photoOnLoad = ref<boolean>(false);
const percentPhotoLoaded = ref<number | undefined>();
const { role } = useRoles();
const media = ref<
  Array<{
    __typename?: "Media";
    pathUrl?: string;
    path?: string;
    id?: string;
    title?: string;
    url?: string;
  }>
>([]);
const certificates = ref<Array<Document | UploadPdfFile>>([]);
const weiverAndLabilities = ref<Array<Document | UploadPdfFile>>([]);
const workingInGym = computed(() => store.$state.workingInGym);

const { value: firstName, errorMessage: firstNameError } = useField<string>(
  "firstName",
  requiredFieldSchema
);

const { value: lastName, errorMessage: lastNameError } = useField<string>(
  "lastName",
  requiredFieldSchema
);

const { value: hourlyRate, errorMessage: hourlyRateError } = useField<string>(
  "hourlyRate",
  requiredFieldSchema
);

const { value: remoteHourlyRate, errorMessage: remoteHourlyRateError } =
  useField<string>("remoteHourlyRate", requiredFieldSchema);

const { mutate, loading: updateUserLoading } = useMutation(UpdateUserDocument);

const { mutate: deleteDocumentMutate } = useMutation(DeleteDocumentDocument);

const { mutate: deleteMediaMutate } = useMutation(DeleteMediaDocument);

const { onResult, refetch, loading, result } = useQuery(MeDocument, { id });

const props = withDefaults(
  defineProps<{
    isWebView?: boolean;
  }>(),
  {
    isWebView: false,
  }
);

const isNativePlatform = Capacitor.isNativePlatform();

onBeforeRouteLeave((to, from, next) => {
  if (to.name === EntitiesEnum.ChooseGymAccount) {
    store.setEdit(true);
    next();
  } else {
    next();
  }
});

const { type: subscriptionType } = useSubscription();

const chosenGym = computed(() => store.assignedFacility);

const openChooseGym = () => {
  router.push({
    name: EntitiesEnum.ChooseGymAccount,
  });
};

const uploadPhoto = async (photo: string) => {
  const file = dataURItoFile(photo, uuidv4());
  photoOnLoad.value = true;
  percentPhotoLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      media.value = [
        {
          path: res?.data.filePreload.path,
          url: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
          id: `_${uuidv4()}`,
          title: uuidv4(),
        },
        ...media.value,
      ];
      photoOnLoad.value = false;
      percentPhotoLoaded.value = undefined;
    })
    .catch((error) => {
      console.error(error);
      abort();
      photoOnLoad.value = false;
      percentPhotoLoaded.value = undefined;
    });
};

const deletePhoto = (_index: number, id: string) => {
  media.value = media.value?.reduce((acc, cur) => {
    if (cur.id.toString() !== id.toString()) {
      acc.push(cur);
    }
    return acc;
  }, []);

  const isSavedMedia = savedMedia.value?.find(
    (doc: { id: string }) => doc.id.toString() === id.toString()
  );

  if (isSavedMedia) {
    deleteMediaMutate({ id });
  }
};

const goToSchedule = async () => {
  if (isNativePlatform) {
    router.push({
      name: EntitiesEnum.ProfileWorkingSchedule,
    });
  } else {
    const modal = await modalController.create({
      component: WorkingSchedule,
      cssClass: "web-working-schedule",
      componentProps: {
        isFromModal: true,
      },
    });
    await modal.present();
  }
};

onResult(async ({ data }) => {
  const getRate = (key: string) => {
    const rate = data?.me?.settings?.find(
      (setting) => setting.setting?.code === key
    );
    return rate?.value ? (rate.value / 100).toFixed(2) : "0.00";
  };

  firstName.value = data?.me?.first_name || "";
  lastName.value = data?.me?.last_name || "";
  hourlyRate.value = getRate(SettingsCodeEnum.HourlyRate);
  remoteHourlyRate.value = getRate(SettingsCodeEnum.RemoteHourlyRate);
  if (
    (data?.me?.trainer_type === TrainerTypeEnum.WorkingInGym ||
      data?.me?.trainer_type === TrainerTypeEnum.Both) &&
    !store.edit
  ) {
    store.setAssignedFacility(data?.me?.facilities[0]);
  }

  // if (!store.$state.assignedFacility) {
  //   store.setWorkinginGym(true);
  // } else {
  //   console.log('setWorkinginGym: ', data?.me?.trainer_type === TrainerTypeEnum.WorkingInGym || data?.me?.trainer_type === TrainerTypeEnum.Both);
  // }
  store.setWorkinginGym(
    data?.me?.trainer_type === TrainerTypeEnum.WorkingInGym ||
      data?.me?.trainer_type === TrainerTypeEnum.Both
  );

  media.value = data?.me?.media
    ? data?.me?.media.reduce((acc, cur) => {
        acc.push({ ...cur, url: cur.pathUrl });
        return acc;
      }, [])
    : [];
  certificates.value = data?.me?.certificates?.length
    ? [...data.me.certificates]
    : [];
  weiverAndLabilities.value = data?.me?.weiver_and_labilities?.length
    ? [...data.me.weiver_and_labilities]
    : [];
});

const savedCertificates = computed(() =>
  result.value?.me?.certificates ? [...result.value.me.certificates] : []
);
const savedWeiverAndLabilities = computed(() =>
  result.value?.me?.weiver_and_labilities
    ? [...result.value.me.weiver_and_labilities]
    : []
);
const savedMedia = computed(() =>
  result.value?.me?.media
    ? result.value?.me?.media.reduce((acc, cur) => {
        acc.push({ ...cur, url: cur.pathUrl });
        return acc;
      }, [])
    : []
);

const trainerType = computed<TrainerTypeEnum>(
  () => result.value?.me.trainer_type
);

const isValidForm = computed(
  () =>
    !!(
      !firstNameError.value &&
      !lastNameError.value &&
      firstName.value &&
      lastName.value
    )
);

const getMedia = (media, savedMedia) => {
  return media.reduce((acc, cur) => {
    const isMediaSaved = savedMedia?.filter(
      (i: { id: string }) => i.id === cur.id
    );
    if (!isMediaSaved?.length) {
      acc.push({
        file: cur.path,
        title: cur.title,
      });
    }

    return acc;
  }, []);
};

const getDocs = (docs) => {
  return docs.reduce((acc, cur) => {
    if (/^_/.test(cur.id)) {
      acc.push({
        file: cur.path,
        title: cur.title,
      });
    } else {
      acc.push({
        file: cur.path,
        title: cur.title,
        id: cur.id,
      });
    }
    return acc;
  }, []);
};

const getSettings = () => {
  const settings = [];
  if (workingInGym.value) {
    settings.push({
      code: SettingsCodeEnum.HourlyRate,
      value: Number(hourlyRate.value) * 100,
    });
  } else {
    settings.push({
      code: SettingsCodeEnum.RemoteHourlyRate,
      value: Number(remoteHourlyRate.value) * 100,
    });
  }
  return settings;
};

const handleSubmit = () => {
  if (isValidForm.value) {
    const newMedia = getMedia(media.value, savedMedia.value);
    mutate({
      id,
      input: {
        avatar:
          newMedia && getMedia(media.value, savedMedia.value)?.pop()?.file,
        first_name: firstName.value,
        last_name: lastName.value,
        certificates: getDocs(certificates.value),
        weiver_and_labilities: getDocs(weiverAndLabilities.value),
        media: newMedia && getMedia(media.value, savedMedia.value),
        settings: getSettings(),
        facility_id: chosenGym.value?.id,
      },
    })
      .then(async () => {
        const toast = await toastController.create({
          message: "Updated successfully",
          duration: 2000,
          icon: "assets/icon/success.svg",
          cssClass: "success-toast",
        });
        toast.present();
        refetch();
      })
      .catch(async (error) => {
        const toast = await toastController.create({
          message: "Something went wrong. Please try again.",
          icon: "assets/icon/info.svg",
          cssClass: "danger-toast",
        });
        toast.present();

        throw new Error(error);
      });
  }
};

const uploadFile = async (key: DocumentsTypeEnum, id = "") => {
  const result = await FilePicker.pickFiles({
    types: ["application/pdf"],
    multiple: false,
  });
  const file = result.files[0];

  const contents = await Filesystem.readFile({
    path: file.path,
  });

  const convertedfile = dataURItoFile(
    `data:application/pdf;base64,${contents.data}`,
    uuidv4()
  );
  loading.value = true;

  await filePreload({ file: convertedfile })
    .then((res) => {
      if (id) {
        if (key === DocumentsTypeEnum.Certificate) {
          certificates.value.map((doc: Document | UploadPdfFile, idx) => {
            if (doc.id === id) {
              certificates.value[idx] = {
                ...doc,
                path: res?.data?.filePreload?.path,
                pathUrl: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
              };
            }
          });
        } else {
          weiverAndLabilities.value.map(
            (doc: Document | UploadPdfFile, idx) => {
              if (doc.id === id) {
                weiverAndLabilities.value[idx] = {
                  ...doc,
                  path: res?.data?.filePreload?.path,
                  pathUrl: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
                };
              }
            }
          );
        }
      } else {
        if (key === DocumentsTypeEnum.Certificate) {
          certificates.value.push({
            path: res?.data?.filePreload?.path,
            pathUrl: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
            title: file.name.split(".")[0],
            id: `_${uuidv4()}`,
          });
        } else {
          weiverAndLabilities.value.push({
            path: res?.data?.filePreload?.path,
            pathUrl: `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`,
            title: file.name.split(".")[0],
            id: `_${uuidv4()}`,
          });
        }
      }
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      loading.value = false;
    });
};

const onBack = () => {
  store.clearState();
  router.go(-1);
};

const viewFile = (key: DocumentsTypeEnum, id: string) => {
  if (key === DocumentsTypeEnum.Certificate) {
    certificates.value.filter((doc) => doc.id !== id);
    const savedCertificate = savedCertificates.value.find(
      (doc: Document) => doc.id === id
    );

    if (savedCertificate) {
      Browser.open({ url: savedCertificate.pathUrl });
    }
  } else {
    weiverAndLabilities.value.filter((doc) => doc.id !== id);

    const savedWeiverAndLability = savedWeiverAndLabilities.value.find(
      (doc: Document) => doc.id === id
    );

    if (savedWeiverAndLability) {
      Browser.open({ url: savedWeiverAndLability.pathUrl });
    }
  }
};

const deleteFile = (key: DocumentsTypeEnum, id: string) => {
  if (key === DocumentsTypeEnum.Certificate) {
    certificates.value.filter((doc) => doc.id !== id);
    const savedCertificate = savedCertificates.value.find(
      (doc: Document) => doc.id === id
    );

    if (savedCertificate) {
      deleteDocumentMutate({ id }).then(() => {
        refetch();
      });
    }
  } else {
    weiverAndLabilities.value.filter((doc) => doc.id !== id);

    const savedWeiverAndLability = savedWeiverAndLabilities.value.find(
      (doc: Document) => doc.id === id
    );

    if (savedWeiverAndLability) {
      deleteDocumentMutate({ id }).then(() => {
        refetch();
      });
    }
  }
};

enum actionTypesEnum {
  UploadFile = "UPLOAD_FILE",
  ViewFile = "VIEW_FILE",
  DeleteEvent = "DELETE_EVENT",
}

let abort: any;

const { mutate: filePreload } = useMutation(FilePreloadDocument, {
  context: {
    fetchOptions: {
      useUpload: true,
      onProgress: (ev: ProgressEvent) => {
        percentFileLoaded.value = (ev.loaded / ev.total) * 100;
      },
      onAbortPossible: (abortHandler: any) => {
        abort = abortHandler;
      },
    },
  },
});

const onEdit = async (key: DocumentsTypeEnum, id?: string, fromUpload = false) => {
  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: [
      {
        text: "Upload file",
        data: {
          type: actionTypesEnum.UploadFile,
        },
        cssClass: "success-tr-sheet-btn"
      },
      ...(!fromUpload ? [{
        text: "View file",
        data: {
          type: actionTypesEnum.ViewFile,
        },
        cssClass: "success-tr-sheet-btn"
      }]: []),      
      {
        text: "Delete file",
        role: "destructive",
        data: {
          type: actionTypesEnum.DeleteEvent,
        },
        cssClass: "danger-tr-sheet-btn"
      },
      {
        text: "Cancel",
        role: "cancel",
        cssClass: "cancel-tr-sheet-btn"
      },
    ],
  });

  await actionSheet.present();

  const { data } = await actionSheet.onWillDismiss();
  console.log("data====", data);
  
  const type: actionTypesEnum = data?.type;

  const actions = {
    [actionTypesEnum.UploadFile]: () => uploadFile(key, id),
    [actionTypesEnum.ViewFile]: () => viewFile(key, id),
    [actionTypesEnum.DeleteEvent]: () => deleteFile(key, id),
  };

  if (actions[type]) {
    actions[type]();
  }
};
</script>

<style scoped lang="scss">
.edit {
  padding: 24px 24px calc(24px + var(--ion-safe-area-bottom));

  &__edit-icon {
    line-height: 1;
    font-size: 24px;
    margin-left: 16px;
  }
}

.certificate-controls {
  margin-top: 35px;
  .button {
    margin: 0;
    font-size: 14px;

    &:not(:first-child) {
      margin-top: 24px;
    }
  }
}

.holder-button {
  padding-top: 35px;

  .button {
    margin: 0;
  }
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}

.form-row {
  &.toggle-row {
    margin-bottom: 16px;
  }
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.certificate-item {
  --background: var(--gray-700);
  --border-radius: 8px;
  --color: var(--ion-color-white);
  font-weight: 300;
  font-size: 14px;
  line-height: 1.5;
}
.web-trainer-edit {
  .edit {
    padding-top: 0;
    padding-right: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    .base-input-container {
      margin-bottom: 0;
    }
  }
  .certificate-controls {
    margin-top: 24px;
    ion-button {
      width: 327px;
      margin-left: auto;
      margin-right: auto;
    }
  }
}
.holder-button-web {
  ion-button {
    min-width: 90px;
  }
}
.label-web {
  font-family: "Lato";
  color: var(--fitnesswhite);
}
</style>
