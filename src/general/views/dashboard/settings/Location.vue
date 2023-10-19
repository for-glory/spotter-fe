<template>
  <ComponentBaseLayout title="Location" sub-title="Set your location" @save="handleSubmit">
    <template #content>
      <div class="location-wrapper flex-2">
        <choose-block title="Address" :value="trainerAddress?.street" @handle-click="openLocationModal" :isLightItem="true" />
      </div>
      <ChooseLocationModal ref="chooseLocationModal" title="Address" :is-web-view="true"
        @select="addressSelected" />
    </template>
  </ComponentBaseLayout>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { Address, MeDocument, UpdateUserDocument } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { toastController } from "@ionic/vue";
import { useMutation, useQuery } from "@vue/apollo-composable";

const selectedGym = ref(null);
const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);
const trainerAddress = ref<Address>();
const {id} = useId();

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

const openLocationModal = () => {
  console.log('openLocationModal');
  chooseLocationModal.value?.present({
    title: "Address",
  });
};

onResult((address)=>{
  console.log('address data',address.data.me.address);
  if(address?.data?.me?.address){
    trainerAddress.value = address.data.me.address;
  }
})

const addressSelected = (e: ChooseAddresModalResult) => {
  console.log('selected address', e);
  trainerAddress.value = {
    city: { ...e.city as any },
    street: e.address?.thoroughfare ? e.address?.thoroughfare : e.address?.subThoroughfare,
    lat: Number(e.address?.latitude),
    lng: Number(e.address?.longitude),
    id: e.city?.id as string
  };
};

const handleSubmit = () => {
  mutate({
    id,
    input: {
      address: {
        lat: trainerAddress.value?.lat,
        lng: trainerAddress.value?.lng,
        street: trainerAddress.value?.street,
        city_id: trainerAddress.value?.city?.id,
      },
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
.location-wrapper {
  max-width: 437px;
  margin-top: 25px;
}
</style>