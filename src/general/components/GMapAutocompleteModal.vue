<template>
  <ion-modal ref="chooseModal">
    <page-header @back="cancel" back-btn title="Select Address" />
    <div class="gmap-modal">
      <GMapAutocomplete
        placeholder="Enter your address"
        class="gmap-modal__control"
        :class="{
          'gmap-modal__control--on-focus': isFocused,
        }"
        @place_changed="setPlace"
      >
      </GMapAutocomplete>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonModal,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import { defineExpose, defineEmits, ref } from "vue";
import { Capacitor } from '@capacitor/core';
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { EntitiesEnum } from "@/const/entities";
import { MapStyles } from "@/constants/map-styles";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import {
  NativeGeocoder,
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import { PositionLatLng } from "@/ts/types/map";
import {
  City,
  State,
  StatesDocument,
  CitiesDocument,
} from "@/generated/graphql";
import { useLazyQuery } from "@vue/apollo-composable";
import { useRoute } from "vue-router";

const route = useRoute();

const chooseModal = ref<typeof IonModal | null>(null);
const selectedState = ref<State | null>(null);
const selectedCity = ref<City | null>(null);
const selectedAddress = ref<NativeGeocoderResult | null>(null);

const props = withDefaults(defineProps<{
    store?:any,
    forAddress?:boolean,
    isWebView?:boolean
  }>(),  {
    forAddress: false,
    isWebView: false
  });

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);
getCities();

const present = () => {
  chooseModal?.value?.$el.present();
};

const setPlace = (place: any) => {
  if (place) {
    console.log("selected place", selectedState.value, selectedCity.value, selectedAddress.value)
    const address = gmapObjToNativeGeocoderResultObject(place);

    if (address.locality) {
      getCityByName({
        first: 15,
        name: address.locality,
        state_code: address.administrativeArea,
      })?.then(async (res) => {
        const res_city = res.data.cities.data[0];
        console.log("selected city", res_city)
        props.store.setAddress(res_city.state, res_city, address);
        const venueAddress = {
          state:res_city.state,
           city: res_city,
           address: address
        }
        localStorage.setItem("venueAddress", JSON.stringify(venueAddress))
        console.log({ res_city });
      });
      chooseModal?.value?.$el.dismiss();
    }
  }
}

const cancel = () => {
  chooseModal?.value?.$el.dismiss();
}
const gmapObjToNativeGeocoderResultObject = (gmObj: any) => {
  let street_number =''
  let route =''
  const address:NativeGeocoderResult = {
    latitude: gmObj.geometry.location.lat().toString(),
    longitude: gmObj.geometry.location.lng().toString(),
    countryCode: '',
    countryName: '',
    postalCode: '',
    administrativeArea: '',
    subAdministrativeArea: '',
    locality: '',
    subLocality: '',
    thoroughfare: '',
    subThoroughfare: '',
    areasOfInterest: []
  }
  for (let i=0; i < gmObj.address_components.length; i++)
  {
    if(gmObj.address_components[i].types.includes("postal_code"))
    {
      address.postalCode = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("locality"))
    {
      address.locality = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("subLocality"))
    {
      address.subLocality = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("country"))
    {
      address.countryName = gmObj.address_components[i].long_name;
      address.countryCode = gmObj.address_components[i].short_name;
    }
    if(gmObj.address_components[i].types.includes("administrative_area_level_1"))
    {
      address.administrativeArea = gmObj.address_components[i].short_name;
    }
    if(gmObj.address_components[i].types.includes("administrative_area_level_2"))
    {
      address.subAdministrativeArea = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("street_number"))
    {
      street_number = gmObj.address_components[i].long_name;
    }
    if(gmObj.address_components[i].types.includes("route"))
    {
      route = gmObj.address_components[i].long_name;
    }
  }
  address.thoroughfare = street_number + " " + route
  return address;
}

defineExpose({
  present,
});

</script>

<style scoped lang="scss">
.gmap-modal {
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;

  &--on-focus {
    background-color: var(--gray-800);
  }

  &__control {
    border: 1px solid #ffffff99;
    margin-top: 10px;
    padding: 0;
    width: 100%;
    z-index: 15;
    transition: right 0.35s ease;
    padding: 15px 20px 12px 20px;
    background: var(--gray-800);
    border-radius: var(--border-radius);
    --border-radius: 8px;
    --color: var(--ion-color-white);
    --placeholder-opacity: 1;
    --background: var(--gray-700);
    --placeholder-font-weight: 300;
    --placeholder-color: var(--gray-500);
    --box-shadow: inset 0 0 0 0.8px var(--gray-600);
  }
}
</style>
