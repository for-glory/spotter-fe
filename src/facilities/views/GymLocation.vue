<template>
  <ion-page ref="page">
    <base-layout>
      <template #header>
        <page-header back-btn @back="onBack" title="Location and Rate" />
      </template>
      <template #content>
        <div class="page">
          <choose-block
            title="State"
            class="page__control"
            @handle-click="chooseState"
            :value="selectedState?.name"
            :disabled="useMyPhoneLocation"
          />
          <choose-block
            title="City"
            class="page__control"
            @handle-click="chooseCity"
            :value="selectedCity?.name"
            :disabled="!selectedState || useMyPhoneLocation"
          />
          <choose-block
            title="Address"
            class="page__control"
            @handle-click="chooseAddress"
            :disabled="!selectedState || !selectedCity || useMyPhoneLocation"
            :value="
              selectedAddress
                ? `${selectedAddress.thoroughfare} ${selectedAddress.subThoroughfare}`
                : ''
            "
          />
          <ion-item class="page__holder-textarea" :disabled="!selectedCity">
            <ion-textarea
              v-model="description"
              class="page__textarea"
              placeholder="Additional information"
              maxlength="150"
              rows="3"
            />
          </ion-item>
        </div>
      </template>
      <template #footer>
        <div class="holder-button">
          <ion-button
            @back="onBack"
            :disabled="!selectedCity"
            class="button--submit"
            expand="block"
          >
            Save
          </ion-button>
        </div>
      </template>
    </base-layout>
  </ion-page>
  <choose-location-modal ref="chooseLocationModal" @select="addressSelected" />
</template>

<script setup lang="ts">
import {
  IonPage,
  IonButton,
  IonLabel,
  IonIcon,
  IonItem,
  IonTextarea,
  toastController,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";
import { State, IState, City, ICity } from "country-state-city";
import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder";

const router = useRouter();

const countryCode = "US";
const states = ref<IState[]>(State.getStatesOfCountry(countryCode));
const cities = ref<ICity[]>();

const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);
const selectedState = ref<any>();
const selectedCity = ref<any>();
const selectedAddress = ref<NativeGeocoderResult>();
const description = ref("");

const onBack = () => {
  router.go(-1);
};

const chooseState = () => {
  chooseLocationModal.value?.present({
    type: EntitiesEnum.State,
    title: "Select state",
    selected: selectedState.value?.isoCode,
    options: states.value.map((state) => {
      return {
        id: state.isoCode,
        label: state.name,
      };
    }),
  });
};

const chooseCity = () => {
  chooseLocationModal.value?.present({
    type: EntitiesEnum.City,
    title: "Select city",
    selected: selectedCity.value?.name,
    options: cities.value?.map((state) => {
      return {
        id: state.name,
        label: state.name,
      };
    }),
    state: selectedState.value
  });
};

const chooseAddress = () => {
  chooseLocationModal.value?.present({
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

const addressSelected = async (
  selected?: any | NativeGeocoderResult,
  type?: EntitiesEnum
) => {
  if (!selected) return;
  switch (type) {
    case EntitiesEnum.State:
      selectedState.value = { ...states.value?.find(
        (state) => state.isoCode === selected.state.code
      ), id: selected.state.id };
      cities.value = City.getCitiesOfState(countryCode, selected.state.code);
      if (selectedCity.value?.stateCode !== selectedState.value?.isoCode) {
        selectedCity.value = undefined;
      }
      if (
        selectedAddress.value?.administrativeArea !==
        selectedState.value?.isoCode
      ) {
        selectedAddress.value = undefined;
      }
      break;

    case EntitiesEnum.City:
      selectedCity.value = cities.value?.find(
        (city) => city.name === selected.city.name
      );
      if (selectedCity.value?.name !== selectedAddress.value?.locality) {
        selectedAddress.value = undefined;
      }
      break;

    case EntitiesEnum.Address:
      if ((selected as NativeGeocoderResult).countryCode === countryCode) {
        selectedAddress.value = selected as NativeGeocoderResult;
        if (
          selectedAddress.value.administrativeArea !==
          selectedState.value?.isoCode
        ) {
          addressSelected(
            selectedAddress.value.administrativeArea,
            EntitiesEnum.State
          );
          const toast = await toastController.create({
            message: "The city and state have been changed",
            duration: 2000,
            icon: "assets/icon/info.svg",
            cssClass: "warning-toast",
          });
          toast.present();
        }

        if (selectedAddress.value.locality !== selectedCity.value?.name) {
          addressSelected(selectedAddress.value.locality, EntitiesEnum.City);
          const toast = await toastController.create({
            message: "The city has been changed",
            duration: 2000,
            icon: "assets/icon/info.svg",
            cssClass: "warning-toast",
          });
          toast.present();
        }
      } else {
        selectedAddress.value = undefined;
        const toast = await toastController.create({
          message:
            "Selected address outside the United States. Make sure the address is correct.",
          duration: 2000,
          icon: "assets/icon/info.svg",
          cssClass: "danger-toast",
        });
        toast.present();
      }
      break;
  }
};
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 15px;
}

.page {
  padding: 0 24px;

  &__label {
    display: block;
    margin-bottom: 6px;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ion-color-medium);
  }

  &__input {
    margin-bottom: 23px;
    --placeholder-color: var(--ion-color-medium);
    --color: var(--ion-color-white);
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
  }

  &__holder-textarea {
    --background-focused: transparent;
    --padding-start: 0;
    --inner-padding-end: 0;
    margin-bottom: 23px;
    --border-color: var(--gray-600);
    --background: var(--gray-700);
    --border-width: 1px;
    --border-radius: 8px;
    --full-highlight-height: 0;
    --highlight-color-focused: var(--gray-500);

    &::part(native) {
      border-width: 1px;
    }

    &.item-has-focus {
      &::part(native) {
        border-color: var(--gray-500);
      }
    }
  }

  &__textarea {
    display: block;
    height: 100%;
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    --placeholder-color: var(--ion-color-white);
    --color: var(--ion-color-white);
    --padding-start: 15px !important;
    --padding-top: 5px;
    --padding-bottom: 20px;
    margin-top: 0;
  }

  &__control {
    margin-bottom: 24px;
    --background: var(--gray-700);
    --border-radius: 8px;
    --color: var(--ion-color-white);
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
  }

  .choose-place__icon {
    height: 22px;
    width: 22px;
    margin-right: 3px;
  }

  &__control-icon {
    font-size: 16px;
    line-height: 1.5;
    margin-right: 4px;
    margin-left: 10px;
    color: var(--gray-400);
  }
}

.holder-button {
  padding: 20px 24px calc(32px + var(--ion-safe-area-bottom));

  .button {
    margin: 0;
  }
}
</style>
