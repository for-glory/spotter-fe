<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Create your gym profile" />
    </template>
    <template #content>
      <div class="content">
        <ion-text>
          To give you a better experience we need to know more about your gym
        </ion-text>
        <gym-form
          ref="gymForm"
          button-text="Next"
          save-and-exit-button
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
import { IonText, IonTitle, IonButton } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRouter } from "vue-router";
import GymForm from "@/facilities/components/GymForm.vue";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateFacilityDocument,
  UpdateFirstSubscriptionDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { setSettings } from "@/hooks/useSettings";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";
import { clearAuthItems } from "@/router/middleware/auth";
import { ref } from "vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

const router = useRouter();

const isConfirmedModalOpen = ref(false);
const actionAfterSiubmit = ref("exit");

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

const { mutate: updateFirstSubscription, onDone: updatedSubscription } = useMutation(
  UpdateFirstSubscriptionDocument
);

const { mutate: createFacility, onDone: facilityCreated } = useMutation(
  CreateFacilityDocument
);

const createNewFacility = (data: newFacilityStoreTypes, mode: string) => {
  const { registration_code } = JSON.parse(
    localStorage.getItem("organization") || "{}"
  );
  actionAfterSiubmit.value = mode;
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

facilityCreated((res) => {
  if (res?.data?.createFacility) {
    updateFirstSubscription({
      input: {
        facility_id: res?.data?.createFacility.id
      },
    });
  }
  localStorage.setItem("first_facility", res?.data?.createFacility.id)
});

updatedSubscription(() => {
  gymForm.value?.clearStore();
  updateSettings();
  if (actionAfterSiubmit.value === "exit") {
    router.push({
      name: EntitiesEnum.DashboardOverview,
    });
  }
  else if(actionAfterSiubmit.value === "create_event") {
    router.push({
      name: EntitiesEnum.RegisterCreateEvent,
      params: { facility_id: localStorage.getItem("first_facility") },
    });
  }
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
  // router.push({
  //   name: EntitiesEnum.Profile,
  // });
});

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>

<style lang="scss" scoped>
.header {
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
}

.content {
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
}

.head {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  text-align: center;
  margin: 0 auto 32px;
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
}
</style>
