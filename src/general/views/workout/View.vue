<template>
  <div ref="swipeContainer">
    <base-layout hideNavigationMenu>
      <template #content>
        <div class="common-style relative d-flex align-items-center justify-content-center h-100">
          <div class="fixed top-buttons w-100 d-flex justify-content-between">
            <span @click.stop="onBack">
              <ion-icon src="assets/icon/arrow-back.svg" class="color-white" />
            </span>
            <span @click.stop="showSettingsModal">
              <ion-icon src="assets/icon/three-dot.svg" />
            </span>
          </div>
          <swiper 
            :slidesPerView="1"
            :spaceBetween="16"
            class="w-100"
            style="max-height: 100vh"
            @swiper="onSwiper"
          >
            <swiper-slide 
              v-for="daily in dailysItems" 
              :key="daily.id"
              style="height: calc(100vh - 40px);"
              class="d-flex align-items-center justify-content-center relative"
            >
              <ion-spinner
                v-if="dailysStatusLoading"
                name="lines"
                class="spinner"
              />
              <div v-else class="dailys-container">
                <daily-video-player 
                  :path="daily.video"
                  :preview="daily.preview"
                  :play="dailysItems[activeIndex].id === daily.id"
                />
                <div class="d-flex-col justify-content-end align-items-start details details__left">
                  <div class="workout-item__head">
                    <ion-label class="workout-item__title"> {{ daily.title }}</ion-label>
                  </div>
                  <ion-text class="workout-item__info">
                    <ion-icon icon="assets/icon/time.svg" />
                    <span>
                      <template v-if="daily.duration">
                        <ion-text color="light" class="workout-item__info-dot">
                          &nbsp;&#183;&nbsp;
                        </ion-text>
                        {{ getDurationText(daily.duration) }}
                      </template>
                      {{ type }}
                      <ion-text color="light" class="workout-item__info-dot">
                        &nbsp;&#183;&nbsp;
                      </ion-text>
                      {{ daily.trainer?.first_name + ' ' + daily.trainer?.last_name }}
                    </span>
                  </ion-text>
                </div>
                <div class="d-flex-col justify-content-end align-items-end gap-24 details details__right">
                  <div class="d-flex-col gap-8">
                    <div class="d-flex align-items-center gap-12" @click.stop="showReviews">
                      <ion-icon src="assets/icon/messages.svg" class="w-24 h-24 color-gold"></ion-icon>
                      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(daily.reviews_count ?? 0) }}</ion-text>
                    </div>
                    <div class="d-flex align-items-center gap-12" @click.stop="showWorkoutModal('purchases', daily)">
                      <ion-icon src="assets/icon/dollar-circle.svg" class="w-24 h-24 color-gold"></ion-icon>
                      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(dailyStatus?.workout?.purchased_users?.length ?? 0) }}</ion-text>
                    </div>
                    <div class="d-flex align-items-center gap-12" @click.stop="showWorkoutModal('likes', daily)">
                      <ion-icon src="assets/icon/heart-filled.svg" class="w-24 h-24 color-gold"></ion-icon>
                      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(dailyStatus?.workout?.recommended_users?.length ?? 0) }}</ion-text>
                    </div>
                    <div class="d-flex align-items-center gap-12" @click.stop="showWorkoutModal('views', daily)">
                      <ion-icon src="assets/icon/eye.svg" class="w-24 h-24  color-gold"></ion-icon>
                      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(dailyStatus?.workout?.viewed_users?.length ?? 0) }}</ion-text>
                    </div>
                  </div>
                  <div class="d-flex align-items-center gap-12 justify-content-end">
                    <ion-icon 
                      @click.stop="shareWorkout(daily)"
                      icon="assets/icon/share.svg" class="w-24 h-24 color-gold" 
                    />
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </template>
    </base-layout>
    <workout-modal ref="workoutModal" />
    <ion-modal
      ref="modal"
      :is-open="isSettingModalOpen"
      class="settings-modal"
      @willDismiss="isSettingModalOpen = false"
    >
      <div class="main-buttons">
        <ion-button
          id="delete"
          @click="handleDelete"
          expand="block"
        >
          Delete Dailys
        </ion-button>
        <div class="split"/>
        <ion-button
          id="create"
          @click="handleEdit"
          expand="block"
        >
          Edit Dailys
        </ion-button>
      </div>
      <ion-button
        id="cancel"
        @click="isSettingModalOpen = false"
        expand="block"
      >
        Cancel
      </ion-button>
    </ion-modal>
    <confirmation
      :is-visible="showConfirmationModal"
      :title="'Do you want to delete' + (type === 'PASS' ? ' Passes' : ' drop-in?') + '?'"
      :description="(type === 'PASS' ? 'Passes' : 'Drop-in') + ' will be deleted'"
      button-text="Delete"
      @discard="onDelete"
      @decline="hideModal"
    />
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  toastController,
  IonSpinner
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  Workout,
  DeleteDailyDocument,
  DailyViewsAndPurchasesDocument
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import useRoles from "@/hooks/useRole";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysStore } from "@/general/stores/useDailysStore";
import { useDailysItemsStore } from "@/general/stores/useDailysItemsStore";
import { timeConvertToHuman } from "@/helpers/date-formater";
import { Share } from "@capacitor/share";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode, Swiper as Swipeer } from "swiper";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
// import dayjs from "dayjs";
import WorkoutModal from "@/general/components/modals/workout/WorkoutModal.vue";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import DailyVideoPlayer from "@/general/components/DailyVideoPlayer.vue";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('analytics');

const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const store = useDailysStore();
const dailysItemsStore = useDailysItemsStore();
const router = useRouter();
const route = useRoute();
const workoutModal = ref<typeof WorkoutModal | null>(null);
const id = ref<any>();
const share = true;
const dailysItems = computed(() => dailysItemsStore.dailysData);
console.log(dailysItems.value);

const swiperRef = ref<Swipeer>();
const activeIndex = ref<number>(0);

const swipeContainer = ref<any>();
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let isSwiping = false;

const {
  mutate: deleteDailys,
  loading,
  onDone: dailysDeleted,
} = useMutation(DeleteDailyDocument);

const {
  showConfirmationModal,
  hideModal,
  showModal: showModal,
} = useConfirmationModal();

const { result: dailyStatus, loading: dailysStatusLoading, refetch: refetchDailyStatus, onResult: gotDailysStatus } = useQuery(
  DailyViewsAndPurchasesDocument,
  {
    id: id.value
  },
);

const onBack = () => {
  router.push({ name: EntitiesEnum.WorkoutList });
};

onMounted(() => {
  id.value = route.params.id;
  let currentIndex = dailysItems.value.findIndex((daily: any) => daily.id === id.value);
  activeIndex.value = currentIndex;
  swiperRef.value?.slideTo(currentIndex);
  swipeContainer.value.addEventListener('touchstart', handleTouchStart);
  swipeContainer.value.addEventListener('touchmove', handleTouchMove);
  swipeContainer.value.addEventListener('touchend', handleTouchEnd);
});

const handleTouchStart = (event: any) => {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
  console.log("swipe start");
}

const handleTouchMove = (event: any) => {
  deltaX = event.touches[0].clientX - startX;
  deltaY = event.touches[0].clientY - startY;
  if (deltaY < -50 || deltaY > 50) {
    isSwiping = true;
  }
}

const handleTouchEnd = () => {
  if (isSwiping) {
    console.log('Swipe-up detected');
    router.go(-1);
  }
  startX = 0;
  startY = 0;
  deltaX = 0;
  deltaY = 0;
  isSwiping = false;
}

const onSwiper = (swiper: any) =>{
  swiperRef.value = swiper;
  id.value = route.params.id;
  let currentIndex = dailysItems.value.findIndex((daily: any) => daily.id === id.value);
  activeIndex.value = currentIndex;
  swiperRef.value?.slideTo(currentIndex);
}

watch(() => swiperRef.value?.activeIndex,
(newVal) => {
  console.log(newVal);
  activeIndex.value = newVal;
  id.value = dailysItems.value[activeIndex.value].id;
  router.push({
    name: router?.currentRoute?.value?.name,
    params: { id: id.value },
  });
  refetchDailyStatus({ id: id.value });
});

const shareWorkout = async (daily: any) => {
  await Share.share({
    title: daily.title,
    url: `${process.env.VUE_APP_URL}/users/workouts/${daily.id}`,
    dialogTitle: "Share",
  });
};

const showWorkoutModal = (type: string, daily: any) => {
  switch(type) {
    case 'views' :
      workoutModal.value?.present({ 
        title: 'Views',
        description: `Viewd by ${dailyStatus.value?.workout?.viewed_users?.length} people`,
        total_count: dailyStatus.value?.workout?.viewed_users?.length,
        customerList: dailyStatus.value?.workout?.viewed_users,
      });
      break;
    
    case 'purchases' :
      workoutModal.value?.present({ 
        title: 'Purchases',
        description: `Total purchases made ${dailyStatus.value?.workout?.purchased_users?.length}`,
        total_count: dailyStatus.value?.workout?.purchased_users?.length,
        customerList: dailyStatus.value?.workout?.purchased_users,
      });
      break;

    case 'likes' :
      workoutModal.value?.present({ 
        title: 'Views',
        description: `Liked by ${dailyStatus.value?.workout?.recommended_users?.length} people`,
        total_count: dailyStatus.value?.workout?.recommended_users?.length,
        customerList: dailyStatus.value?.workout?.recommended_users
      });
      break;
  }
  
}

const isSettingModalOpen = ref<boolean>(false);
const showSettingsModal = () => {
  let daily = dailysItems.value[activeIndex.value];
  store.setWorkout({
    title: daily.title,
    type: daily.type.id,
    duration: daily.duration,
    bodyParts: daily.workoutMuscleTypesIds,
    price: getSumForPayment(daily.price, true),
    trainer: `${daily.trainer?.first_name} ${daily.trainer?.last_name}` || '',
    exercise: {
      videoPath: `${process.env.VUE_APP_MEDIA_URL}${daily.video}`,
      description: daily.description
    }
  });
  store.setValue('path', daily.video);
  store.setValue('workoutPreview', `${process.env.VUE_APP_MEDIA_URL}${daily.preview}`);
  console.log('store.path: ', store.path);
  isSettingModalOpen.value = true;
};
const handleDelete = () => {
  isSettingModalOpen.value = false;
  showModal();
};
const onDelete = () => {
  hideModal();
  deleteDailys({ id: id.value })
    .then(async () => {
      const toast = await toastController.create({
        message: "Deleted successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      router.push({ name: EntitiesEnum.WorkoutList });
    })
    .catch(async (error) => {
      const toast = await toastController.create({
        message: "Something went wrong. Please try again.",
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();

      throw new Error(error);
    });
};

const handleEdit = () => {
  isSettingModalOpen.value = false;
  router.push({ name: EntitiesEnum.EditWorkout, params: { id: id.value } });
}

const showReviews = (daily: any) => {
  console.log({daily});
  router.push({ name: EntitiesEnum.WorkoutReviews, params: { id: id.value } });
};

const formatNumber = (num: number) => {
  if(num <= 9) {
    return num;
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e5) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return Math.floor(num / 1e3) + (num >= 1e3 ? ',' : '') + (num % 1e3);
  }
};

const getDurationText = (value: number) => {
  if(value < 60) {
    return value + ' s';
  } else if(value < 3600) {
    return (value / 60).toFixed(0) + ' min ' + value % 60 + ' s';
  } else {
    return (value / 60).toFixed(0) + ' h ' + (value % 3600) / 60 + ' min';
  }
};

</script>

<style scoped lang="scss">
.workout-item {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__inner {
    width: 100%;
    height: 100%;
    padding-bottom: 12px;
  }

  &__btn {
    height: 32px;
    margin: 0 -4px;
    font-size: 24px;
    display: block;
    min-width: 32px;
    --border-radius: 4px;
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

    &--hide {
      margin-left: auto;
    }

    ion-icon {
      font-size: 1em;
      filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.24));
    }
  }

  &__icon {
    width: 20px;
    height: 20px;
    align-self: flex-end;
    cursor: pointer;
  }

  &__photo {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -5;
    position: absolute;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 64px;
    font-weight: 700;
    line-height: 68px;
    color: var(--gray-700);

    .workout-item--hidden & {
      filter: grayscale(1);
    }

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    &:before {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      content: "";
      position: absolute;
      background: linear-gradient(
        180deg,
        rgba(17, 17, 18, 0) 0%,
        rgba(17, 17, 18, 0.88) 100%,
        rgba(17, 17, 18, 0.88) 100%
      );
    }
  }

  &__head {
    display: flex;
    margin-bottom: 4px;
    align-items: center;
    justify-content: flex-start;
  }

  &__title {
    display: block;
    font-size: 18px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 12px;
    color: white;

    .workout-item--hidden & {
      color: var(--ion-color-medium);
    }
  }

  &__info {
    display: flex;
    font-size: 14px;
    font-weight: 300;
    line-height: 24px;
    align-items: center;
    justify-content: flex-start;

    ion-icon {
      line-height: 1;
      font-size: 24px;
      margin-right: 4px;
      color: var(--ion-color-primary);
    }

    .workout-item--hidden & {
      color: var(--ion-color-medium);

      ion-icon {
        color: inherit;
      }
    }
  }
  &__info-dot {
    font-weight: 500;
    font-size: 16px;
  }
}
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
  }

  .font-16 {
    font-size: 16px;
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
}
.settings-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --background: none;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(
      100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );
  }
}
.main-buttons {
  border-radius: 8px;
  background: #262626;

  ion-button#create {
    --color: #EFEFEF;
    --background: none;
    font: 500 16px/1 Lato;
  }
  ion-button#delete {
    --color: #EB4336;
    --background: none;
    font: 500 16px/1 Lato;
  }
}
ion-button#cancel {
  --color: #FFFFFF6a;
  --background: #262626;
  font: 500 16px/1 Lato;
  margin-top: 16px;
}
.split {
  height: 1px;
  background-color: #3D3D3D;
}
.top-buttons {
  position: fixed;
  top: 24px;
  left: 0px;
  padding: 12px;
  z-index: 100;

  span {
    background-color: #0000002a;
    border-radius: 100px;
    padding: 4px;
    max-height: 32px;

    ion-icon {
      width: 24px;
      height: 24px;
    }
  }
}
.details {
  position: fixed;
  padding: 16px;
  padding-bottom: 24px;
  bottom: 0;

  &__left {
    left: 24px;
  }
  &__right {
    right: 24px;
  }
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.dailys-container {
  z-index: -15;
}
</style>
