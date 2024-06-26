<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn @back="isConfirmedModalOpen = true" title="Edit gym profile" />
    </template>
    <template #content>
      <ion-spinner name="lines" class="spinner" v-if="loading" />
      <div v-else class="content">
        <gym-form
          ref="gymForm"
          :show-header="false"
          next-button-text="Save"
          @submit="editFacility"
          @on-delete-media="deletePhoto"
          edit
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
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { IonSpinner, toastController } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import GymForm from "@/facilities/components/GymForm.vue";
import { useRoute, useRouter } from "vue-router";
import { useNewFacilityStore } from "../store/new-facility";
import {
  DeleteMediaDocument,
  MeDocument,
  UpdateFacilityDocument,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder";
import { computed } from "@vue/reactivity";
import facility from "@/general/stores/facility";

const router = useRouter();
const route = useRoute();
const store = useNewFacilityStore();
const isConfirmedModalOpen = ref(false);

const gymForm = ref<typeof GymForm | null>(null);

const { onResult, result, loading, refetch } = useQuery(
  MeDocument,
  {},
  {
    fetchPolicy: "no-cache",
  }
);

const { mutate } = useMutation(UpdateFacilityDocument);
const { mutate: deleteMediaMutate } = useMutation(DeleteMediaDocument);

const onBack = () => {
  store.clear();
  router.go(-1);
};

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
      onBack()
  }
};

const deletePhoto = (id: string) => {
  deleteMediaMutate({ id });
};

const id = computed(() => route.query.facilityId || '');

onResult(({ data }) => {
  const curFacility = data.me?.owned_facilities.find(
    (facility) => facility.id === route.query.facilityId
  );
  if (curFacility) {
    store.setAddress(
      curFacility.address?.city.state,
      curFacility.address?.city,
      {
        thoroughfare: curFacility.address?.street,
        subThoroughfare: curFacility.address?.extra,
        latitude: curFacility.address?.lat,
        longitude: curFacility.address?.lng,
      } as NativeGeocoderResult
    );

    const amenities = curFacility?.amenities?.map((option) => {
      return {
        id: option.id,
        label: option.name || "",
        value: option.id || "",
        isChecked: true,
        iconUrl: option.iconUrl || undefined,
      };
    });
    const equipments = curFacility?.equipments?.map((option) => {
      return {
        id: option.id,
        label: option.name || "",
        value: option.id || "",
        isChecked: true,
        iconUrl: option.iconUrl || undefined,
      };
    });
    curFacility.media?.map((option) => {
      store.addPhoto({
        ...option,
        url: option.pathUrl,
      });
    });
    store.setAmenities(amenities);
    store.setDescription(curFacility.description);
    store.setEquipments(equipments);
    store.setTitle(curFacility.name);
  }
});

const editFacility = () => {
  mutate({
    id: id.value,
    input: {
      name: store.$state.title,
      description: store.$state.description,
      address: {
        lat: Number(store.$state.address.address?.latitude),
        lng: Number(store.$state.address.address?.longitude),
        street: store.$state.address.address?.thoroughfare,
        city_id: store.$state.address.city?.id,
        extra: store.$state.address.address?.subThoroughfare,
      },
      media: store.$state.photos.reduce(
        (acc: { title: string; file: string }[], cur) => {
          if (!cur.id) {
            acc.push({
              title: uuidv4(),
              file: cur.path ? cur.path : "",
            });
          }
          return acc;
        },
        []
      ),
      equipments: store.$state.equipments.map((i) => i.id),
      amenities: store.$state.amenities.map((i) => i.id),
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
      // refetch();
      router.back();
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
};
</script>

<style scoped lang="scss">
.content {
  padding: 24px 24px calc(24px + var(--ion-safe-area-bottom));
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
