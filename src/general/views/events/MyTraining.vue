<template>
  <base-layout
    draggable
    header-fixed
    ref="layout"
    :offset-top="64"
    :content-full-height="isMapFullscreen"
    :initial-breakpoint="!isMapFullscreen ? 0.5 : 1"
  >
    <template #header>
      <search-event-form
        :type="EntitiesEnum.Events"
        @handle-focus="isSearchOnFocus = true"
        @handle-blur="isSearchOnFocus = false"
        @handle-item-click="openEvent"
      />
    </template>

    <template #static>
      <div class="page-map">
        <items-map
          v-if="!meLoading"
          :items="locations"
          :center="userLocation"
          @fullscreen="changeMapView"
          @change-position="mapPositionChanged"
          :use-current-location="useCurrentLocation"
        >
        </items-map>
      </div>
    </template>

    <template #draggable>
      <div class="content ion-padding-horizontal ion-padding-bottom">
        <ion-toolbar
          class="header"
          v-if="meLoading || eventsLoading || events?.length"
        >
          <ion-title slot="start" class="title">Events Nearby</ion-title>
          <ion-button
            slot="end"
            fill="clear"
            color="primary"
            @click="toggleModal"
            class="header__btn hide-on-fullscreen"
          >
            View All
          </ion-button>
        </ion-toolbar>
        <ion-spinner
          v-if="meLoading || eventsLoading"
          name="lines"
          class="spinner"
        />
        <template v-else>
          <p v-if="eventsError" class="ion-text-center">
            Something went wrong...
          </p>
          <template v-else-if="events.length">
            <event-item
              v-for="event in events"
              :key="event.id"
              :item="event"
              @click="openEvent(event.id)"
            />
          </template>
          <empty-block
            v-else
            hide-button
            title="Sorry, no events found"
            icon="assets/icon/weights.svg"
            text="Currently there are no events in your area"
          />
        </template>
      </div>
    </template>
  </base-layout>

  <page-tabs
    :tabs="tabs"
    class="page-tabs"
    :value="EntitiesEnum.MyTraining"
    @change="tabsChanged"
    v-if="!isSearchOnFocus"
  />
</template>

<script setup lang="ts">
import { IonButton, IonTitle, IonToolbar, IonSpinner } from "@ionic/vue";
import { computed, ref } from "vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import ItemsMap, { MapMarkerItem } from "@/general/components/ItemsMap.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import EventItem from "@/general/components/EventItem.vue";
import {
  EventsDocument,
  EventsQuery,
  EventsQueryVariables,
  MeDocument,
  SettingsCodeEnum,
} from "@/generated/graphql";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import SearchEventForm from "@/general/components/forms/SearchEventForm.vue";
import { useRouter } from "vue-router";
import { discoverTabs } from "@/const/tabs";
import { MapFilters, PositionLatLng } from "@/ts/types/map";
import { debounce } from "lodash";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();

const isMapFullscreen = ref<boolean>(false);
const layout = ref<typeof BaseLayout | null>(null);
const isSearchOnFocus = ref<boolean>(false);

const tabs: TabItem[] = discoverTabs;

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};

const useCurrentLocation = ref<boolean>(false);
const userLocation = ref<PositionLatLng>({
  lat: Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
  lng: Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
});

const mapPosition = ref<MapFilters>({
  position: userLocation.value,
  distance: 6,
});

const mapPositionChanged = debounce((result: MapFilters) => {
  mapPosition.value = result;

  updateEvents({
    first: 100,
    page: 1,
    near: {
      lat: mapPosition.value.position.lat,
      lng: mapPosition.value.position.lng,
      radius: mapPosition.value.distance || 1,
    },
  });
}, 500);

const changeMapView = (isFullscreen: boolean) => {
  isMapFullscreen.value = isFullscreen;
};

const { onResult: gotMe, loading: meLoading } = useQuery(
  MeDocument,
  {},
  {
    fetchPolicy: "no-cache",
  }
);

gotMe(({ data }) => {
  useCurrentLocation.value =
    data.me?.settings?.find(
      (setting: any) =>
        setting.setting.code === SettingsCodeEnum.UsePhoneLocation
    )?.value ?? false;

  if (
    !useCurrentLocation.value &&
    data.me?.address?.lat &&
    data.me?.address?.lng
  ) {
    userLocation.value = {
      lat:
        data.me.address?.lat ??
        Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
      lng:
        data.me.address?.lng ??
        Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
    };
    mapPosition.value.position = userLocation.value;
  }
  loadEvents();
});

const eventsParams: EventsQueryVariables = {
  first: 100,
  page: 1,
  near: {
    lat: mapPosition.value.position.lat,
    lng: mapPosition.value.position.lng,
    radius: mapPosition.value.distance,
  },
};

const {
  load: loadEvents,
  result: eventsResult,
  refetch: updateEvents,
  loading: eventsLoading,
  error: eventsError,
} = useLazyQuery<EventsQuery>(EventsDocument, eventsParams, {
  fetchPolicy: "no-cache",
});

const events = computed(() => eventsResult.value?.events?.data ?? []);

const locations = computed<MapMarkerItem[]>(
  () =>
    eventsResult.value?.events?.data.map((event) => ({
      id: event.id,
      lat: event.address?.lat,
      lng: event.address?.lng,
    })) ?? []
);

const toggleModal = () => {
  layout?.value?.showDraggable();
};

const openEvent = (eventId: string) => {
  router.push({
    name: EntitiesEnum.EventsDetailed,
    params: {
      id: eventId,
    },
  });
};

const { onResult } = useQuery(MeDocument);

onResult(({ data }) => {
  useCurrentLocation.value =
    data.me?.settings?.find(
      (setting: any) =>
        setting.setting.code === SettingsCodeEnum.UsePhoneLocation
    )?.value ?? false;

  if (
    !useCurrentLocation.value &&
    data.me?.address?.lat &&
    data.me?.address?.lng
  ) {
    userLocation.value = {
      lat:
        data.me.address?.lat ??
        Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
      lng:
        data.me.address?.lng ??
        Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
    };
  }
});
</script>

<style lang="scss" scoped>
.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 21000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 120px;
}

.page-map {
  height: 100%;
}

.header {
  margin-bottom: 16px;
  --padding-top: 0;
  --min-height: 28px;
  --padding-bottom: 0;

  &__btn {
    height: 24px;
    margin: 0 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    margin-right: 0;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 8px;
    --padding-end: 0px;
    transition: opacity 0.35s ease;
  }
}

.content {
  padding-bottom: 74px;
}

.title {
  padding: 0;
  display: block;
  color: var(--ion-color-white);
  font: 500 16px/1 var(--ion-font-family);
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50% - 60px) auto 0;
}

.empty-block {
  margin-top: calc(4vh + 8px);
}
</style>
