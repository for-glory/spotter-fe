<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn @back="onBack" title="Edit gym profile" />
    </template>
    <template #content>
      <ion-spinner name="lines" class="spinner" v-if="loading" />
      <div v-else class="content">
        <gym-form
          ref="gymForm"
          button-text="Save"
          @submit="editFacility"
          @on-delete-media="deletePhoto"
          edit
        />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { IonSpinner, toastController } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
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

const router = useRouter();
const route = useRoute();
const store = useNewFacilityStore();

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

const deletePhoto = (id: string) => {
  deleteMediaMutate({ id });
};

const id = computed(() => result.value?.me?.owned_facilities[0].id);

onResult(({ data }) => {
  const curFacility = data.me?.owned_facilities.filter(
    (facility) => facility.id === route.query.facilityId
  );

  if (curFacility?.length) {
    store.setAddress(
      curFacility[0].address?.city.state,
      curFacility[0].address?.city,
      {
        thoroughfare: curFacility[0].address?.street,
        subThoroughfare: curFacility[0].address?.extra,
        latitude: curFacility[0].address?.lat,
        longitude: curFacility[0].address?.lng,
      } as NativeGeocoderResult
    );

    const amenities = curFacility[0]?.amenities?.map((option) => {
      return {
        id: option.id,
        label: option.name || "",
        value: option.id || "",
        isChecked: true,
        iconUrl: option.iconUrl || undefined,
      };
    });
    const equipments = curFacility[0]?.equipments?.map((option) => {
      return {
        id: option.id,
        label: option.name || "",
        value: option.id || "",
        isChecked: true,
        iconUrl: option.iconUrl || undefined,
      };
    });
    curFacility[0].media?.map((option) => {
      store.addPhoto({
        ...option,
        url: option.pathUrl,
      });
    });
    store.setAmenities(amenities);
    store.setDescription(curFacility[0].description);
    store.setEquipments(equipments);
    store.setTitle(curFacility[0].name);
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
      refetch();
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
