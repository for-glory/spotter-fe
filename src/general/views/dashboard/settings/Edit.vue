<template>
    <ion-spinner class="spinner" name="lines" v-if="profileOnDeleting"></ion-spinner>
    <div v-else class="web-profile-edit d-flex">
        <div class="flex-1">
            <div class="d-flex align-items-center page-header">
                <ion-icon src="assets/icon/arrow-back.svg" />
                <ion-title class="banner__title">Settings</ion-title>
            </div>
            <div class="profile-edit hide-scrollbar">
                <div class="profile-edit__options">
                    <ion-spinner class="spinner" name="lines" v-if="loading"></ion-spinner>
                    <template v-else :key="menuItem.name" v-for="menuItem in menu">
                        <choose-block :title="(menuItem.label as string)" :value="settings[menuItem.value]"
                            @click="webItemClick(menuItem.name as EntitiesEnum)" class="profile-edit__option"
                            :is-web-item="true" :item-outline="filter === menuItem.name" v-if="role !== RoleEnum.Trainer ||
                                menuItem.name !== EntitiesEnum.ProfileLocation ||
                                trainerType !== TrainerTypeEnum.WorkingInGym
                                " :disabled="role !== RoleEnum.Trainer && menuItem.name === EntitiesEnum.ProfileOrderConfirmation &&
        subscriptionType !== SubscriptionsTierEnum.Gold
        " />
                    </template>
                    <ChooseBlock class="delete-account" v-if="role === RoleEnum.User" is-web-item title="Delete account"
                        :detail-icon="false" danger-title @handle-click="showModal"/>
                </div>
            </div>
        </div>
        <div class="flex-2 flex-2-side-wrapper">
            <edit-trainer :isWebView="true" v-if="filter === EntitiesEnum.ProfileEditTrainer"></edit-trainer>
            <div v-else class="edit-profile-component d-flex-col h-100">
                <div class="edit-profile-component-content d-flex-col h-100">
                    <component :is="settingsCompo[filter]"></component>
                </div>
            </div>
        </div>
    </div>
    <confirmation :is-visible="showConfirmationModal" title="Do you want delete your account?"
        description="Your account will be lost" button-text="Delete" @discard="onDeleteConfirmed" @decline="hideModal" />
</template>
  
<script setup lang="ts">
import { IonTitle, toastController, IonIcon } from "@ionic/vue";
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
DeleteProfileDocument,
SettingsCodeEnum,
} from "@/generated/graphql";
import useSubscription from "@/hooks/useSubscription";
import { withDefaults, defineProps } from "vue";
import { IonSpinner } from "@ionic/vue";
import EditTrainer from "../../profile/EditTrainer.vue";
import Email from "./Email.vue";
import ChangePassword from "./ChangePassword.vue";

import Languages from "./Languages.vue";
import AppMode from "./AppMode.vue";
import Notifications from "./Notifications.vue";
import OrderConfirmation from "./OrderConfirmation.vue";
import Location from "./Location.vue";
import EditeProfile from "./client/EditProfile.vue";
import Preference from "./client/Preference.vue";
import Pronounce from "./client/Pronounce.vue";
import SocialMedia from "./SocialMedia.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { clearAuthItems } from "@/router/middleware/auth";

withDefaults(
    defineProps<{
        isWebView?: boolean;
    }>(),
    {
        isWebView: false,
    }
);
const { role } = useRoles();

const filter = ref<EntitiesEnum>(role === RoleEnum.Trainer ? EntitiesEnum.ProfileEditTrainer : EntitiesEnum.ProfileEditName);
const previewOnLoading = ref<boolean>(false);
const previewUrl = ref<string>("");
const previewPath = ref<string>("");
const percentLoaded = ref<number | undefined>();
const { showConfirmationModal, hideModal, showModal } = useConfirmationModal();

const router = useRouter();
const route = useRoute();
const { type: subscriptionType } = useSubscription();

const settingsCompo = {
    [EntitiesEnum.ProfileEditName]: EditeProfile,
    [EntitiesEnum.ProfileEmail]: Email,
    [EntitiesEnum.ProfilePassword]: ChangePassword,
    [EntitiesEnum.ProfileLanguages]: Languages,
    [EntitiesEnum.ProfileAppMode]: AppMode,
    [EntitiesEnum.ProfileNotifications]: Notifications,
    [EntitiesEnum.ProfilePreferences]: Preference,
    [EntitiesEnum.ProfileLocation]: Location,
    [EntitiesEnum.ProfilePronounce]: Pronounce,
    [EntitiesEnum.ProfileOrderConfirmation]: OrderConfirmation,
    [EntitiesEnum.ProfileAddSocialLink]: SocialMedia
};
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

const {
  mutate: deleteProfile,
  loading: profileOnDeleting,
  onDone: profileDeleted,
} = useMutation(DeleteProfileDocument);

const onDeleteConfirmed = () => {
  deleteProfile();
  hideModal();
};

profileDeleted(() => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
});

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
            console.error(error);
        });
};

const { onResult, refetch, result, loading } = useQuery(
    MeDocument,
    {},
    { fetchPolicy: "network-only" }
);

onResult(({ data }) => {
  previewUrl.value = data.me.avatarUrl;
  data.me.settings.forEach((e: any)=>{
    if(settings[e.setting.code]){
      settings[e.setting.code] = e.value;
    }
  })
});

const onBack = () => {
    router.go(-1);
};


const menuType =
    role === RoleEnum.OrganizationOwner ||
        role === RoleEnum.FacilityOwner ||
        role === RoleEnum.Manager
        ? EntitiesEnum.Facility
        : role;
const menu = editProfileMenu[menuType];

const webItemClick = (name: EntitiesEnum) => {
    filter.value = name;
};

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
  [SettingsCodeEnum.Language]: "English",
  [SettingsCodeEnum.AppMode]: "System",
  [SettingsCodeEnum.UserPronounce]: "She",
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
        padding-right: 14px;
        position: relative;
        padding-top: 22px;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        &::before {
            content: "";
            border-right: 0.5px solid var(--gold);
            height: 100vh;
            position: absolute;
            right: 0;
            top: 0;
        }
    }

    .flex-2-side-wrapper {
        padding-top: 78px;
        padding-right: 64px;
        padding-bottom: 30px;
        overflow: hidden;

        .web-trainer-edit {
            overflow: auto;
            height: 100%;
        }
    }

    .profile-edit {
        padding: 0;
        overflow: auto;
        padding-bottom: 32px;
    }
}

.page-header {
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

.delete-account {
    margin-top: 20px;
}

.edit-profile-component {
    padding-left: 35px;
    padding-top: 14px;
}
</style>
  