<template>
  <ion-modal 
    ref="workoutModal"
    class="modal"
    swipeToClose 
  >
    <div class="modal-content">
      <div class="left-section d-flex-col w-199 gap-16">
        <div class="video-container relative">
          <video 
            autoplay 
            :src="daily.video" 
            :poster="daily.preview"
            ref="videoRef"
            @click.stop="tooglePlay"
            class="w-100 h-100"
          />
          <div class="absolute top-buttons w-100 d-flex justify-content-end">
            <span @click.stop="showSettingsModal">
              <ion-icon src="assets/icon/three-dot.svg" />
            </span>
          </div>
        </div>
        <div class="box d-flex align-items-center justify-content-between description">
          <div class="d-flex-col align-items-start  w-100">
            <ion-label class="font-20 font-medium"> {{ daily.title }}</ion-label>
            <ion-label class="d-flex align-items-center justify-content-start">
              <ion-icon class="clock-icon" icon="assets/icon/time.svg" />
              <span>
                <template v-if="daily.duration >= 0">
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
            </ion-label>
          </div>
          <div class="d-flex align-items-bottom gap-12 justify-content-end h-100">
            <ion-icon 
              @click.stop="shareWorkout(daily)"
              icon="assets/icon/share.svg" 
              class="color-gold" 
              style="width: 24px; height: 24px; cursor: pointer;"
            />
          </div>
        </div>
      </div>
      <div class="d-flex-col gap-8">
        <div>
          <ion-segment 
            :value="viewType || 'revenue'" 
            mode="ios"  
            id="page-tabs"
            class="tabs"
            @ionChange="segmentChanged"
          >
            <ion-segment-button 
              value="revenue" 
              layout="icon-start"
              class="tabs__item color-gold"
            >
              <ion-label>{{ formatNumber(daily.total_revenue) }}</ion-label>
              <ion-icon src="assets/icon/dollar-circle.svg" />
            </ion-segment-button>
            <ion-segment-button 
              value="review" 
              layout="icon-start"
              class="tabs__item color-gold"
            >
              <ion-label>{{ formatNumber(daily.reviews_count) }}</ion-label>
              <ion-icon 
                src="assets/icon/messages.svg" 
              />
            </ion-segment-button>
            <ion-segment-button 
              value="recommend" 
              layout="icon-start"
              class="tabs__item color-gold"
            >
              <ion-label>{{ formatNumber(daily.recommended_count) }}</ion-label>
              <ion-icon src="assets/icon/heart-filled.svg"></ion-icon>
            </ion-segment-button>
            <ion-segment-button 
              value="view" 
              layout="icon-start"
              class="tabs__item color-gold"
            >
              <ion-label>{{ formatNumber(daily.views_count) }}</ion-label>
              <ion-icon src="assets/icon/eye.svg"></ion-icon>
            </ion-segment-button>
          </ion-segment>
        </div>
        <div class="box customer-content">
          <ion-text>
            {{ reviewDescription }}
          </ion-text>
          <div class="customer-list">
            <customer-item 
              v-for="customer in customerList"
              :key="customer.id"
              :name="customer.first_name + ' ' + customer.last_name"
              :avatarUrl="customer.avatarUrl"
              :hasMessage="customer.was_commented_by_self"
            />
          </div>
        </div>
      </div>
    </div>
  </ion-modal>
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
</template>

<script setup lang="ts">
import {
  IonModal,
  IonButton,
  IonContent,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
  IonSearchbar,
  IonIcon,
  IonLabel,
  toastController,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  SegmentCustomEvent
} from "@ionic/vue";
import {
  ReviewTypeEnum,
  FeedbackEntityEnum,
  ReviewsDocument,
  DeleteDailyDocument,
  DailyViewsAndPurchasesDocument
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { defineExpose, defineEmits, ref, defineProps, computed } from "vue";
import { Capacitor } from '@capacitor/core';
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { EntitiesEnum } from "@/const/entities";
import { useLazyQuery } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Share } from "@capacitor/share";
import CustomerItem from "@/general/components/modals/workout/CustomerItem.vue";

const router = useRouter();
const route = useRoute();

const workoutModal = ref<typeof IonModal | null>(null);
const daily = ref<any>();
const videoRef = ref<any>();
const viewType = ref<string>('revenue');

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

const customerList = computed(() => {
  switch(viewType.value) {
    case 'revenue' :
      return dailyStatus.value?.workout.purchased_users;
    case 'review' :
      return reviewsResult.value?.reviews.data;
    case 'recommend' :
      return dailyStatus.value?.workout.purchased_users;
    case 'view' :
      return dailyStatus.value?.workout.purchased_users;
  }
});

const reviewDescription = computed(() => {
  switch(viewType.value) {
    case 'revenue' :
      return 'Total purchases made ' + daily.value?.total_revenue;
    case 'review' :
      return 'Reviewd by ' + daily.value?.reviews_count + ' people';
    case 'recommend' :
      return 'Liked by ' + daily.value?.recommended_count + ' people';
    case 'view' :
      return 'Viewed by ' + daily.value?.views_count + ' people';
  }
})

const { result: dailyStatus, loading: dailysStatusLoading, refetch: refetchDailyStatus, onResult: gotDailysStatus } = useQuery(
  DailyViewsAndPurchasesDocument,
  {
    id: daily.value?.id
  },
);
const { result: reviewsResult, loading: reviewLoading, refetch: refetchReviews, onResult: getReviews } = useQuery(
  ReviewsDocument,
  () => ({
    id: daily.value?.id,
    type: FeedbackEntityEnum.Workout,
    review_type: "Recent",
  })
);

const getPaymentNumber = (value: number) => {
  if(value > 1e3){
    return (value / 1e3).toFixed(0) + 'K';
  } else {
    return value;
  }
};

const present = ( props: any ) => {
  daily.value = props;
  daily.value.video = `${process.env.VUE_APP_MEDIA_URL}${props.video}`;
  daily.value.preview = `${process.env.VUE_APP_MEDIA_URL}${props.preview}`;
  console.log(daily.value.id);
  refetchDailyStatus({ id: daily.value.id });
  refetchReviews({ 
    id: daily.value.id,
    type: FeedbackEntityEnum.Workout,
    review_type: "Recent",
  });
  workoutModal?.value?.$el.present();
};

const tooglePlay = () => {
  if(videoRef.value.paused) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
  videoRef.value.blur();
};
const isSettingModalOpen = ref<boolean>(false);
const showSettingsModal = () => {
  // let daily = dailysItems.value[activeIndex.value];
  // store.setWorkout({
  //   title: daily.title,
  //   type: daily.type.id,
  //   duration: daily.duration,
  //   bodyParts: daily.workoutMuscleTypesIds,
  //   price: getSumForPayment(daily.price, true),
  //   trainer: `${daily.trainer?.first_name} ${daily.trainer?.last_name}` || '',
  //   exercise: {
  //     videoPath: `${process.env.VUE_APP_MEDIA_URL}${daily.video}`,
  //     description: daily.description
  //   }
  // });
  // store.setValue('path', daily.video);
  // store.setValue('workoutPreview', `${process.env.VUE_APP_MEDIA_URL}${daily.preview}`);
  // console.log('store.path: ', store.path);
  isSettingModalOpen.value = true;
};
const segmentChanged = (event: SegmentCustomEvent) => {
  if (!event.detail.value) return;
  viewType.value = event.detail.value;
}

const shareWorkout = async (daily: any) => {
  await Share.share({
    title: daily.title,
    url: `${process.env.VUE_APP_URL}/users/workouts/${daily.id}`,
    dialogTitle: "Share",
  });
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

defineExpose({
  present,
});

</script>

<style scoped lang="scss">
.modal {
  --ion-backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);
  --width: 720px;
  --height: 720px;

  .backdrop {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: #0000006a;
  }

  &__content {
    background: var(--gray-800);
    border-radius: 18px 18px 0 0;
    min-height: 60%;
    padding: 30px 0;
    position: relative;
  }

  &__closed {
    top: 12px;
    left: 50%;
    width: 48px;
    height: 4px;
    display: block;
    border-radius: 2px;
    margin-left: -24px;
    position: absolute;
    background: rgba(var(--ion-color-dark-contrast-rgb), 0.12);
  }

  &__title {
    display: block;
    margin-bottom: 16px;
    font-weight: 500;
    font-size: 16px;
    line-height: 1.5;
    color: var(--ion-color-white);
  }
}
.modal-content {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
}
.left-section {
  border-radius: 12px;
  max-width: 60%;
  max-height: 100%;
  flex: 1;

  .video-container {
    max-height: calc(100% - 90px);
    z-index: 1;
  }

  video {
    border-radius: 12px;
    max-height: 100%;
  }
}

.clock-icon {
  line-height: 1;
  font-size: 24px;
  margin-right: 4px;
  color: var(--ion-color-primary);
}
.box {
  background-color: #262626;
}
.description {
  padding: 16px 19px 10px 20px;
}
.tabs {
  padding: 4px;
  border-radius: 8px;
  pointer-events: auto;
  backdrop-filter: blur(20px);
  background: #262626;

  &__item {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 400;
    min-width: var(--btn-min-width);
    --padding-top: 6px;
    --padding-bottom: 6px;
    --padding-start: 6px;
    --padding-end: 10px;
    --color-checked: var(--gray-700);
    --indicator-color: #ffffff6a;
    font-family: "Yantramanav";

    &::part(indicator) {
      padding: 0;
    }
  }
}
.customer-list {
  max-height: calc(100% - 29px);
  height: calc(100% - 29px);
  padding-top: 26px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 12px;

  &::-webkit-scrollbar {
    width: 5px;
    height: 10px;
    background-color: #aaa;
    border-radius: 12px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 12px;
    background: #000;
  }
}
.customer-content {
  max-height: calc(100% - 52px);
  height: calc(100% - 52px);
  padding: 20px 9px 9px 16px;
}
.relative {
  position: relative;
}
.absolute {
  position: absolute;
}
.top-buttons {
  left: 0px;
  bottom: 0px;
  cursor: pointer;
  z-index: 10;

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
</style>
