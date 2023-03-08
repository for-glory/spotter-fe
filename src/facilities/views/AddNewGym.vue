<template>
  <ion-page ref="page">
    <base-layout hide-navigation-menu>
      <template #header>
        <page-header back-btn @back="onBack" title="Add new gym" />
      </template>
      <template #content>
        <div class="content">
          <gym-form
            ref="gymForm"
            button-text="Create"
            @submit="createNewFacility"
          />
        </div>
      </template>
    </base-layout>
  </ion-page>
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
import { IonPage } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import GymForm from "@/facilities/components/GymForm.vue";
import { useRouter } from "vue-router";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { ref } from "vue";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateFacilityDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { setSettings } from "@/hooks/useSettings";
import { ProfileSettings } from "@/ts/enums/user";
import { EntitiesEnum } from "@/const/entities";
import { newFacilityStoreTypes } from "@/ts/types/store";
import useId from "@/hooks/useId";

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

const { mutate: createFacility, onDone: facilityCreated } = useMutation(
  CreateFacilityDocument
);

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

const gymForm = ref<typeof GymForm | null>(null);
</script>

<style scoped lang="scss">
.content {
  padding: 24px 24px calc(24px + var(--ion-safe-area-bottom));
}
</style>
