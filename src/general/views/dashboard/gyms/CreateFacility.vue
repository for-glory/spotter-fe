<template>
  <div class="content">
    <gym-form
      ref="gymForm"
      button-text="Create"
      @submit="createNewFacility"
    />
  </div>
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
import { useRouter } from "vue-router";
import GymForm from "@/facilities/components/GymForm.vue";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateFacilityDocument,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { ref } from "vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import {setSelectedGym } from "@/router/middleware/gymOwnerSubscription";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

const router = useRouter();

const isConfirmedModalOpen = ref(false);

const facilityStore = useFacilityStore();

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

const createNewFacility = (data: newFacilityStoreTypes, mode: string) => {
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

facilityCreated((res) => {
  gymForm.value?.clearStore();
  facilityStore.setFacility(res.data?.createFacility);
	setSelectedGym(res.data?.createFacility?.id);
  router.push({
    name: EntitiesEnum.DashboardOverview,
  });
});
</script>

<style lang="scss" scoped>
.content {
  padding: calc(var(--ion-safe-area-top)) 24px
    calc(16px + var(--ion-safe-area-bottom));
}
</style>
