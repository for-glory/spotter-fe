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
      <search-form hide-results @search="searchTrainers" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-spinner v-if="!trainersLoaded" name="lines" class="spinner" />
        <template v-else-if="trainers && trainers.length">
          <ion-title slot="start" class="title"> Trainers Nearby </ion-title>
          <activity
            v-for="trainer in trainers"
            :key="trainer.id"
            :activity="trainer"
            @click="openTrainer(trainer.id)"
          />
          <ion-infinite-scroll
            threshold="100px"
            class="infinite-scroll"
            @ionInfinite="loadMoreTrainers"
            v-if="trainers.length < totalTrainers"
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
          text="No trainers were found near you"
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
  MeDocument,
  RoleEnum,
  SettingsCodeEnum,
  UsersDocument,
  UsersQuery,
} from "@/generated/graphql";
import { ref } from "vue";
import { ActivityItem } from "@/interfaces/ActivityItem";
import { useRouter } from "vue-router";
import { discoverTabs } from "@/const/tabs";
import { PositionLatLng } from "@/ts/types/map";
import { Geolocation } from "@capacitor/geolocation";
import { distanceBetweenCoords } from "@/helpers/distance-between-coords";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();

const tabs: TabItem[] = discoverTabs;

const trainersLoaded = ref<boolean>(false);
const activePage = ref<number>(1);
const totalTrainers = ref<number>(0);
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
    getTrainers();
  } else {
    myCoords.value = await getUserLocation();
    getTrainers();
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
  load: getNearTrainers,
  refetch: updateNearTrainers,
  onResult: gotNearTrainers,
} = useLazyQuery<UsersQuery>(
  UsersDocument,
  {
    first: 6,
    page: activePage.value,
    role: RoleEnum.Trainer,
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

const getTrainers = () => {
  getNearTrainers(
    UsersDocument,
    {
      first: 6,
      page: activePage.value,
      role: RoleEnum.Trainer,
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

const loadMoreTrainers = (ev: InfiniteScrollCustomEvent) => {
  if (trainers.value && trainers.value.length < totalTrainers.value) {
    activePage.value++;
    updateNearTrainers({
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

gotNearTrainers((response) => {
  totalTrainers.value = response.data.users?.paginatorInfo.total ?? 0;

  const newTrainers: ActivityItem[] =
    response.data?.users?.data.map((trainer) => ({
      name: `${trainer.first_name} ${trainer.last_name}`,
      id: trainer.id,
      distance: `~${distanceBetweenCoords(
        {
          lat: trainer.address?.lat || 0,
          lng: trainer.address?.lng || 0,
        },
        {
          lat: myCoords.value.lat || 0,
          lng: myCoords.value.lng || 0,
        }
      ).toFixed(1)}mi`,
      rating: String(trainer.score?.toFixed(1)),
      photo: trainer.avatarUrl ?? undefined,
    })) ?? [];

  if (
    trainersLoaded.value &&
    trainers.value?.length &&
    trainers.value.findIndex(
      (trainer) => newTrainers.length && trainer.id === newTrainers[0].id
    ) > -1
  )
    return;

  trainersLoaded.value = true;

  trainers.value =
    !trainers.value ||
    response.data.users?.paginatorInfo.firstItem === null ||
    response.data.users?.paginatorInfo.firstItem === 1
      ? newTrainers
      : [...trainers.value, ...newTrainers];
});

const trainers = ref<ActivityItem[] | null>(null);

const searchTrainers = (query: string) => {
  activePage.value = 1;
  totalTrainers.value = 0;
  trainersLoaded.value = false;
  searchQuery.value = query;
  getTrainers();
};

const openTrainer = (trainerId: string | number) => {
  router.push({
    name: EntitiesEnum.Trainer,
    params: {
      id: trainerId,
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
