<template>
  <ion-modal ref="chooseModal">
    <page-header @back="cancel" back-btn :title="title" />
    <template v-if="type !== EntitiesEnum.Address">
      <ion-item class="filters">
        <ion-searchbar
          ref="searchBar"
          v-model="filter"
          class="search-control"
          show-clear-button="never"
          @ion-change="filterResults"
          placeholder="Enter to filter..."
          search-icon="assets/icon/search.svg"
        >
        </ion-searchbar>
      </ion-item>
      <ion-spinner
        v-if="
          optionsPage === 1 &&
          ((type === EntitiesEnum.State && statesLoading) ||
            (type === EntitiesEnum.City && citiesLoading))
        "
        name="lines"
        class="spinner"
      />
      <ion-content class="ion-padding content">
        <ion-radio-group v-model="value">
          <ion-item
            lines="none"
            :key="option.id"
            class="radiobutton"
            v-for="option in options"
            :class="{ 'radiobutton--checked': value === option.id }"
          >
            <ion-label>{{ option.name }}</ion-label>
            <ion-radio slot="end" :value="option.id" />
          </ion-item>
        </ion-radio-group>
        <ion-infinite-scroll
          threshold="100px"
          class="infinite-scroll"
          @ionInfinite="loadData"
          v-if="options.length < totalOptions"
        >
          <ion-infinite-scroll-content
            loading-spinner="lines"
            loading-text="Loading more data..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
        <div class="ion-padding select-button" slot="fixed">
          <ion-button @click="choose" expand="block"> Select </ion-button>
        </div>
      </ion-content>
    </template>
    <div
      class="map-holder"
      v-else-if="type === EntitiesEnum.Address"
      :class="{ 'map-holder--dragging': onMapDrag }"
    >
      <GMapMap
        ref="map"
        class="map"
        :center="latLng"
        :options="mapOptions"
        @dragend="addressSelected"
        @center_changed="mapChanged"
        @dragstart="onMapDrag = true"
      />
      <div class="center-marker">
        <ion-icon icon="assets/icon/flag.svg"></ion-icon>
      </div>
      <div
        class="ion-padding select-button select-button--filled"
        slot="fixed"
        v-if="chosenAddress"
      >
        <p>
          {{ chosenAddress.thoroughfare }}
          {{ chosenAddress.subThoroughfare }}
        </p>
        <ion-button
          @click="choose"
          expand="block"
          :disabled="!chosenAddress?.thoroughfare?.length"
        >
          Select
        </ion-button>
      </div>
    </div>
  </ion-modal>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Are you sure you select the right address?"
    description="Looks like the selected address is in another state or city."
    button-text="Yes, I'm sure"
    @discard="onAddressConfirmed"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import {
  IonModal,
  IonButton,
  IonContent,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonSearchbar,
  IonIcon,
  IonLabel,
  toastController,
  IonSpinner,
} from "@ionic/vue";
import { defineExpose, defineEmits, ref } from "vue";
import { Capacitor } from '@capacitor/core';
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import {
  ChooseAddresModalOptions,
  ChooseAddresModalResult,
} from "@/interfaces/ChooseAddressModalOption";
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
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";

const chooseModal = ref<typeof IonModal | null>(null);
const map = ref<any>(null);

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "select", selected?: ChooseAddresModalResult): void;
}>();

const countryCode = "US";
const onMapDrag = ref<boolean>();
const chosenAddress = ref<NativeGeocoderResult>();
const value = ref<string>();
const latLng = ref<PositionLatLng>({
  lat: Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
  lng: Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
});
const mapPosition = ref<PositionLatLng>();
const filter = ref<string>("");
const title = ref<string | undefined>();
const type = ref<EntitiesEnum>();

const cancel = () => {
  emits("cancel");
  resetAndClose();
};

const choose = async () => {
  if (type.value === EntitiesEnum.Address) {
    if (chosenAddress.value?.countryCode !== countryCode) {
      const toast = await toastController.create({
        message:
          "Selected address outside the United States. Make sure the address is correct.",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();
      return;
    }

    if (
      chosenAddress.value.locality?.toLowerCase() !==
        selectedCity.value?.name?.toLowerCase() ||
      chosenAddress.value.administrativeArea?.toLowerCase() !==
        selectedState.value?.code?.toLowerCase()
    ) {
      showAddressConfirmationModal();
      return;
    }
  }

  const selected = {
    state:
      type.value === EntitiesEnum.State
        ? options.value.find((option: State) => option.id === value.value)
        : selectedState.value,
    city:
      type.value === EntitiesEnum.City
        ? options.value.find((option: City) => option.id === value.value)
        : selectedCity.value,
    address: chosenAddress.value || null,
  };

  emits("select", selected);
  resetAndClose();
};

const {
  showConfirmationModal,
  hideModal,
  showModal: showAddressConfirmationModal,
} = useConfirmationModal();

const onAddressConfirmed = () => {
  const selected: ChooseAddresModalResult = {
    state:
      type.value === EntitiesEnum.State
        ? options.value.find((option: State) => option.id === value.value)
        : selectedState.value,
    city:
      type.value === EntitiesEnum.City
        ? options.value.find((option: City) => option.id === value.value)
        : selectedCity.value,
    address: chosenAddress.value || null,
  };

  emits("select", selected);
  resetAndClose();
  hideModal();
};

const present = (props: ChooseAddresModalOptions) => {
  type.value = props.type;
  title.value = props.title;

  getStates();
  getCities();

  if (type.value === EntitiesEnum.State) {
    value.value = props.selected as string;
    updateStates({
      first: 15,
      page: optionsPage.value,
      name: filter.value,
    });
  }

  if (type.value === EntitiesEnum.City) {
    selectedState.value = props.state;
    value.value = props.selected as string;
    updateCities({
      first: 15,
      page: optionsPage.value,
      name: filter.value,
      country_id: "1",
      state_id: selectedState.value?.id,
    });
  }

  if (type.value === EntitiesEnum.Address) {
    selectedState.value = props.state;
    selectedCity.value = props.city;
    if (
      !props.selected &&
      props.city &&
      props.city.name &&
      props.state &&
      props.state.name
    ) {
      NativeGeocoder.forwardGeocode(`${props.state.name}, ${props.city.name}`)
        .then((result: NativeGeocoderResult[]) => {
          if (result[0]) {
            latLng.value = {
              lat: Number(result[0]?.latitude),
              lng: Number(result[0]?.longitude),
            };
            mapOptions.zoom = 15;
          }
        })
        .catch((error) => {
          chosenAddress.value = undefined;
          console.log(error);
        });
    } else if (props.selected) {
      mapOptions.zoom = 15;
      latLng.value = props.selected as PositionLatLng;
    } else {
      mapOptions.zoom = 10;
    }
  }

  chooseModal?.value?.$el.present();
};

const optionsPage = ref<number>(1);
const options = ref<State[] | City[]>([]);
const totalOptions = ref<number>(0);
const selectedState = ref<State | null>();
const selectedCity = ref<City | null>();

const {
  load: getStates,
  refetch: updateStates,
  onResult: setStates,
  loading: statesLoading,
} = useLazyQuery(StatesDocument, {
  first: 15,
  page: optionsPage.value,
  name: filter.value,
});

const {
  load: getCities,
  refetch: updateCities,
  onResult: setCities,
  loading: citiesLoading,
} = useLazyQuery(CitiesDocument, {
  first: 15,
  page: optionsPage.value,
  name: filter.value,
  country_id: "1",
  state_id: selectedState.value?.id,
});

setStates((response) => {
  if (type.value === EntitiesEnum.State) {
    totalOptions.value = response.data.states.paginatorInfo.total;
    if (
      response.data &&
      options.value.findIndex(
        (option) => option.id === response.data.states.data[0].id
      ) === -1
    ) {
      options.value = [...options.value, ...response.data.states.data];
    }
  }
});

setCities((response) => {
  if (type.value === EntitiesEnum.City) {
    totalOptions.value = response.data?.cities.paginatorInfo.total || 0;
    if (
      response.data &&
      options.value.findIndex(
        (option) => option.id === response.data.cities.data[0].id
      ) === -1
    ) {
      options.value = [...options.value, ...response.data.cities.data];
    }
  }
});

const loadData = (ev: InfiniteScrollCustomEvent) => {
  if (options.value.length < totalOptions.value) {
    optionsPage.value++;
    if (type.value === EntitiesEnum.State) {
      updateStates({
        first: 15,
        page: optionsPage.value,
        name: filter.value,
      })?.then(() => {
        ev.target.complete();
      });
    } else {
      updateCities({
        first: 15,
        page: optionsPage.value,
        name: filter.value,
        country_id: "1",
        state_id: selectedState.value?.id,
      })?.then(() => {
        ev.target.complete();
      });
    }
  }
};

const resetAndClose = () => {
  value.value = undefined;
  filter.value = "";
  options.value = [];
  chooseModal?.value?.$el.dismiss();
};

const filterResults = async () => {
  optionsPage.value = 1;
  options.value = [];

  if (type.value === EntitiesEnum.State) {
    updateStates({
      first: 15,
      page: optionsPage.value,
      name: filter.value,
    });
  } else {
    updateCities({
      first: 15,
      page: optionsPage.value,
      name: filter.value,
      country_id: "1",
      state_id: selectedState.value?.id,
    });
  }
};

defineExpose({
  present,
});

const mapOptions = {
  zoom: 15,
  styles: MapStyles,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: false,
  fullscreenControl: false,
  backgroundColor: "var(--gray-800)",
  disableDefaultUI: false,
  padding: {
    bottom: 150,
  },
};

const mapChanged = (event: typeof VueGoogleMaps) => {
  console.log("event--", event);
  console.log("lat--", event.lat(), "lng--", event.lng());
  mapPosition.value = { lat: event.lat(), lng: event.lng() };
};

const getGeoLocation = async (lat: number, lng: number, type?: any) => {
    console.log("map-->", map)
    if (navigator.geolocation) {
      console.log("map.value?-->", map.value)
      if (map.value?.ready) {
        console.log("map.value?.ready-->", map.value.ready)
        let geocoder = await new window.google.maps.Geocoder();
        let latlng = await new window.google.maps.LatLng(lat, lng);
        let request = { latLng: latlng };

        await geocoder.geocode(request, (results, status) => {
          console.log("results, status", results, status);
          if (status == window.google.maps.GeocoderStatus.OK) {
            let result = results[0];
            // this.zone.run(() => {
            //   if (result != null) {
            //     this.userCity = result.formatted_address;
            //     if (type === 'reverseGeocode') {
            //       this.latLngResult = result.formatted_address;
            //     }
            //   }
            // })
          }
        });
      }
    }
  }

const addressSelected = () => {
  onMapDrag.value = false;
  console.log("addressSelected--", mapPosition);
  if (mapPosition.value?.lat && mapPosition.value?.lng) {
    console.log("mapPosition--", mapPosition.value?.lat, mapPosition.value?.lng);
    const lat =
        mapPosition.value?.lat > 0
          ? mapPosition.value?.lat -
            180 * Math.floor(Math.abs(mapPosition.value?.lat) / 180)
          : mapPosition.value?.lat +
            180 * Math.floor(Math.abs(mapPosition.value?.lat) / 180),
      lng =
        mapPosition.value?.lng > 0
          ? mapPosition.value?.lng -
            180 * Math.floor(Math.abs(mapPosition.value?.lng) / 180)
          : mapPosition.value?.lng +
            180 * Math.floor(Math.abs(mapPosition.value?.lng) / 180);

    if (Capacitor.isNativePlatform()) {
      console.log('Native platform');
      NativeGeocoder.reverseGeocode(lat, lng, {
        useLocale: false,
        maxResults: 5,
      })
        .then((addresses) => {
          console.log("addresses--", addresses);
          console.log("chosenAddress--", chosenAddress);
          const address = addresses[0];
          if (!address?.thoroughfare?.length) {
            chosenAddress.value = undefined;
          } else {
            chosenAddress.value = address;
          }
        })
        .catch(() => {
          console.log("undefined-chosenAddress--", chosenAddress);
          chosenAddress.value = undefined;
        });
    } else {
      console.log('Web platform');
      getGeoLocation(mapPosition.value?.lat, mapPosition.value?.lng)
    }
  }
};
</script>

<style scoped lang="scss">
.content {
  height: calc(100% - 48px - 65px - var(--ion-safe-area-top));
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

.filters {
  padding-top: 8px;
  padding-bottom: 8px;
}

.radiobutton {
  font-size: 14px;
  line-height: 1.5;
  --min-height: 46.41px;
  --padding-top: 0;
  --padding-bottom: 0;
  --border-radius: 8px;
  --color: var(--gray-500);
  --inner-padding-top: 0;
  --inner-padding-bottom: 0;
  --inner-padding-start: 0;
  --inner-padding-end: 0;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &--checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }

  ion-label {
    margin-top: 12px;
    margin-bottom: 12px;
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: var(--ion-color-medium);
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }
}

.search-control {
  padding: 0;
  width: 100%;
  z-index: 15;
  transition: right 0.35s ease;
  --border-radius: 8px;
  --color: var(--ion-color-white);
  --placeholder-opacity: 1;
  --background: var(--gray-700);
  --icon-color: var(--gray-500);
  --placeholder-font-weight: 300;
  --placeholder-color: var(--gray-500);
  --box-shadow: inset 0 0 0 0.8px var(--gray-600);
}

.map-holder {
  position: relative;
  height: calc(100% - 48px - var(--ion-safe-area-top));
}

.map {
  height: 100%;
}

.center-marker {
  top: 50%;
  left: 50%;
  line-height: 1;
  font-size: 24px;
  position: absolute;
  margin: -12px 0 0 8px;
  color: var(--ion-color-primary);
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;

  .map-holder--dragging & {
    transform: translate(-50%, calc(-50% - 3px)) rotate(12deg);
  }

  &:before {
    left: 2px;
    content: "";
    bottom: -2px;
    width: 0.3em;
    height: 0.3em;
    position: absolute;
    border-radius: 50%;
    transition: opacity 0.2s ease;
    background: rgba(var(--ion-color-black-rgb), 0.4);

    .map-holder:not(.map-holder--dragging) & {
      opacity: 0;
    }
  }
}

.selected-address {
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 15;
  position: absolute;
  background: var(--ion-color-black);
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.spinner {
  display: block;
  margin: 30vh auto;
}
</style>
