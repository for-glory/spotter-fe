<template>
  <ion-modal ref="modal" class="modal" swipeToClose :backdrop-dismiss="true">
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
  </ion-modal>
</template>

<script setup lang="ts">
import { IonButton, IonModal } from "@ionic/vue";
import { useRouter } from "vue-router";
import GymForm from "@/facilities/components/GymForm.vue";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { useMutation } from "@vue/apollo-composable";
import {
  CreateFacilityDocument,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { ref, defineExpose } from "vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import {setSelectedGym } from "@/router/middleware/gymOwnerSubscription";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";

const modal = ref<typeof IonModal | null>(null);

const present = (p?: any) => {
    modal?.value?.$el.present();
};

defineExpose({
    present,
});

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
.modal {
    --ion-backdrop-opacity: 0.6;
    --ion-backdrop-color: var(--ion-color-black);
    --height: 100%;
    --width: 26%;
    justify-content: end !important;
    .form-row {
        &__control {
            &:not(:first-child) {
                margin-top: 16px;
            }
        }
    }

    .inputs-form {
        padding: 26px;

        &--footer-fixed {
            padding-bottom: calc(48px + var(--ion-safe-area-bottom));
        }
    }

    .actions-wrapper {
        display: flex;
        flex-direction: column;
        margin: 0 -8px;
        gap: 16px;

        &--fixed {
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 25;
            position: fixed;
            padding: 0 24px calc(16px + var(--ion-safe-area-bottom));
        }

        ion-button {
            width: 100%;
        }
    }
}
</style>
