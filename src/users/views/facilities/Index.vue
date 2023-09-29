<template>
  <base-layout
    draggable
    header-fixed
    ref="layout"
    :offset-top="64"
    :content-full-height="isMapFullscreen"
    :initial-breakpoint="!isMapFullscreen ? 0.5 : 1"
    :hide-navigation-menu="isWebView"
  >
    <template #header>
      <search-form
        :filters="
          availabilityFilters
            ? {
                availability: {
                  date_from: availabilityFilters.date_from,
                  date_to: availabilityFilters.date_to,
                },
              }
            : {}
        "
        :type="activeTab"
        @handle-focus="isSearchOnFocus = true"
        @handle-blur="isSearchOnFocus = false"
        :filters-btn="(route.params?.type === EntitiesEnum.Trainers || activeTab === EntitiesEnum.Trainers)"
        @apply-filters="applyFilters"
        @reset-filters="resetFilters"
      />
    </template>

    <template #static>
      <div class="page-map">
        <items-map
          v-if="!meLoading"
          :items="locations"
          :center="userLocation"
          @marker-click="selectItem"
          @fullscreen="changeMapView"
          :selected-item="selectedItem"
          @change-position="mapPositionChanged"
          :use-current-location="useCurrentLocation"
        >
        </items-map>
      </div>
    </template>

    <template #draggable>
      <facilities-page
        :filters="mapPosition"
        @toggle-modal="showDraggable"
        v-if="activeTab === EntitiesEnum.Facilities"
        @location-items="mapItemsChanged"
        :selected="selectedItem"
        @deselect="selectedItem = null"
      />

      <trainers-page
        :filters="mapPosition"
        :availability-filters="availabilityFilters"
        @toggle-modal="showDraggable"
        v-if="activeTab === EntitiesEnum.Trainers"
        @location-items="mapItemsChanged"
        :selected="selectedItem"
        @deselect="selectedItem = null"
      />
    </template>
  </base-layout>

  <page-tabs
    :tabs="tabs"
    class="page-tabs"
    :value="activeTab"
    @change="tabsChanged"
    v-if="showTabs && !route.params?.type && activeTab && !isSearchOnFocus"
  />
  <Onboarding
    :steps="steps"
    v-if="!isOnboardingDone"
    page-classname="booking"
    @finish="onboardingFinished"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabsNew from "@/general/components/PageTabsNew.vue";
import ItemsMap, { MapMarkerItem } from "@/general/components/ItemsMap.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import FacilitiesPage from "@/views/FacilitiesPage.vue";
import TrainersPage from "@/views/TrainersPage.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { SettingsCodeEnum, MeDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import Onboarding from "@/general/components/Onboarding.vue";
import { useRouter } from "vue-router";
import { useSettings } from "@/hooks/useSettings";
import { OnboardingStep } from "@/ts/types/onboardingStep";
import { MapFilters, PositionLatLng } from "@/ts/types/map";
import debounce from "lodash/debounce";
import { TabItemNew } from "@/interfaces/TabItemnew";
import { useRoute } from "vue-router";
import PageTabs from "@/general/components/PageTabs.vue";

const locations = ref<MapMarkerItem[]>([]);
const selectedItem = ref<string | null>(null);
const isMapFullscreen = ref<boolean>(false);
const layout = ref<typeof BaseLayout | null>(null);
const isSearchOnFocus = ref<boolean>(false);
  const props = withDefaults(defineProps<{
    isWebView?:boolean,
    showTabs?: boolean
  }>(),  {
    isWebView: false,
    showTabs: true
  });

const tabs: TabItem[] = [
  {
    name: EntitiesEnum.Facilities,
    label: "Gyms",
  },
  {
    name: EntitiesEnum.Trainers,
    label: "Trainers",
  },
];

const route = useRoute();
onMounted(() => {
  if(props.isWebView) {
    useCurrentLocation.value = true;
  }
}); 

const preferredTab: EntitiesEnum = localStorage.getItem(
  "preferred_booking_tab"
) as EntitiesEnum;
const activeTab = ref<EntitiesEnum>((preferredTab && !route.params?.type) ? EntitiesEnum.Facilities : "" as any);

const tabsChanged = (ev: EntitiesEnum) => {
  if (ev) activeTab.value = ev;
  selectedItem.value = null;
};

const mapPositionChanged = debounce((result: MapFilters) => {
  selectedItem.value = null;
  mapPosition.value = result;
}, 500);

const mapItemsChanged = (items: MapMarkerItem[]) => {
  locations.value = items;
};

const changeMapView = (isFullscreen: boolean) => {
  isMapFullscreen.value = isFullscreen;
};

const showDraggable = () => {
  layout?.value?.showDraggable();
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

const { onResult, loading: meLoading } = useQuery(MeDocument);

onResult(({ data }) => {
  activeTab.value =
    data.me?.settings?.find(
      (setting: any) =>
        setting.setting.code === SettingsCodeEnum.DisplayPreference
    )?.value || EntitiesEnum.Facilities;
  localStorage.setItem("preferred_booking_tab", activeTab.value);

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
      lat: data.me.address.lat,
      lng: data.me.address.lng,
    };
  }
});

const steps: OnboardingStep[] = [
  {
    attachTo: { element: "#page-tabs" },
    content: {
      title: "Switch between gyms and trainers!",
      description: "With one touch, you can switch between gyms and trainers.",
    },
  },
  {
    attachTo: { element: "#discover" },
    content: {
      title: "Discover Icon",
      description:
        "Check out events happening near you. Meet new people and join in on the fun. ",
    },
  },
  {
    attachTo: { element: "#workout" },
    content: {
      title: "Daily Workouts",
      description:
        "Purchase daily workouts from your favorite trainer or find someone new!",
    },
  },
];

const router = useRouter();
const { isOnboardingDone } = useSettings();

router.beforeResolve((to)=> {
  if(to.params.type){
    activeTab.value = to.params.type as any;
  }
  console.log("activeTab.value", activeTab.value);
});

const onboardingFinished = () => {
  router.push({ name: EntitiesEnum.TrainerDemo });
};

const availabilityFilters = ref();

const applyFilters = (filters: any) => {
  availabilityFilters.value = filters;
};

const resetFilters = () => {
  availabilityFilters.value = null;
};

const selectItem = (id: string) => {
  selectedItem.value = selectedItem.value !== id ? id : null;
};
</script>

<style lang="scss" scoped>
.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 9999;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 32vw;
}

.page-map {
  height: 100%;
}
</style>
