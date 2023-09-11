<template>
  <base-layout>
    <template #header>
      <ion-buttons>
        <ion-back-button
          class="back-btn"
          icon="assets/icon/arrow-back.svg"
          @click="handleBack"
        >
        </ion-back-button>
      </ion-buttons>
      <search-form hide-results @search="searchFacilities" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-spinner v-if="!facilitiesLoaded" name="lines" class="spinner" />
        <template v-else-if="facilities && facilities.length">
          <ion-title slot="start" class="title"> Gyms Nearby</ion-title>
          <activity
            v-for="facility in facilities"
            :key="facility.id"
            :activity="facility"
            @click="openFacility(facility.id)"
          />
          <ion-infinite-scroll
            threshold="100px"
            class="infinite-scroll"
            @ionInfinite="loadMoreFacilities"
            v-if="facilities.length < totalFacilities"
          >
            <ion-infinite-scroll-content
              loading-spinner="lines"
              loading-text="Loading more..."
            >
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </template>
        <empty-block
          v-else
          title="Empty here"
          button-text="Explore more"
          text="No gyms were found near you"
          @button-click="router.push({ name: EntitiesEnum.Facilities })"
        />
      </div>
    </template>
  </base-layout>

  <page-tabs
    :tabs="tabs"
    class="page-tabs"
    :value="EntitiesEnum.ActivitiesNearby"
    @change="tabsChanged"
  />
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonTitle,
  IonButtons,
  toastController,
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import Activity from "@/users/components/Activity.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import {
  FacilitiesDocument,
  FacilitiesQuery,
  MeDocument,
  SettingsCodeEnum,
} from "@/generated/graphql";
import { ref } from "vue";
import { ActivityItem } from "@/interfaces/ActivityItem";
import { useRouter } from "vue-router";
import { discoverTabs } from "@/const/tabs";
import { PositionLatLng } from "@/ts/types/map";
import { Geolocation } from "@capacitor/geolocation";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { distanceBetweenCoords } from "@/helpers/distance-between-coords";

const router = useRouter();

const tabs: TabItem[] = discoverTabs;

const facilitiesLoaded = ref<boolean>(false);
const activePage = ref<number>(1);
const totalFacilities = ref<number>(0);
const searchQuery = ref<string>("");
const myCoords = ref<PositionLatLng>({
  lat: 0,
  lng: 0,
});

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};

const { onResult: gotMe } = useQuery(
  MeDocument,
  {},
  {
    fetchPolicy: "no-cache",
  }
);

gotMe(async (response) => {
  if (
    !response.data.me.settings.find(
      (settings: any) =>
        settings.setting.code === SettingsCodeEnum.UsePhoneLocation
    )?.value
  ) {
    myCoords.value = {
      lat: response.data.me.address.lat,
      lng: response.data.me.address.lng,
    };
    getFacilities();
  } else {
    myCoords.value = await getUserLocation();
    getFacilities();
  }
});

const getUserLocation = async (): Promise<PositionLatLng> => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition()
      .then((myPosition) => {
        resolve({
          lat: myPosition.coords.latitude,
          lng: myPosition.coords.longitude,
        });
      })
      .catch(async () => {
        const toast = await toastController.create({
          message:
            "Failed to get your location. Check the permissions for the application.",
          duration: 2000,
          icon: "assets/icon/info.svg",
          cssClass: "warning-toast",
        });
        toast.present();
        await Geolocation.requestPermissions();
        reject();
      });
  });
};

const {
  load: getNearFacilities,
  refetch: updateNearFacilities,
  onResult: gotNearFacilities,
} = useLazyQuery<FacilitiesQuery>(
  FacilitiesDocument,
  {
    first: 6,
    page: activePage.value,
    search: searchQuery.value?.length ? searchQuery.value : undefined,
    near: {
      radius: 10,
      lat: myCoords.value.lat,
      lng: myCoords.value.lng,
    },
  },
  {
    fetchPolicy: "no-cache",
  }
);

const getFacilities = () => {
  getNearFacilities(
    FacilitiesDocument,
    {
      first: 6,
      page: activePage.value,
      search: searchQuery.value?.length ? searchQuery.value : undefined,
      near: {
        radius: 10,
        lat: myCoords.value.lat,
        lng: myCoords.value.lng,
      },
    },
    {
      fetchPolicy: "no-cache",
    }
  );
};

const loadMoreFacilities = (ev: InfiniteScrollCustomEvent) => {
  if (facilities.value.length < totalFacilities.value) {
    activePage.value++;
    updateNearFacilities({
      first: 6,
      page: activePage.value,
      search: searchQuery.value?.length ? searchQuery.value : undefined,
      near: {
        radius: 10,
        lat: myCoords.value.lat,
        lng: myCoords.value.lng,
      },
    })?.then(() => {
      ev.target.complete();
    });
  }
};

gotNearFacilities((response) => {
  totalFacilities.value = response.data.facilities?.paginatorInfo.total ?? 0;

  const newFacilities: ActivityItem[] =
    response.data?.facilities?.data.map((facility) => ({
      name: facility.name,
      id: facility.id,
      distance: `~${distanceBetweenCoords(
        {
          lat: facility.address?.lat || 0,
          lng: facility.address?.lng || 0,
        },
        {
          lat: myCoords.value.lat || 0,
          lng: myCoords.value.lng || 0,
        }
      ).toFixed(1)}mi`,
      rating: String(facility.score?.toFixed(1)),
      photo: facility.media?.length ? facility.media[0]?.pathUrl : undefined,
    })) ?? [];

  if (
    facilitiesLoaded.value &&
    facilities.value?.length &&
    facilities.value.findIndex(
      (trainer) => newFacilities.length && trainer.id === newFacilities[0].id
    ) > -1
  )
    return;

  facilitiesLoaded.value = true;

  facilities.value =
    !facilities.value ||
    response.data.facilities?.paginatorInfo.firstItem === null ||
    response.data.facilities?.paginatorInfo.firstItem === 1
      ? newFacilities
      : [...facilities.value, ...newFacilities];
});

const facilities = ref<ActivityItem[] | null>(null);

const searchFacilities = (query: string) => {
  activePage.value = 1;
  totalFacilities.value = 0;
  facilitiesLoaded.value = false;
  searchQuery.value = query;
  getFacilities();
};

const openFacility = (facilityId: string | number) => {
  router.push({
    name: EntitiesEnum.NearbyGym,
    params: {
      id: facilityId,
    },
  });
};

const handleBack = () => {
  router.go(-1);
};
</script>

<style lang="scss" scoped>
:deep(.header) {
  display: flex;
  background: var(--ion-background-color);
}

:deep(.search-form) {
  flex: 1 1 auto;
  padding-bottom: 8px;
}

.back-btn {
  display: inline-block;
  height: 32px;
  min-width: 32px;
  margin-left: 15px;
  margin-top: calc(10px + var(--ion-safe-area-top));
  border-radius: 50%;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --color: var(--ion-color-white);
  background: rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(8px);
}

.holder-content {
  padding-top: 24px;
  padding-bottom: 80px;
}

.title {
  padding: 0;
  margin-bottom: 16px;
  font: 500 16px/1.5 var(--ion-font-family);
  --color: var(--ion-color-white);
}

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

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.empty-block {
  margin-top: 48px;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}
</style>
