<template>
	<div class="w-100 h-100 main-dailys-content">
    <div class="search-form-container">
      <search-workouts-form
        placeholder="Search dailys..."
        @handle-item-click="onItemClick"
        :route-name="EntitiesEnum.UserWorkoutList"
      />
    </div>

    <div class="w-100 h-100 daily-container">
      <ion-spinner
        v-if="workoutsLoading"
        name="lines"
        class="spinner"
      />
      <div 
        v-else
        class="page-content ion-padding-horizontal w-100 h-100" 
      >
        <workouts-preview-swiper 
          :workouts="workouts" 
          @trialEnd="onTrialEnd"
        />
      </div>
    </div>
  </div>

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
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  toastController
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
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
  RoleEnum
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed, onMounted } from "vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useRouter } from "vue-router";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import PageTabs from "@/general/components/PageTabs.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import SearchWorkoutsForm from "@/general/components/forms/SearchWorkoutsForm.vue";
import { FreeMode } from "swiper";
import MyVideoPlayer from "@/general/components/VideoPlayer.vue";
import WorkoutsPreviewSwiper from "@/users/views/workouts/components/WorkoutsPreviewSwiper.vue";
import BlurredScreenModal from "@/users/views/workouts/components/BlurredScreenModal.vue";
import { TABS } from "@/const/user-workouts-tabs";

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
  console.log(selectedDailyId.value);
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

<style scoped lang="scss">
.holder-content {
  padding-top: 24px;
  padding-bottom: 16px;

}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.infinite-scroll {
  margin-top: 16px;
  margin-bottom: -24px;
}

.empty-section {
	margin-top: 100px;
}
.workout-list {
	background-color: var(--gray-700);
  margin-top: 54px;

  &__top {
    margin-bottom: 16px;
    padding: 8px 24px;
  }
}
.banner {
  padding: 32px;
  min-height: 160px;
  max-height: 160px;
  width: 100%;
  border-radius: 12px;
  position: relative;
  overflow: hidden;

  &__background-image {
    position: absolute;
    inset: 0;
    img {
      margin-top: -10%;
    }
  }
  &__background-shadow {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        180deg,
        rgba(17, 17, 18, 0) 0%,
        rgba(17, 17, 18, 0.88) 100%,
        rgba(17, 17, 18, 0.88) 100%
      );
  }
  &__background-text {
    position: absolute;
    inset: 0;
    padding: 42px 62px 31px 61px;
  }

  &__title {
    padding: 0;
    color: #FFF;
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
  &__text {
    color: #FFF;
    font-family: Lato;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
    letter-spacing: 0.1px;
  }
}
.filter-tabs {
  width: 100%;
  gap: 12px;
  
  ion-button#rounded {
    --border-radius: 100px;
    font: 500 14px/1 Lato;
    height: 36px;
  }
  ion-button#normal {
    font: 500 14px/1 Lato;
    height: 36px;
  }
  
  .selected {
    color: var(--main-color);
  }
  .normal {
    color: var(--grey-text);
  }
}
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
  }
  .w-half {
    width: 50%;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-12 {
    font-size: 12px;
  }
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .gap-16 {
    gap: 16px;
  }
}
.main-dailys-content {
  position: relative;
}
.search-form-container {
  position: absolute;
  z-index: 3000000;
  width: 100%;
}
.daily-container {
  padding: 24px;
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

ion-modal {
  --width: 100%;
  --height: 100%;
}
</style>
