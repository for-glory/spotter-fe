<template>
  <base-layout :hide-navigation-menu="role !== RoleEnum.Trainer" v-if="!isWebView">
    <template #header>
      <page-header
        back-btn
        :title="isProfile ? 'Edit Profile' : 'Edit gym profile'"
        @back="onBack"
      />
    </template>
    <template #content>
      <div class="profile-edit">
        <div class="profile-edit__photo" v-if="role === RoleEnum.User">
          <photo-loader
            circle-shape
            type="avatar"
            :progress="percentLoaded"
            :loading="previewOnLoading"
            :photo="previewUrl"
            @change="photoSelected"
          />
        </div>
        <div class="profile-edit__options">
          <ion-spinner
            class="spinner"
            name="lines"
            v-if="loading"
          ></ion-spinner>
          <template v-else :key="menuItem.name" v-for="menuItem in menu">
            <choose-block
              :title="menuItem.label"
              :value="settings[menuItem.value]"
              @click="goTo(menuItem.name)"
              class="profile-edit__option"
              v-if="
                role !== RoleEnum.Trainer ||
                menuItem.name !== EntitiesEnum.ProfileLocation ||
                trainerType !== TrainerTypeEnum.WorkingInGym
              "
              :disabled="
                role !== RoleEnum.Trainer && menuItem.name === EntitiesEnum.ProfileOrderConfirmation &&
                subscriptionType !== SubscriptionsTierEnum.Gold
              "
            />
          </template>
        </div>
      </div>
    </template>
  </base-layout>
  <template v-else>
    <div class="web-profile-edit d-flex">
      <div class="flex-1">
        <div class="d-flex align-items-center page-header">
          <ion-icon src="assets/icon/arrow-back.svg" />
          <ion-title class="banner__title">Settings</ion-title>
        </div>
        <div class="profile-edit">
            <div class="profile-edit__options">
              <ion-spinner
                class="spinner"
                name="lines"
                v-if="loading"
              ></ion-spinner>
              <template v-else :key="menuItem.name" v-for="menuItem in menu">
                <choose-block
                  :title="menuItem.label"
                  :value="settings[menuItem.value]"
                  @click="webItemClick(menuItem.name)"
                  class="profile-edit__option"
                  :is-web-item="true"
                  :item-outline="filter === menuItem.name"
                  v-if="
                    role !== RoleEnum.Trainer ||
                    menuItem.name !== EntitiesEnum.ProfileLocation ||
                    trainerType !== TrainerTypeEnum.WorkingInGym
                  "
                  :disabled="
                    role !== RoleEnum.Trainer && menuItem.name === EntitiesEnum.ProfileOrderConfirmation &&
                    subscriptionType !== SubscriptionsTierEnum.Gold
                  "
                />
              </template>
            </div>
          </div>
      </div>
      <div class="flex-2">
        <edit-trainer :isWebView="true" v-if="filter === EntitiesEnum.ProfileEditTrainer"></edit-trainer>
      </div>
    </div>
    <!-- <IonGrid class="web-profile-edit">
      <IonRow>
        <IonCol size="4" class="border">
          <div class="profile-edit">
            <div class="profile-edit__options">
              <ion-spinner
                class="spinner"
                name="lines"
                v-if="loading"
              ></ion-spinner>
              <template v-else :key="menuItem.name" v-for="menuItem in menu">
                <choose-block
                  :title="menuItem.label"
                  :value="settings[menuItem.value]"
                  @click="webItemClick(menuItem.name)"
                  class="profile-edit__option"
                  :is-web-item="true"
                  :item-outline="filter === menuItem.name"
                  v-if="
                    role !== RoleEnum.Trainer ||
                    menuItem.name !== EntitiesEnum.ProfileLocation ||
                    trainerType !== TrainerTypeEnum.WorkingInGym
                  "
                  :disabled="
                    role !== RoleEnum.Trainer && menuItem.name === EntitiesEnum.ProfileOrderConfirmation &&
                    subscriptionType !== SubscriptionsTierEnum.Gold
                  "
                />
              </template>
            </div>
          </div>
        </IonCol>
        <IonCol size="8">
          <edit-trainer :isWebView="true" v-if="filter === EntitiesEnum.ProfileEditTrainer"></edit-trainer>
        </IonCol>
      </IonRow>
    </IonGrid> -->
  </template>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { toastController } from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import useRoles from "@/hooks/useRole";
import { editProfileMenu } from "@/const/edit-profile-menu";
import { dataURItoFile } from "@/utils/fileUtils";
import { v4 as uuidv4 } from "uuid";
import useId from "@/hooks/useId";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  FilePreloadDocument,
  MeDocument,
  RoleEnum,
  TrainerTypeEnum,
  UpdateUserDocument,
  SubscriptionsTierEnum,
} from "@/generated/graphql";
import useSubscription from "@/hooks/useSubscription";
import { withDefaults,defineProps } from "vue";
import { IonSpinner,IonGrid,IonCol,IonRow } from "@ionic/vue";
import EditTrainer  from "./EditTrainer.vue";

const props = withDefaults(
  defineProps<{
    isWebView?: boolean;
  }>(),
  {
    isWebView: false,
  }
);
const filter = ref<EntitiesEnum>(EntitiesEnum.ProfileEditTrainer);
const previewOnLoading = ref<boolean>(false);
const previewUrl = ref<string>("");
const previewPath = ref<string>("");
const percentLoaded = ref<number | undefined>();

const router = useRouter();
const route = useRoute();
const { type: subscriptionType } = useSubscription();

const { id } = useId();

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

const { mutate } = useMutation(UpdateUserDocument);

const removePhoto = () => {
  previewUrl.value = "";
};

const photoSelected = async (value: string): Promise<void> => {
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
          refetch()
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
          console.error(error)
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
      removePhoto();
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
      console.error(error)
    });
};

const { onResult, refetch, result, loading } = useQuery(
  MeDocument,
  {},
  { fetchPolicy: "network-only" }
);

onResult(({ data }) => {
  previewUrl.value = data.me.avatarUrl;
});

const onBack = () => {
  router.go(-1);
};

const { role } = useRoles();

const menuType =
  role === RoleEnum.OrganizationOwner ||
  role === RoleEnum.FacilityOwner ||
  role === RoleEnum.Manager
    ? EntitiesEnum.Facility
    : role;
const menu = editProfileMenu[menuType];

const webItemClick = (name: EntitiesEnum) => {
  filter.value = name;
}

const goTo = (name: EntitiesEnum) => {
  if (route.query.facilityId) {
    router.push({
      name,
      query: {
        facilityId: route.query.facilityId as string,
      },
    });
  } else {
    router.push({
      name,
    });
  }
};

const settings = {
  [EntitiesEnum.Language]: "English",
  [EntitiesEnum.AppMode]: "Dark mode",
};

const isProfile = computed(
  () => role === RoleEnum.User || role === RoleEnum.Trainer
);

const trainerType = computed<TrainerTypeEnum>(
  () => result.value?.me.trainer_type
);
</script>
<style scoped lang="scss">
.profile-edit {
  padding: 24px 24px calc(32px + var(--ion-safe-area-bottom));

  &__photo {
    margin-bottom: 32px;
  }

  &__options {
    display: flex;
    flex-direction: column;
  }

  &__option {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.spinner {
  display: block;
  margin: 30vh auto;
}
.web-profile-edit {
  padding-left: 64px;
  height: 100%;
  .flex-1 {
    flex: 1;
    padding-right: 14px;
    position: relative;
    padding-top: 22px;
    &::before {
      content: "";
      border-right: 0.5px solid var(--gold);
      height: 100vh;
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .flex-2 {
    flex: 2;
    padding-top: 78px;
    padding-right: 64px;
    padding-bottom: 100px;
    overflow: auto;
  }
  .profile-edit {
    padding: 0;
  }
  // .border {
  //   padding-right: 14px;
  //   position: relative;
  //   &::before {
  //     content: "";
  //     border-right: 0.5px solid var(--gold);
  //     height: 100vh;
  //     position: absolute;
  //     margin-top: -82px;
  //     right: 0;
  //   }
  // }
}
.page-header{
  padding-left: 26px;
  margin-bottom: 26px;
  ion-title {
    font-size: 24px;
    padding-left: 7px;
    color: var(--gold);
  }
  ion-icon {
    color: var(--gray-500);
    font-size: 20px;
  }
}
</style>
