<template>
    <div class="main-content">
        <div class="page-header">
            <ion-title class="banner__title">Trainers</ion-title>
        </div>
        <div class="content-wrapper" :class="{'view-all' : isViewAll}">
            <div class="page-map">
                <div class="search-bar">
                    <search-form :filters="availabilityFilters
                        ? {
                            availability: {
                                date_from: availabilityFilters.date_from,
                                date_to: availabilityFilters.date_to,
                            },
                        }
                        : {}
                        " :type="activeTab" @handle-focus="isSearchOnFocus = true"
                        @handle-blur="isSearchOnFocus = false" :filters-btn="activeTab === EntitiesEnum.Trainers"
                        @apply-filters="applyFilters" @reset-filters="resetFilters" />
                </div>
                <items-map v-if="!meLoading" :items="locations" :center="userLocation" @marker-click="selectItem"
                    @fullscreen="changeMapView" :selected-item="selectedItem" @change-position="mapPositionChanged"
                    :use-current-location="useCurrentLocation">
                </items-map>
            </div>
            <div class="nearby-gym hide-scrollbar">
                <facilities-page :filters="mapPosition" @toggle-modal="showDraggable"
                    v-if="activeTab === EntitiesEnum.Facilities" @location-items="mapItemsChanged" :selected="selectedItem"
                    @deselect="selectedItem = null" />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import ItemsMap, { MapMarkerItem } from "@/general/components/ItemsMap.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import FacilitiesPage from "@/views/FacilitiesPage.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { SettingsCodeEnum, MeDocument } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useSettings } from "@/hooks/useSettings";
import { OnboardingStep } from "@/ts/types/onboardingStep";
import { MapFilters, PositionLatLng } from "@/ts/types/map";
import debounce from "lodash/debounce";
import { IonTitle } from "@ionic/vue";

const locations = ref<MapMarkerItem[]>([]);
const selectedItem = ref<string | null>(null);
const isMapFullscreen = ref<boolean>(false);
const layout = ref<typeof BaseLayout | null>(null);
const isSearchOnFocus = ref<boolean>(false);
const isViewAll = ref<boolean>(false);

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

const preferredTab: EntitiesEnum = localStorage.getItem(
    "preferred_booking_tab"
) as EntitiesEnum;
const activeTab = ref<EntitiesEnum>(preferredTab ?? EntitiesEnum.Facilities);

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
    isViewAll.value = true;
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
    userLocation.value = {
        lat: 45.877436191895825,
        lng: -110.29373452193954,
    };
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
    height: 430px;
    min-height: 430px;
    display: flex;
    justify-content: center;

    .search-bar {
        position: absolute;
        max-width: 500px;
        width: 100%;
        margin: auto;
    }
}

.main-content {
    padding: 16px 90px;
    padding-bottom: 0;
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-header {
        margin-bottom: 30px;

        ion-title {
            font-size: 24px;
            padding: 0;
            color: var(--gold);
        }
    }

    .content-wrapper {
        padding: 0 40px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        height: 100%;
        position: relative;

        .nearby-gym {
            background: var(--gray-800);
            padding: 16px 30px;
            margin-top: -20px;
            z-index: 99;
            position: relative;
            border-radius: 32px 32px 0 0;
            flex: 2;
        }
        &.view-all {
            .nearby-gym {
                overflow: auto;
                position: absolute;
                width: calc(100% - 80px);
                top: 100px;
                right: 0;
                left: 0;
                bottom: 0;
                margin: auto;
            }
        }
    }
}
</style>
  