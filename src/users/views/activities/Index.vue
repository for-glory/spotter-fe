<template>
  <base-layout :hide-navigation-menu="isSearchOnFocus">
    <template #header>
      <search-form
        :type="EntitiesEnum.ActivitiesNearby"
        @handle-focus="isSearchOnFocus = true"
        @handle-blur="isSearchOnFocus = false"
      />
    </template>

    <template #content>
      <div class="holder-content">
        <template
          v-if="workouts?.length || facilities?.length || trainers?.length"
        >
          <template v-if="workouts?.length">
            <ion-toolbar class="header">
              <ion-title slot="start" class="title">Daily Workouts</ion-title>
              <ion-button
                slot="end"
                fill="clear"
                color="primary"
                class="header__btn"
              >
                <router-link :to="{ name: EntitiesEnum.Workouts }">
                  View All
                </router-link>
              </ion-button>
            </ion-toolbar>
            <swiper
              free-mode
              slidesPerView="auto"
              :spaceBetween="16"
              :slidesOffsetAfter="16"
              :slidesOffsetBefore="16"
              :modules="[FreeMode]"
            >
              <swiper-slide v-for="workout in workouts" :key="workout.id">
                <activity
                  @click="openActivity(workout.id)"
                  :activity="workout"
                />
              </swiper-slide>
            </swiper>
          </template>
          <template v-if="facilities?.length">
            <ion-toolbar class="header">
              <ion-title slot="start" class="title"> Gyms Nearby</ion-title>
              <ion-button
                slot="end"
                fill="clear"
                color="primary"
                class="header__btn"
              >
                <router-link :to="{ name: EntitiesEnum.GymsNearby }">
                  View All
                </router-link>
              </ion-button>
            </ion-toolbar>
            <swiper
              free-mode
              slidesPerView="auto"
              :spaceBetween="16"
              :slidesOffsetAfter="16"
              :slidesOffsetBefore="16"
              :modules="[FreeMode]"
            >
              <swiper-slide v-for="facility in facilities" :key="facility.id">
                <activity
                  @click="openFacility(facility.id)"
                  :activity="facility"
                />
              </swiper-slide>
            </swiper>
          </template>
          <template v-if="trainers?.length">
            <ion-toolbar class="header">
              <ion-title slot="start" class="title"> Trainers Nearby</ion-title>
              <ion-button
                slot="end"
                fill="clear"
                color="primary"
                class="header__btn"
              >
                <router-link :to="{ name: EntitiesEnum.TrainersNearby }">
                  View All
                </router-link>
              </ion-button>
            </ion-toolbar>
            <swiper
              free-mode
              slidesPerView="auto"
              :spaceBetween="16"
              :slidesOffsetAfter="16"
              :slidesOffsetBefore="16"
              :modules="[FreeMode]"
            >
              <swiper-slide v-for="trainer in trainers" :key="trainer.id">
                <activity
                  @click="openTrainer(trainer.id)"
                  :activity="trainer"
                />
              </swiper-slide>
            </swiper>
          </template>
        </template>
        <empty-block
          v-else-if="
            !workoutsLoading && !nearFacilitiesLoading && !nearTrainersLoading
          "
          title="Empty here"
          button-text="Explore more"
          text="Nothing was found near you"
          @button-click="router.push({ name: EntitiesEnum.Facilities })"
        />
        <ion-spinner v-else name="lines" class="spinner" />
      </div>
    </template>
  </base-layout>

  <page-tabs
    :tabs="tabs"
    class="page-tabs"
    v-if="!isSearchOnFocus"
    :value="EntitiesEnum.ActivitiesNearby"
    @change="tabsChanged"
  />
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import {
  IonButton,
  IonTitle,
  IonToolbar,
  toastController,
  IonSpinner,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import SearchForm from "@/general/components/forms/SearchActivitiesForm.vue";
import Activity from "@/users/components/Activity.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import {
  FacilitiesDocument,
  FacilitiesQuery,
  RoleEnum,
  UsersDocument,
  UsersQuery,
  RecommendedWorkoutsDocument,
  Workout,
  MeDocument,
  SettingsCodeEnum,
} from "@/generated/graphql";
import { computed, ref } from "vue";
import { ActivityItem } from "@/interfaces/ActivityItem";
import { useRouter } from "vue-router";
import { PositionLatLng } from "@/ts/types/map";
import { Geolocation } from "@capacitor/geolocation";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { distanceBetweenCoords } from "@/helpers/distance-between-coords";

const router = useRouter();

const tabs: TabItem[] = [
  {
    name: EntitiesEnum.ActivitiesNearby,
    label: "Nearby",
  },
  {
    name: EntitiesEnum.MyTraining,
    label: "Events",
  },
];

const isSearchOnFocus = ref<boolean>(false);

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};

const { result: workoutsResult, loading: workoutsLoading } = useQuery(
  RecommendedWorkoutsDocument,
  {
    page: 1,
    first: 7,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const workouts = computed<ActivityItem[]>(
  () =>
    workoutsResult.value?.recommendedWorkouts?.data.map((workout: Workout) => ({
      name: workout.title,
      id: workout.id,
      rating: String(workout.trainer.score?.toFixed(1)),
      photo: workout.previewUrl || undefined,
    })) ?? []
);

const { result: me, onResult: gotMe } = useQuery(
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
    getData(
      response.data.me.address?.lat ??
        Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
      response.data.me.address?.lng ??
        Number(process.env.VUE_APP_DEFAULT_POSITION_LNG)
    );
  } else {
    const location = await getUserLocation();
    getData(location.lat, location.lng);
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

const getData = (lat: number, lng: number) => {
  getNearFacilities(FacilitiesDocument, {
    first: 7,
    page: 1,
    near: {
      radius: 10,
      lat: lat,
      lng: lng,
    },
  });
  getNearTrainers(UsersDocument, {
    first: 7,
    page: 1,
    role: RoleEnum.Trainer,
    near: {
      radius: 10,
      lat: lat,
      lng: lng,
    },
  });
};

const {
  result: facilitiesResult,
  load: getNearFacilities,
  loading: nearFacilitiesLoading,
} = useLazyQuery<FacilitiesQuery>(
  FacilitiesDocument,
  {
    first: 7,
    page: 1,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const facilities = computed<ActivityItem[]>(
  () =>
    facilitiesResult.value?.facilities?.data.map((facility) => ({
      name: facility.name,
      id: facility.id,
      distance: `~${distanceBetweenCoords(
        {
          lat:
            facility.address?.lat ??
            Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
          lng:
            facility.address?.lng ??
            Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
        },
        {
          lat:
            me.value?.me.address?.lat ??
            Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
          lng:
            me.value?.me.address?.lng ??
            Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
        }
      ).toFixed(1)}mi`,
      rating: String(facility.score?.toFixed(1)),
      photo: facility.media?.length ? facility.media[0]?.pathUrl : undefined,
    })) ?? []
);

const {
  result: trainersResult,
  load: getNearTrainers,
  loading: nearTrainersLoading,
} = useLazyQuery<UsersQuery>(
  UsersDocument,
  {
    first: 7,
    page: 1,
    role: RoleEnum.Trainer,
  },
  {
    fetchPolicy: "no-cache",
  }
);
const trainers = computed<ActivityItem[]>(() => {
  return (
    trainersResult.value?.users?.data.map((trainer) => {
      const activity: ActivityItem = {
        name: `${trainer.first_name} ${trainer.last_name}`,
        id: trainer.id,
        distance: `~${distanceBetweenCoords(
          {
            lat:
              trainer.address?.lat ??
              Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
            lng:
              trainer.address?.lng ??
              Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
          },
          {
            lat:
              me.value?.me.address?.lat ??
              Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
            lng:
              me.value?.me.address?.lng ??
              Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
          }
        ).toFixed(1)}mi`,
        rating: String(trainer.score?.toFixed(1)),
        photo: trainer.avatarUrl ?? undefined,
      };
      return activity;
    }) ?? []
  );
});

const openActivity = (activityId: string | number) => {
  router.push({
    name: EntitiesEnum.UserWorkout,
    params: {
      id: activityId,
    },
  });
};

const openFacility = (facilityId: string | number) => {
  router.push({
    name: EntitiesEnum.NearbyGym,
    params: {
      id: facilityId,
    },
  });
};

const openTrainer = (trainerId: string | number) => {
  router.push({
    name: EntitiesEnum.Trainer,
    params: {
      id: trainerId,
    },
  });
};
</script>

<style lang="scss" scoped>
.search-form {
  padding-bottom: 8px;
  background: var(--ion-background-color);
}

.holder-content {
  padding-top: 24px;
  padding-bottom: 80px;
}

:deep(.facility-item) {
  --min-height: 160px;
}

.header {
  --min-height: 24px;
  --padding-top: 0;
  --padding-bottom: 7px;

  &__btn {
    height: 24px;
    margin: 0 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 8px;
    --padding-end: 8px;

    .modal--fullscreen & {
      display: none;
    }
  }
}

.title {
  padding-left: 17px;
  font: 500 16px/1.5 var(--ion-font-family);
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

.swiper {
  &:not(:last-child) {
    margin-bottom: 24px;
  }
}

.swiper-slide {
  width: 86%;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
