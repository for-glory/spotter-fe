<template>
  <ComponentBaseLayout title="Edit profile" @save="onSubmit" :disabled="!isValidForm">
    <template #content>
      <div class="edit-profile">
        <photo-loader web-img circle-shape type="avatar" :progress="percentLoaded" :loading="previewOnLoading"
          :photo="previewUrl" @change="photoSelected" />
        <div class="form-row">
          <base-input label="First Name" v-model:value="firstName" :error-message="firstNameError"
            placeholder="First Name" name="firstName" class="form-row__control form-row__input" required />
          <base-input label="Last Name" v-model:value="lastName" :error-message="lastNameError" placeholder="Last Name"
            name="lastName" class="form-row__control form-row__input" required />
        </div>
      </div>
    </template>
  </ComponentBaseLayout>
</template>

<script setup lang="ts">
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { FilePreloadDocument, MeDocument, UpdateUserDocument } from "@/generated/graphql";
import { computed, ref } from "vue";
import { dataURItoFile } from "@/utils/fileUtils";
import { toastController } from "@ionic/vue";
import { v4 as uuidv4 } from "uuid";
import useId from "@/hooks/useId";
import { useField } from "vee-validate";
import { requiredFieldSchema } from "@/validations/authValidations";
import ComponentBaseLayout from "../ComponentBaseLayout.vue";

const previewUrl = ref<string>("");
const previewOnLoading = ref<boolean>(false);
const previewPath = ref<string>("");
const percentLoaded = ref<number | undefined>();
let abort: any;


const { value: firstName, errorMessage: firstNameError } = useField<string>(
  "firstName",
  requiredFieldSchema
);

const { value: lastName, errorMessage: lastNameError } = useField<string>(
  "lastName",
  requiredFieldSchema
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

const { onResult, refetch, result, loading } = useQuery(
  MeDocument,
  {},
  { fetchPolicy: "network-only" }
);

onResult(({ data }) => {
  console.log("data", data);

  previewUrl.value = data.me.avatarUrl;
  firstName.value = data?.me?.first_name || "";
  lastName.value = data?.me?.last_name || "";
});
const { mutate } = useMutation(UpdateUserDocument);
const { id } = useId();

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

const photoSelected = async (value: any): Promise<void> => {
  if (!value?.length) {
    deletePhoto();
    return;
  }
  const file = dataURItoFile(value, uuidv4());
  previewOnLoading.value = true;
  percentLoaded.value = 0;
  await filePreload({ file })
    .then((res) => {
      previewPath.value = res?.data.filePreload.path;
      previewUrl.value = `${process.env.VUE_APP_MEDIA_URL}${res?.data.filePreload.path}`;
      mutate({
        id,
        input: {
          avatar: res?.data.filePreload.path,
        },
      })
        .then(async () => {
          const toast = await toastController.create({
            message: "Image uploaded!",
            duration: 2000,
            icon: "assets/icon/success.svg",
            cssClass: "success-toast",
          });
          toast.present();
          refetch();
        })
        .catch(async (error) => {
          const toast = await toastController.create({
            message:
              "Image upload failed!",
            duration: 2000,
            icon: "assets/icon/info.svg",
            cssClass: "warning-toast",
          });
          toast.present();
          console.error(error);
        });
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
    })
    .catch(async (error) => {
      const toast = await toastController.create({
        message:
          "Image upload failed!",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
      console.error(error);
      abort();
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
    });
};

const onSubmit = () => {
  if (!isValidForm) {
    return;
  }
  mutate({
    id,
    input: {
      first_name: firstName.value,
      last_name: lastName.value,
    },
  }).then(async () => {
    const toast = await toastController.create({
      message: "Profile successfully updated!",
      duration: 2000,
      icon: "assets/icon/success.svg",
      cssClass: "success-toast",
    });
    toast.present();
    refetch();
  }).catch(async (error) => {
    const toast = await toastController.create({
      message:
        "Profile updated failed!",
      duration: 2000,
      icon: "assets/icon/info.svg",
      cssClass: "warning-toast",
    });
    toast.present();
    console.error(error);
  });
};

const deletePhoto = () => {
  mutate({
    id,
    input: {
      avatar: null,
    },
  })
    .then(async () => {
      const toast = await toastController.create({
        message: "Profile Image was deleted!",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      previewUrl.value = "";
      refetch();
    })
    .catch(async (error) => {
      const toast = await toastController.create({
        message:
          "Action failed!",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
      console.error(error);
    });
};
</script>

<style scoped lang="scss">
.edit-profile {
  margin-top: 32px;
  flex: 2;
}
</style>
