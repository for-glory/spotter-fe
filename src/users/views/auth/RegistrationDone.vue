<template>
  <base-layout hide-navigation-menu>
    <template #content>
      <authentication-header />
      <div class="page-content ion-padding-horizontal">
        <div>
          <ion-title class="page-title" color="primary">You're Done!</ion-title>
          <ion-text color="secondary">
            You will be redirected to your main landing page screen
          </ion-text>
        </div>
        <div class="buttons">
          <br />
          <ion-button
            @click="start"
            class="button"
            expand="block"
            :disabled="loading"
          >
            <template v-if="!loading">Start now!</template>
            <ion-spinner v-else name="lines" class="spinner" />
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonText,
  IonTitle,
  IonButton,
  toastController,
  IonSpinner,
} from "@ionic/vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { EntitiesEnum } from "@/const/entities";
import {
  NativeGeocoder,
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import { Geolocation, Position } from "@capacitor/geolocation";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import { CitiesDocument, UpdateTrainerTypeDocument } from "@/generated/graphql";
import { ref } from "vue";
import useId from "@/hooks/useId";
import { useRouter } from "vue-router";
import { PositionLatLng } from "@/ts/types/map";

const loading = ref<boolean>(false);
const router = useRouter();
const userCurrentLocation = ref<null | PositionLatLng>(null);
const geocoderResult = ref<null | NativeGeocoderResult>(null);

const start = async () => {
  const permissions = await Geolocation.checkPermissions();
  if (permissions.location === "denied") {
    await Geolocation.requestPermissions();
    await getUserLocation();
  } else {
    await getUserLocation();
  }
};

const {
  load: getCityByName,
  onResult: getCityByNameDone,
  onError: getCityByNameError,
} = useLazyQuery(CitiesDocument, {
  first: 15,
  name: "",
  state_code: "",
});

const { mutate: updateTrainerType, onDone: afterTrainerTypeUpdated } =
  useMutation(UpdateTrainerTypeDocument);

const getUserLocation = async () => {
  try {
    const myPosition: Position = await Geolocation.getCurrentPosition();
    userCurrentLocation.value = {
      lat: myPosition.coords.latitude,
      lng: myPosition.coords.longitude,
    };
    NativeGeocoder.reverseGeocode(
      userCurrentLocation.value.lat,
      userCurrentLocation.value.lng,
      {
        useLocale: false,
        maxResults: 2,
      }
    )
      .then((addresses: NativeGeocoderResult[]) => {
        geocoderResult.value = addresses[0];

        if (geocoderResult.value?.locality) {
          getCityByName(CitiesDocument, {
            first: 15,
            name: geocoderResult.value.locality,
            state_code: geocoderResult.value.administrativeArea,
          });
        } else {
          goNext();
        }
      })
      .catch((error) => {
        goNext();
        console.log(error);
      });
  } catch (error) {
    showErrorToast(
      "Failed to get your location. Check the permissions for the application."
    );
    goNext();
  }
};

getCityByNameDone((response) => {
  const city = response.data.cities.data[0];

  const { id } = useId();

  if (city) {
    updateTrainerType({
      id,
      city_id: city.id,
      lat: userCurrentLocation.value?.lat,
      lng: userCurrentLocation.value?.lng,
      street: `${geocoderResult.value?.thoroughfare} ${geocoderResult.value?.subThoroughfare}`,
    });
  } else {
    goNext();
  }
});

getCityByNameError(() => {
  goNext();
});

const showErrorToast = async (message: string) => {
  const toast = await toastController.create({
    message,
    duration: 2000,
    icon: "assets/icon/info.svg",
    cssClass: "warning-toast",
  });
  toast.present();
};

afterTrainerTypeUpdated(() => {
  goNext();
});

const goNext = () => {
  router.push({
    name: EntitiesEnum.Facilities,
  });
};
</script>

<style scoped lang="scss">
.page-content {
  display: flex;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  padding-top: 32px;
  text-align: center;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100% - 337px - var(--ion-safe-area-top));
}

.page-title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  margin-bottom: 20px;
}

.buttons {
  margin-top: 24px;
  margin-bottom: calc(32px + var(--ion-safe-area-bottom));
}

.button {
  margin: 0;
}
</style>
