<template>
  <ion-modal ref="chooseModal" class="modal hide-scrollbar" :class="{ 'web-location-modal': isWebView }" swipeToClose
    cssClass="auto-height">
    <div class="modal__content" :class="{ 'address-content-tr': forAddress }">
      <span v-if="!isWebView" class="modal__closed"></span>
      <ion-label class="modal__title">
        {{ title || "Location" }}
      </ion-label>
      <template v-if="type !== EntitiesEnum.Address">
        <template v-if="forAddress">
          <search-form placeholder="Enter address name" :no-padding="role === RoleEnum.User ? true : false"
            :extra-padding="false" hide-results hidden-cancel></search-form>
          <div class="address-list hide-scrollbar">
            <ion-item lines="full">
              <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
              <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
            </ion-item>
            <ion-item lines="full">
              <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
              <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
            </ion-item>
            <ion-item lines="full">
              <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
              <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
            </ion-item>

            <template v-if="isWebView">
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item><ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
              <ion-item lines="full">
                <ion-icon slot="start" src="/assets/icon/location.svg"></ion-icon>
                <div class="address">315 south 7th street, newark, New Jersey <span class="blold"> USA</span> </div>
              </ion-item>
            </template>
          </div>
        </template>
        <template v-else>
          <div class="address-container" v-if="role !== RoleEnum.Trainer">
            <ion-text class="address-content">
              Enter address name
            </ion-text>
            <ion-text class="address-content" v-if="selectedAddress?.thoroughfare">
              {{ `${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}` }},
              {{ `${selectedAddress?.locality}` }},
              {{ `${selectedAddress?.administrativeArea}` }},
              {{ `${selectedAddress?.countryName}` }}
            </ion-text>
          </div>
          <GMapAutocomplete placeholder="Enter your address" class="search-form__control" :class="{
            'search-form__control--on-focus': isFocused,
          }" @place_changed="setPlace">
          </GMapAutocomplete>
        </template>
      </template>
    </div>
  </ion-modal>
  <confirmation :is-visible="showConfirmationModal" title="Are you sure you select the right address?" description=""
    button-text="Yes, I'm sure" @discard="onAddressConfirmed" @decline="hideModal" />
</template>

<script setup lang="ts">
import {
  IonModal,
  IonLabel,
  IonItem,
  IonIcon
} from "@ionic/vue";
import { defineExpose, defineEmits, ref } from "vue";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { EntitiesEnum } from "@/const/entities";
import {
  City,
  State,
  CitiesDocument,
  RoleEnum,
} from "@/generated/graphql";
import {
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import { useLazyQuery } from "@vue/apollo-composable";
import { useNewFacilityStore } from "../store/new-facility";
import { useNewEventStore } from "@/general/stores/new-event";
import { useRoute } from "vue-router";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import useRoles from "@/hooks/useRole";

const route = useRoute();

const chooseModal = ref<typeof IonModal | null>(null);
const selectedState = ref<State | null>(null);
const selectedCity = ref<City | null>(null);
const selectedAddress = ref<NativeGeocoderResult | null>(null);
const store = route.params.type === 'event' ? useNewEventStore() : useNewFacilityStore();

withDefaults(defineProps<{
    title?:string,
    forAddress?:boolean,
    isWebView?:boolean
  }>(),  {
    forAddress: false,
    isWebView: false
  });

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "select", selected?: ChooseAddresModalResult, type?: EntitiesEnum): void;
}>();

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);
getCities();
const { role } = useRoles();
const present = () => {
  chooseModal?.value?.$el.present();
};

const setPlace = (place: any) => {
  if (place) {
    console.log("selected place", selectedState.value, selectedCity.value, selectedAddress.value);
    const address = gmapObjToNativeGeocoderResultObject(place);

    if (address.locality) {
      getCityByName({
        first: 2,
        name: address.locality,
        state_code: address.administrativeArea,
      })?.then(async (res) => {
        const res_city = res.data.cities.data[0];
        console.log("selected city", res_city);
        store.setAddress(res_city?.state, res_city, address);
        const venueAddress = {
          state: res_city?.state,
          city: res_city,
          address: address
        };
        localStorage.setItem("venueAddress", JSON.stringify(venueAddress));
        console.log({ res_city });
        emits('select', store.address);
      });
      chooseModal?.value?.$el.dismiss();
    }
  }
};
const gmapObjToNativeGeocoderResultObject = (gmObj: any) => {
  let street_number = '';
  let route = '';
  const address: NativeGeocoderResult = {
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
  };
  for (let i = 0; i < gmObj.address_components.length; i++) {
    if (gmObj.address_components[i].types.includes("postal_code")) {
      address.postalCode = gmObj.address_components[i].long_name;
    }
    if (gmObj.address_components[i].types.includes("locality")) {
      address.locality = gmObj.address_components[i].long_name;
    }
    if (gmObj.address_components[i].types.includes("subLocality")) {
      address.subLocality = gmObj.address_components[i].long_name;
    }
    if (gmObj.address_components[i].types.includes("country")) {
      address.countryName = gmObj.address_components[i].long_name;
      address.countryCode = gmObj.address_components[i].short_name;
    }
    if (gmObj.address_components[i].types.includes("administrative_area_level_1")) {
      address.administrativeArea = gmObj.address_components[i].short_name;
    }
    if (gmObj.address_components[i].types.includes("administrative_area_level_2")) {
      address.subAdministrativeArea = gmObj.address_components[i].long_name;
    }
    if (gmObj.address_components[i].types.includes("street_number")) {
      street_number = gmObj.address_components[i].long_name;
    }
    if (gmObj.address_components[i].types.includes("route")) {
      route = gmObj.address_components[i].long_name;
    }
  }
  address.thoroughfare = street_number + " " + route;
  return address;
};

defineExpose({
  present,
});

</script>

<style scoped lang="scss">
.modal {
  --ion-backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  &__content {
    background: var(--gray-800);
    border-radius: 18px 18px 0 0;
    padding: 24px 16px calc(16px + var(--ion-safe-area-bottom));
    min-height: 500px;
  }

  &__closed {
    top: 12px;
    left: 50%;
    width: 48px;
    height: 4px;
    display: block;
    border-radius: 2px;
    margin-left: -24px;
    position: absolute;
    background: rgba(var(--ion-color-dark-contrast-rgb), 0.12);
  }

  &__title {
    display: block;
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  .calendar {
    margin-bottom: 16px;
  }

  .choose-btn {
    margin: 0 8px;
  }
}

.content {
  height: calc(100% - 48px - 65px - var(--ion-safe-area-top));
  min-height: 400px;
  --padding-bottom: calc(80px + var(--ion-safe-area-bottom));
}

.select-button {
  bottom: 0;
  width: 100%;
  padding-bottom: calc(var(--ion-padding) + var(--ion-safe-area-bottom));

  &--filled {
    left: 0;
    right: 0;
    bottom: 0;
    position: absolute;
    backdrop-filter: blur(10px);
    background: rgba(var(--ion-color-gray-900-rgb), 0.88);
  }

  p {
    margin: 0 0 12px;
    text-align: center;
  }

  .button {
    margin: 0;
  }
}

.search-form {
  position: relative;
  padding: calc(16px + var(--ion-safe-area-top)) 24px 0;
  justify-content: flex-end;
  transition: background-color 0.35s ease;

  &--on-focus {
    background-color: var(--gray-800);
  }

  &__control {
    border: 1px solid;
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

.address-container {
  display: flex;
  min-height: 48px;
  flex-direction: row;
  border-radius: 8px;
  align-items: center;
  padding: 8px 16px 8px;
  background: var(--gray-700);
  justify-content: space-between;
}

.address-content {
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
}

.address-content-tr {
  padding: 24px 24px calc(16px + var(--ion-safe-area-bottom)) !important;

  .modal__title {
    color: #FFF;
    font-family: Yantramanav;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
  }

  .address-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-top: 15px;

    ion-item {

      &::part(native) {
        border-bottom: 0.8px solid var(--gray-600);
      }

      ion-icon {
        color: var(--gray-500);
        margin-inline-end: 12px;
      }

      .address {
        font-family: Lato;
        font-size: 14px;
        font-style: normal;
        font-weight: 300;
        line-height: 150%;
        color: var(--grey-text);

        span {
          font-weight: 500;
        }
      }
    }
  }
}

.web-location-modal {
  align-items: center;
  --width: 375px;
  --height: 100%;

  &::part(content) {
    max-height: 531px;
  }

  .modal__content {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }

  .address-list {
    overflow: auto;
    height: 100%;

    ion-item {
      min-height: 51px;
    }
  }
}
</style>
