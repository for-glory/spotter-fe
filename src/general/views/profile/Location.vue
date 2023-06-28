<template>
  <base-layout>
    <template #header>
      <page-header
        back-btn
        :title="
          isFreelancer ||
          role !== RoleEnum.Manager ||
          role !== RoleEnum.FacilityOwner ||
          role !== RoleEnum.OrganizationOwner
            ? 'Location'
            : 'Choose my location'
        "
        @back="onBack"
        class="header"
      />
    </template>
    <template #content>
      <ion-spinner v-if="meLoading" class="spinner" name="lines" />
      <div class="page" v-else>
        <template v-if="role !== RoleEnum.Trainer || isFreelancer">
          <div
            class="form-row"
            v-if="
              role !== RoleEnum.Manager &&
              role !== RoleEnum.FacilityOwner &&
              role !== RoleEnum.OrganizationOwner
            "
          >
            <base-toggle
              :value="useMyPhoneLocation"
              :loading="gettingUserLocation"
              content="Use my phone location"
              @change="onPhoneLocationChecked"
            />
          </div>
          <div class="form-row">
            <ion-label
              class="label"
              v-if="
                role !== RoleEnum.Manager &&
                role !== RoleEnum.FacilityOwner &&
                role !== RoleEnum.OrganizationOwner
              "
            >
              Location information
            </ion-label>
            <!-- <choose-block
              title="State"
              class="form-row__control"
              @handle-click="chooseState"
              :value="selectedState?.name"
              :disabled="useMyPhoneLocation"
            /> -->
            <!-- <choose-block
              title="City"
              class="form-row__control"
              @handle-click="chooseCity"
              :value="selectedCity?.name"
              :disabled="!selectedState || useMyPhoneLocation"
            /> -->
            <choose-block
              title="Address"
              class="form-row__control"
              @handle-click="chooseAddress"
              :disabled="useMyPhoneLocation"
              :value="
                selectedAddress
                  ? `${selectedAddress.thoroughfare} ${selectedAddress.subThoroughfare}`
                  : ''
              "
            />
          </div>
          <div class="form-row" v-if="role === RoleEnum.Trainer">
            <ion-label class="label">
              Please set your travel or distance radius (1-15 miles)
            </ion-label>
            <wheel-picker :options="startTimeOptions" name="radiusDistance">
              <template #button>
                <choose-block
                  title="Select radius"
                  @handle-click="openPicker('radiusDistance')"
                  :value="radiusDistance ? `${radiusDistance} miles` : ''"
                />
              </template>
            </wheel-picker>
          </div>
        </template>
        <template v-else>
          <div class="form-row">
            <choose-block
              :value="chosenGym?.name ?? ''"
              @handle-click="openChooseGym"
              title="Facility I work out of"
            />
          </div>

          <div class="form-row">
            <base-toggle v-model:value="isMobile" content="Are you mobile" />
          </div>

          <div class="form-row">
            <ion-label class="label">
              Please set your travel or distance radius (1-15 miles)
            </ion-label>
            <wheel-picker :options="startTimeOptions" name="radiusDistance">
              <template #button>
                <choose-block
                  title="Select radius"
                  @handle-click="openPicker('radiusDistance')"
                  :value="radiusDistance ? `${radiusDistance} miles` : ''"
                />
              </template>
            </wheel-picker>
          </div>
        </template>
      </div>
    </template>
    <template #footer>
      <buttons-footer
        main-button-text="Save"
        @click="saveAddress"
        :disabled="disabledSaveBtn || loading"
      />
    </template>
  </base-layout>

  <choose-address-modal ref="chooseAddressModal" @select="addressSelected" />
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { Geolocation, Position } from "@capacitor/geolocation";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import ButtonsFooter from "@/general/components/blocks/footers/ButtonsFooter.vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import ChooseAddressModal from "@/general/components/ChooseAddressModal.vue";
import { computed, inject, onMounted, ref } from "vue";
import {
  toastController,
  IonLabel,
  PickerColumnOption,
  IonSpinner,
} from "@ionic/vue";
import { distance } from "@/const/distance";
import { Emitter, EventType } from "mitt";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { useLazyQuery, useMutation, useQuery } from "@vue/apollo-composable";
import {
  SettingsCodeEnum,
  State,
  City,
  CitiesDocument,
  UpdateTrainerTypeDocument,
  MeDocument,
  TrainerTypeEnum,
  RoleEnum,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { PositionLatLng } from "@/ts/types/map";
import {
  NativeGeocoder,
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import useRoles from "@/hooks/useRole";

const router = useRouter();

const { role } = useRoles();

const onBack = () => {
  router.go(-1);
};

const userCurrentLocation = ref<PositionLatLng | null>(null);

const chooseAddressModal = ref<typeof ChooseAddressModal | null>(null);
const selectedState = ref<State | null>(null);
const selectedCity = ref<City | null>(null);
const selectedAddress = ref<NativeGeocoderResult | null>(null);
const useMyPhoneLocation = ref(false);

const { mutate, loading } = useMutation(UpdateTrainerTypeDocument);

const { load: getCities, refetch: getCityByName } = useLazyQuery(
  CitiesDocument,
  {
    first: 15,
    name: "",
    state_code: "",
  }
);

const { id } = useId();

const {
  onResult,
  loading: meLoading,
  result,
} = useQuery(
  MeDocument,
  { id },
  {
    fetchPolicy: "no-cache",
  }
);

onResult(({ data }) => {
  if (data.me.address) {
    selectedState.value = data.me.address?.city?.state;
    selectedCity.value = data.me.address?.city;
    selectedAddress.value = {
      latitude: data.me.address.lat,
      longitude: data.me.address.lng,
      thoroughfare: data.me.address?.street,
      subThoroughfare: data.me.address?.extra,
      countryName: data.me.address?.city?.country?.name,
    };
  }

  radiusDistance.value =
    data.me?.settings.find(
      (settings: any) =>
        settings.setting.code === SettingsCodeEnum.TrainerRemoteDistance
    )?.value ?? 0;

  isMobile.value =
    data.me?.settings.find(
      (settings: any) => settings.setting.code === SettingsCodeEnum.IsMobile
    )?.value ?? false;

  if (!store.assignedFacility) {
    store.setAssignedFacility(data.me?.facilities[0]);
  }
});

const isFreelancer = computed<boolean>(
  () => result.value?.me.trainer_type === TrainerTypeEnum.Freelancer
);

onMounted(() => {
  getCities();
});

const gettingUserLocation = ref<boolean>(false);

const onPhoneLocationChecked = async (value: boolean) => {
  useMyPhoneLocation.value = value;
  if (value) {
    gettingUserLocation.value = true;
    selectedState.value = null;
    selectedCity.value = null;
    selectedAddress.value = null;

    const coordinates: Position = await Geolocation.getCurrentPosition();
    gettingUserLocation.value = false;
    userCurrentLocation.value = {
      lat: coordinates?.coords?.latitude,
      lng: coordinates?.coords?.longitude,
    };
  } else {
    userCurrentLocation.value = null;
  }
};

const disabledSaveBtn = computed(() =>
  useMyPhoneLocation.value
    ? !useMyPhoneLocation.value || gettingUserLocation.value
    : !(selectedAddress.value)
);

const chooseState = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.State,
    title: "Select state",
    selected: selectedState.value,
  });
};

const chooseCity = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.City,
    title: "Select city",
    selected: selectedCity.value,
    state: selectedState.value,
  });
};

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
  console.log("selected-->", selected)
  selectedState.value = selected.state;
  selectedCity.value = selected.city;
  selectedAddress.value = selected.address;
};

const getUserLocation = async () => {
  try {
    const myPosition: Position = await Geolocation.getCurrentPosition();
    userCurrentLocation.value = {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude,
    };
  } catch (error) {
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

const saveAddress = async () => {
  const options = {
    id,
    settings: [
      {
        code: SettingsCodeEnum.UsePhoneLocation,
        value: useMyPhoneLocation.value,
      },
      {
        code: SettingsCodeEnum.TrainerRemoteDistance,
        value: radiusDistance.value,
      },
      {
        code: SettingsCodeEnum.IsMobile,
        value: isMobile.value,
      },
    ],
  };
  if (!useMyPhoneLocation.value) {
    console.log("selectedAddress-->", selectedAddress)
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
            street: `${selectedAddress.value?.thoroughfare} ${selectedAddress.value?.subThoroughfare}`,
            extra: "",
            city_id: res_city.id,
          };

          mutate({
            ...options,
            address,
          })
            .then(async () => {
              const toast = await toastController.create({
                message: "Location successfully updated",
                duration: 2000,
                icon: "assets/icon/success.svg",
                cssClass: "success-toast",
              });
              toast.present();
              onBack();
            })
            .catch(async () => {
              const toast = await toastController.create({
                message: "Something went wrong. Please try again.",
                icon: "assets/icon/info.svg",
                cssClass: "danger-toast",
              });
              toast.present();
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
                mutate({
                  ...options,
                  ...address,
                  city_id: res_city.id,
                  street: `${res_city.thoroughfare} ${res_city.subThoroughfare}`,
                })
                  .then(async () => {
                    const toast = await toastController.create({
                      message: "Location successfully updated",
                      duration: 2000,
                      icon: "assets/icon/success.svg",
                      cssClass: "success-toast",
                    });
                    toast.present();
                    onBack();
                  })
                  .catch(async () => {
                    const toast = await toastController.create({
                      message: "Something went wrong. Please try again.",
                      icon: "assets/icon/info.svg",
                      cssClass: "danger-toast",
                    });
                    toast.present();
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

const radiusDistance = ref<string>("");
const isMobile = ref<boolean>(false);

const spacing = distance();

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter"); // Inject `emitter`

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

const radiusPickerColums = [
  {
    name: "spacing",
    options: spacing,
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
        radiusDistance.value = value.spacing?.value;
      },
    },
  ],
};

const openChooseGym = () => {
  router.push({
    name: EntitiesEnum.ChooseGymAccount,
  });
};

const store = useSelectedAddressStore();

const chosenGym = computed(() => store.assignedFacility);
</script>
<style scoped lang="scss">
.header {
  margin-bottom: 24px;
}

.page {
  padding: 0 24px;
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
