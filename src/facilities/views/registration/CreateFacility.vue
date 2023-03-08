<template>
  <base-layout :header-fixed="false" hide-navigation-menu>
    <template #header>
      <page-header @back="onBack" back-btn transparent buttons-transparent />
    </template>
    <template #content>
      <div class="content">
        <div class="head">
          <ion-title class="title" color="primary">
            Let’s create gym profile!
          </ion-title>
          <ion-text color="secondary">
            To give you a better experience we need to know more about your gym
          </ion-text>
        </div>
        <gym-form
          ref="gymForm"
          button-text="Let's start!"
          preview-button
          @submit="createNewFacility"
        />
      </div>
    </template>
  </base-layout>

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
import { IonText, IonTitle } from "@ionic/vue";
import { useRouter } from "vue-router";
import GymForm from "@/facilities/components/GymForm.vue";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateFacilityDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { setSettings } from "@/hooks/useSettings";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";
import { ref } from "vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

const router = useRouter();

const isConfirmedModalOpen = ref(false);

const onBack = () => {
  isConfirmedModalOpen.value = true;
};

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    gymForm.value?.clearStore();
    router.go(-1);
  }
};

const gymForm = ref<typeof GymForm | null>(null);

const { mutate: createFacility, onDone: facilityCreated } = useMutation(
  CreateFacilityDocument
);

const createNewFacility = (data: newFacilityStoreTypes) => {
  const { registration_code } = JSON.parse(
    localStorage.getItem("organization") || "{}"
  );
  createFacility({
    input: {
      name: data.title,
      description: data.description,
      address: {
        lat: Number(data.address.address?.latitude),
        lng: Number(data.address.address?.longitude),
        street: `${data.address.address?.thoroughfare || ""}, ${
          data.address.address?.subThoroughfare || ""
        }`,
        city_id: data.address.city?.id,
      },
      media: data.photos.map((photo, index) => {
        return {
          title: `${data.title}-${index}`,
          file: photo.path,
        };
      }),
      equipments: data.equipments.map((equipment) => equipment.id),
      amenities: data.amenities.map((amenity) => amenity.id),
      registration_code,
    },
  });
};

facilityCreated(() => {
  gymForm.value?.clearStore();
  updateSettings();
});

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

const updateSettings = () => {
  setSettings([{ isFacilitySetUp: true }]);
  const { id } = useId();

  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

settingsUpdated(() => {
  localStorage.removeItem("organization");
  router.push({
    name: EntitiesEnum.Profile,
  });
});
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
}

.content {
  padding: calc(56px + var(--ion-safe-area-top)) 24px
    calc(16px + var(--ion-safe-area-bottom));
}

.head {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 260px;
  text-align: center;
  margin: 0 auto 32px;
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
}
</style>
