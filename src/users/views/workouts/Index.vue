<template>
  <base-layout
    header-fixed
    ref="layout"
    :offset-top="20"
    :initial-breakpoint="0.4"
  >
    <template #header>
      <search-workouts-form
        placeholder="Search dailys..."
        @handle-item-click="onItemClick"
        :route-name="EntitiesEnum.UserWorkoutList"
        :class="{'ios-app-top': isPlatform('ios')}"
      />
    </template>

    <template #content>
      <ion-spinner
        v-if="workoutsLoading"
        name="lines"
        class="spinner"
      />
      <div 
        v-else
        class="page-content ion-padding-horizontal w-100 h-100" 
        :class="{'ios-app-top': isPlatform('ios')}"
      >
        <workouts-preview-swiper 
          v-if="workouts.length"
          :workouts="workouts" 
          @trialEnd="onTrialEnd"
        />
        <base-empty-page
          v-else
          icon="energy"
          title="Dailys Empty"
          context="No dailys are posted yet..."
        />
      </div>
    </template>
  </base-layout>

  <page-tabs
    v-if="!workoutsLoading"
    :tabs="TABS"
    class="page-tabs"
    :value="EntitiesEnum.UserWorkouts"
    @change="tabsChanged"
  />
  <blurred-screen-modal
    :is-open="isOpenBlurredScreenModal"
    :preview-url="dailyData?.previewUrl"
    @visibility="isOpenBlurredScreenModal = false"
    @purchase-daily="purchaseWorkout"
    :disabled="addToCartLoading"
  />
</template>

<script setup lang="ts">
import { IonSpinner, isPlatform, toastController } from "@ionic/vue";
import { TABS } from "@/const/user-workouts-tabs";
import WorkoutsSwiper from "./components/WorkoutsSwiper.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import {
  RecommendedWorkoutsDocument,
  Workout,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  WorkoutsDocument,
  QueryWorkoutsOrderByColumn,
  SortOrder,
  AddToCartDocument,
  AddToCartPurchasableEnum,
} from "@/generated/graphql";
import { computed, ref } from "vue";
// import PageTabs from "@/general/components/PageTabs.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import SearchWorkoutsForm from "@/general/components/forms/SearchWorkoutsForm.vue";
import WorkoutItem from "@/users/components/Workout.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import MyVideoPlayer from "@/general/components/VideoPlayer.vue";
import WorkoutsPreviewSwiper from "@/users/views/workouts/components/WorkoutsPreviewSwiper.vue";
import BlurredScreenModal from "./components/BlurredScreenModal.vue";
import BaseEmptyPage from "@/general/components/base/BaseEmptyPage.vue";

const router = useRouter();
const itemSelected = ref<Workout | null>(null);

const workoutsLoaded = ref<boolean>(false);
const activePage = ref<number>(1);
const totalWorkouts = ref<number>(0);
const searchQuery = ref<string>("");
const isOpenBlurredScreenModal = ref(false);
const selectedDailyId = ref<number>();

const { result: workoutsResult, loading: workoutsLoading } = useQuery(
  WorkoutsDocument,
  {
    first: 6,
    page: activePage.value,
    dynamic_search: searchQuery.value,
    orderByColumn: QueryWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Desc,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const workouts = computed(() => workoutsResult.value?.workouts?.data.filter((workout: any) => !workout.was_ordered_by_me));

const tabsChanged = (name: EntitiesEnum) => {
  router.push({
    name,
  });
};

const onItemClick = (item: Workout) => {
  itemSelected.value = item;
};

const onTrialEnd = (id: number) => {
  isOpenBlurredScreenModal.value = true;
  selectedDailyId.value = id;
};

const { mutate: addToCartMutation, loading: addToCartLoading } =
  useMutation(AddToCartDocument);

const purchaseWorkout = () => {
  addToCartMutation({
    input: {
      purchasable_id: selectedDailyId.value,
      purchasable: AddToCartPurchasableEnum.Workout,
    },
  })
    .then((res) => {
      isOpenBlurredScreenModal.value = false;
      router.push({
        name: EntitiesEnum.WorkoutOrder,
        params: {
          id: selectedDailyId.value,
        },
        query: {
          cart_id: res?.data?.addToCart?.id,
        },
      });
    })
    .catch(async () => {
      const toast = await toastController.create({
        message: "Something went wrong. Try again.",
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "warning-toast",
      });
      toast.present();
    });
};
</script>

<style lang="scss" scoped>
.holder-content {
  padding-bottom: 76px;
  padding-top: calc(64px + var(--ion-safe-area-top));
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.search-form {
  height: 80px;
  background: var(--ion-background-color);
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 1000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 120px;
}
.page-content {
  padding-top: 24px;
  padding-bottom: 16px;
}
.workout {
  display: block;

  &:not(:first-child) {
    margin-top: 16px;
  }
}
</style>
