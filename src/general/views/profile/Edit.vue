<template>
  <base-layout hide-navigation-menu>
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
                menuItem.name === EntitiesEnum.ProfileOrderConfirmation &&
                subscriptionType !== SubscriptionsTierEnum.Gold
              "
            />
          </template>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
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
import {useToast} from 'vue-toast-notification';

const $toast = useToast();

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
        .then(() => {
          let instance = $toast.success('Image uploaded!', {
            duration: 5000,
            position: 'top'
          });
          refetch()
        })
        .catch((error) => {
          let instance = $toast.error('Image upload failed!', {
            duration: 5000,
            position: 'top'
          });
          console.error(error)
        });
      previewOnLoading.value = false;
      percentLoaded.value = undefined;
    })
    .catch((error) => {
      let instance = $toast.error('Image upload failed!', {
        duration: 5000,
        position: 'top'
      });
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
    .then(() => {
      let instance = $toast.success('Profile Image was deleted!', {
        duration: 5000,
        position: 'top'
      });
      removePhoto();
      refetch();
    })
    .catch((error) => {
      let instance = $toast.error('Action failed!', {
        duration: 5000,
        position: 'top'
      });
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
</style>
