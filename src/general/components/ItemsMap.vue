<template>
  <div class="map" :class="{ 'map--fullscreen': isMapFullscreen }">
    <GMapMap
      ref="map"
      :options="mapOptions"
      @center_changed="mapChanged"
      @bounds_changed="boundsChanged"
      @zoom_changed="zoomChanged"
      :center="useCurrentLocation ? userPosition : center"
    >
      <GMapMarker
        ref="myMarker"
        :icon="myMarkerIcon"
        :position="useCurrentLocation ? userPosition : center"
      />

      <!-- <GMapCluster :zoomOnClick="true" :styles="clusterIcon"> -->
      <GMapMarker
        :key="index"
        :clickable="true"
        v-for="(item, index) in items"
        @click="markerClicked(item.id)"
        :position="{ lat: item.lat, lng: item.lng }"
        :icon="selectedItem !== item.id ? markerIcon : markerIconActive"
      />
      <!-- </GMapCluster> -->
    </GMapMap>

    <div class="map__controls">
      <ion-button
        class="map__control"
        @click="fullscreen"
        fill="clear"
        color="medium"
      >
        <ion-icon slot="icon-only" src="assets/icon/fullscreen.svg"></ion-icon>
      </ion-button>
      <ion-button
        class="map__control"
        @click="centerMap"
        fill="clear"
        color="medium"
      >
        <ion-icon
          slot="icon-only"
          src="assets/icon/location-point.svg"
        ></ion-icon>
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted } from "vue";
import { IonButton, IonIcon } from "@ionic/vue";
import { Geolocation, Position } from "@capacitor/geolocation";
import { MapStyles } from "@/constants/map-styles";
import { Address } from "@/generated/graphql";
import VueGoogleMaps from "@fawmi/vue-google-maps";
import { MapFilters, PositionLatLng } from "@/ts/types/map";

export type MapMarkerItem = Pick<Address, "id" | "lat" | "lng">;

const emits = defineEmits<{
  (e: "change-position", result: MapFilters): void;
  (e: "fullscreen", isFullscreen: boolean): void;
  (e: "marker-click", id: string): void;
}>();

const props = defineProps<{
  items?: MapMarkerItem[];
  useCurrentLocation?: boolean;
  center: PositionLatLng;
  selectedItem?: string | null;
}>();

watch(
  () => props.useCurrentLocation,
  () => {
    if (props.useCurrentLocation) {
      setCurrentPosition();
    }
  }
);

watch(
  () => props.center,
  () => {
    map.value.panTo(props.center);
  }
);

onMounted(() => {
  if (props.useCurrentLocation) {
    setCurrentPosition();
  }
});

const map = ref<typeof VueGoogleMaps | null>(null);
const isMapFullscreen = ref<boolean>(false);

const userPosition = ref<PositionLatLng>({
  lat: props.center.lat,
  lng: props.center.lng,
});

const myMarkerIcon = {
  url: "assets/icon/my-marker-new.svg",
  scaledSize: {
    width: 81,
    height: 81,
  },
  labelOrigin: { x: 81, y: 81 },
};

const markerIcon = {
  url: "assets/icon/location-light.svg",
  scaledSize: {
    width: 24,
    height: 24,
  },
  labelOrigin: { x: -12, y: -24 },
};

const markerIconActive = {
  url: "assets/icon/map-marker-active.svg",
  scaledSize: {
    width: 24,
    height: 24,
  },
  labelOrigin: { x: -12, y: -24 },
};

// const clusterIcon = [
//   {
//     width: 48,
//     height: 48,
//     textSize: 16,
//     textColor: "#262626",
//     url: "assets/icon/map-cluster.svg",
//   },
//   {
//     width: 48,
//     height: 48,
//     textSize: 16,
//     textColor: "#262626",
//     url: "assets/icon/map-cluster.svg",
//   },
//   {
//     width: 48,
//     height: 48,
//     textSize: 16,
//     textColor: "#262626",
//     url: "assets/icon/map-cluster.svg",
//   },
// ];

const zoom = ref<number>(13);
const centerValue = ref<PositionLatLng>(
  props.useCurrentLocation ? userPosition.value : props.center
);

const mapOptions = {
  zoom: zoom.value,
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

const setCurrentPosition = async () => {
  if (map.value) {
    map.value.panTo(userPosition.value);
  }
  const myPosition: Position = await Geolocation.getCurrentPosition();
  userPosition.value = {
    lat: myPosition.coords.latitude,
    lng: myPosition.coords.longitude,
  };
  map.value.panTo(userPosition.value);
};

const mapChanged = (event: typeof VueGoogleMaps) => {
  centerValue.value = {
    lat: event.lat() as number,
    lng: event.lng() as number,
  };
};

const centerMap = () => {
  setCurrentPosition();
};

const boundsChanged = () => {
  const radius = Math.ceil(
    ((156543.03392 * Math.cos((centerValue.value.lat * Math.PI) / 180)) /
      Math.pow(2, zoom.value)) *
      0.000621371 *
      0.8 *
      window.innerWidth
  );
  emits("change-position", {
    position: centerValue.value,
    distance: radius,
  });
};

const zoomChanged = (newZoom: number) => {
  zoom.value = newZoom;
};

const fullscreen = () => {
  isMapFullscreen.value = !isMapFullscreen.value;
  emits("fullscreen", isMapFullscreen.value);
};

const markerClicked = (id: string) => {
  emits("marker-click", id);
};
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;

  &__controls {
    left: 16px;
    bottom: 50px;
    overflow: hidden;
    position: absolute;
    border-radius: 18px;
    background: var(--gray-800);
    transition: bottom 0.3s ease;

    .map--fullscreen & {
      bottom: calc(140px + var(--ion-safe-area-bottom));
    }
  }

  & .vue-map-container {
    height: 100%;
  }

  &__control {
    margin: 0;
    line-height: 1;
    font-size: 24px;
    width: calc(1em + 16px);
    height: calc(1em + 12px);
    --border-radius: 0;
    --padding-top: 6px;
    --padding-bottom: 6px;
    --padding-start: 8px;
    --padding-end: 8px;

    &:first-child {
      --padding-start: 12px;
      --border-radius: 18px 0 0 18px;
    }

    &:last-child {
      --padding-end: 12px;
      --border-radius: 0 18px 18px 0;
    }

    &:not(:first-child) {
      margin-left: 1px;
      position: relative;

      &:before {
        top: 50%;
        left: -1px;
        width: 1px;
        content: "";
        height: 20px;
        margin-top: -10px;
        position: absolute;
        background: var(--gray-600);
      }
    }

    &::slotted(ion-icon) {
      font-size: 1em;
    }
  }
}

.vue-map-container {
  height: 100%;
}
</style>
