<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Location and Rate" />
    </template>
    <template #content>
      <div class="page">
        <div class="form-row">
          <base-toggle
            :value="useCurrentLocation"
            content="Use my current location"
            @change="currentLocationToggleChanged"
          />
        </div>
        <div class="form-row">
          <ion-label class="label"> Location information</ion-label>
          <!-- <choose-block
            title="State"
            class="form-row__control"
            @handle-click="chooseState"
            :value="selectedState?.name"
            :disabled="useCurrentLocation"
          /> -->
          <!-- <choose-block
            title="City"
            class="form-row__control"
            @handle-click="chooseCity"
            :value="selectedCity?.name"
            :disabled="!selectedState || useCurrentLocation"
          /> -->
          <!-- <choose-block
            title="Address"
            class="form-row__control"
            @handle-click="chooseAddress"
            :disabled="!selectedCity || useCurrentLocation"
            :value="
              selectedAddress
                ? `${selectedAddress.thoroughfare} ${selectedAddress.subThoroughfare}`
                : ''
            "
          /> -->
          <div class="address-container">
            <ion-text class="address-content">
              Address
            </ion-text>
            <ion-text class="address-content" v-if="selectedAddress?.thoroughfare">
              {{ `${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}` }},
              {{ `${selectedAddress?.locality}` }},
              {{ `${selectedAddress?.administrativeArea}` }},
              {{ `${selectedAddress?.countryName}` }}
            </ion-text>
          </div>
          <GMapAutocomplete
              placeholder="Enter your address"
              class="search-form__control"
              :class="{
                'search-form__control--on-focus': isFocused,
              }"
              @place_changed="setPlace"
            >
          </GMapAutocomplete>
        </div>
        <div class="form-row">
          <ion-label class="label">
            Please set your travel or distance radius (1-15 miles)
          </ion-label>
          <wheel-picker :options="startTimeOptions" name="radiusDistance">
            <template #button>
              <choose-block
                title="Choose your travel radius"
                @handle-click="openPicker('radiusDistance')"
                :value="travelRadius ? `${travelRadius} miles` : ''"
              />
            </template>
          </wheel-picker>
        </div>
        <div class="form-row">
          <ion-label class="label">
            Set your hourly rate for mobile training where you go to the client"
            (USD $)
          </ion-label>
          <base-input
            type="number"
            placeholder="Hourly Rate"
            v-model:value="remoteHourlyRate"
            @change="remoteHourlyRateChange"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="holder-button">
        <ion-button
          expand="block"
          @click="saveAddress"
          :disabled="
            loading ||
            travelRadius === null ||
            !remoteHourlyRate?.length ||
            (!useCurrentLocation && !selectedAddress) ||
            (useCurrentLocation && !userCurrentLocation)
          "
        >
          Next
        </ion-button>
      </div>
    </template>
  </base-layout>
  <choose-address-modal ref="chooseAddressModal" @select="addressSelected" />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonLabel,
  PickerColumnOption,
  toastController,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { Emitter, EventType } from "mitt";
import { inject, ref, computed } from "vue";
import { distance } from "@/const/distance";
import { EntitiesEnum } from "@/const/entities";
import ChooseAddressModal from "@/general/components/ChooseAddressModal.vue";
// import { State, IState, City, ICity } from "country-state-city";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { Geolocation, Position } from "@capacitor/geolocation";
import { PositionLatLng } from "@/ts/types/map";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import {
  CitiesDocument,
  City,
  SettingsCodeEnum,
  State,
  TrainerTypeEnum,
  UpdateTrainerTypeDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { setSettings } from "@/hooks/useSettings";
import { ProfileSettings } from "@/ts/enums/user";
import {
  NativeGeocoder,
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";

const router = useRouter();

const chooseAddressModal = ref<typeof ChooseAddressModal | null>(null);
const selectedState = ref<State | null>(null);
const selectedCity = ref<City | null>(null);
const selectedAddress = ref<NativeGeocoderResult | null>(null);

const onBack = () => {
  store.clearState();
  router.go(-1);
};

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter"); // Inject `emitter`

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

const distances = distance();

const radiusPickerColums = [
  {
    name: "radius",
    options: distances,
  },
  {
    name: "unit",
    options: [
      {
        text: "MIL",
        value: "miles",
      },
    ],
  },
];

const startTimeOptions = {
  columns: radiusPickerColums,
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Select radius",
      handler: (value: PickerColumnOption) => {
        travelRadiusChange(value.radius?.value);
      },
    },
  ],
};

const chooseState = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.State,
    title: "Select state",
    selected: selectedState.value?.id,
  });
};

const chooseCity = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.City,
    title: "Select city",
    selected: selectedCity.value?.id,
    state: selectedState.value,
  });
};

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
const setPlace = (res: any) => {
  if (res) {
    selectedAddress.value = gmapObjToNativeGeocoderResultObject(res)
  }
}

const chooseAddress = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.Address,
    title: "Choose your address",
    selected: selectedAddress.value?.latitude
      ? {
          lat: Number(selectedAddress.value?.latitude),
          lng: Number(selectedAddress.value?.longitude),
        }
      : null,
    state: selectedState.value,
    city: selectedCity.value,
  });
};

const addressSelected = async (selected: ChooseAddresModalResult) => {
  selectedState.value = selected.state;
  selectedCity.value = selected.city;
  selectedAddress.value = selected.address;
};

const store = useSelectedAddressStore();

const remoteHourlyRate = computed(() =>
  store.remoteHourlyRate ? String(store.remoteHourlyRate / 100) : ""
);
const remoteHourlyRateChange = (value: string) => {
  store.setRemoteHourlyRate(Number(value) * 100);
};

const travelRadius = computed(() => store.travelRadius);
const travelRadiusChange = (value: number | null) => {
  store.setTravelRadius(value);
};

const userCurrentLocation = ref<PositionLatLng>();
const useCurrentLocation = computed(() => {
  const useTrainerLocation = store.useTrainerLocation;
  if (useTrainerLocation) {
    getUserLocation();
  }
  return useTrainerLocation;
});
const getUserLocation = async () => {
  try {
    const myPosition: Position = await Geolocation.getCurrentPosition();
    userCurrentLocation.value = {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude,
    };
  } catch (error) {
    store.setUseTrainerLocation(false);
    const toast = await toastController.create({
      message:
        "Failed to get your location. Check the permissions for the application.",
      duration: 2000,
      icon: "assets/icon/info.svg",
      cssClass: "warning-toast",
    });
    toast.present();
    Geolocation.requestPermissions();
  }
};
const currentLocationToggleChanged = async (isCurrentLocation: boolean) => {
  store.setUseTrainerLocation(isCurrentLocation);
};

const {
  loading,
  mutate: updateTrainerType,
  onDone: afterTrainerTypeUpdated,
} = useMutation(UpdateTrainerTypeDocument);

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);

getCities();

const saveAddress = async () => {
  const { id } = useId();
  const options = {
    id,
    trainer_type: TrainerTypeEnum.Freelancer,
    settings: [
      {
        code: SettingsCodeEnum.UsePhoneLocation,
        value: useCurrentLocation.value,
      },
      {
        code: SettingsCodeEnum.TrainerRemoteDistance,
        value: travelRadius.value,
      },
      {
        code: SettingsCodeEnum.RemoteHourlyRate,
        value: Number(remoteHourlyRate.value) * 100,
      },
    ],
  };
  if (!useCurrentLocation.value) {
    if (selectedAddress.value?.locality) {
      getCityByName({
        first: 15,
        name: selectedAddress.value?.locality,
        state_code: selectedAddress.value?.administrativeArea,
      })?.then(async (res) => {
        const res_city = res.data.cities.data[0];
        if (res_city) {
          const address = {
            lat: Number(selectedAddress.value?.latitude),
            lng: Number(selectedAddress.value?.longitude),
            street: `${res_city.thoroughfare} ${res_city.subThoroughfare}`,
            extra: "",
            city_id: res_city.id,
          };

          updateTrainerType({
            ...options,
            address,
          });
        }
      });
    }
    
  } else {
    const address = {
      ...userCurrentLocation.value,
      extra: "",
    };
    if (userCurrentLocation.value?.lat && userCurrentLocation.value.lng) {
      NativeGeocoder.reverseGeocode(
        userCurrentLocation.value.lat,
        userCurrentLocation.value.lng,
        {
          useLocale: false,
          maxResults: 5,
        }
      )
        .then((addresses: NativeGeocoderResult[]) => {
          const city = addresses[0];
          if (city?.locality) {
            getCityByName({
              first: 15,
              name: city.locality,
              state_code: city.administrativeArea,
            })?.then(async (res) => {
              const res_city = res.data.cities.data[0];
              if (res_city) {
                updateTrainerType({
                  ...options,
                  ...address,
                  city_id: res_city.id,
                  street: `${res_city.thoroughfare} ${res_city.subThoroughfare}`,
                });
              } else {
                const toast = await toastController.create({
                  message:
                    "Your address is outside the area. Try to choose manually.",
                  duration: 2000,
                  icon: "assets/icon/info.svg",
                  cssClass: "warning-toast",
                });
                toast.present();
                store.setUseTrainerLocation(false);
              }
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const toast = await toastController.create({
        message: "Something went wrong. Try again.",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
      getUserLocation();
    }
  }
};

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

afterTrainerTypeUpdated(() => {
  setSettings([{ isAddressSelected: true }]);

  const { id } = useId();
  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
});

settingsUpdated(() => {
  store.clearState();
  router.push({ name: EntitiesEnum.TrainersExtraPersonal });
});
</script>

<style scoped lang="scss">
.page {
  padding: 24px 24px 16px;
}

.holder-button {
  padding: 16px 24px calc(32px + var(--ion-safe-area-bottom));

  .button {
    margin: 0;
  }
}

.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
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
</style>
