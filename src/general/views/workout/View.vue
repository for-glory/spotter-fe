<template>
  <base-layout hideNavigationMenu>
    <template #content>
      <div
        class="workout-item common-style"
        :class="{ 'workout-item--hidden': hidden }"
        @click="handlePlay"
      >
        <div class="top-buttons w-100 d-flex justify-content-between">
          <span @click.stop="onBack">
            <ion-icon src="assets/icon/arrow-back.svg" class="color-white" />
          </span>
          <span @click.stop="showSettingsModal">
            <ion-icon src="assets/icon/three-dot.svg" />
          </span>
        </div>
        <div class="workout-item__photo">
          <div v-if="videoPath" class="h-100 video-content">
            <video 
              :src="videoPath" 
              ref="videoRef" 
              style="max-width: 100%; width: 100%; max-height: 100%"
              autoplay 
            />
            <div class="video-mask" />
          </div>
          <div v-else class="w-100 d-flex align-items-center justify-content-center">
            <ion-text class="color-white font-bold font-20">No video uploaded</ion-text>
          </div>
        </div>
        <div class="d-flex justify-content-between workout-item__inner">
          <div class="d-flex-col justify-content-end align-items-start">
            <div class="workout-item__head">
              <ion-label class="workout-item__title"> {{ title }}</ion-label>
            </div>
            <ion-text class="workout-item__info">
              <ion-icon icon="assets/icon/time.svg" />
              <span>
                <template v-if="duration">
                  {{ timeConvertToHuman(duration) }}
                  <ion-text color="light" class="workout-item__info-dot"
                    >&nbsp;&#183;&nbsp;</ion-text
                  >
                </template>
                {{ type }}
                <ion-text color="light" class="workout-item__info-dot">
                  &nbsp;&#183;&nbsp;
                </ion-text>
                {{ trainer }}
              </span>
            </ion-text>
          </div>
          <div class="d-flex-col justify-content-end align-items-end gap-24">
            <div class="d-flex-col gap-8">
              <div class="d-flex align-items-center gap-12" @click.stop="showReviews">
                <ion-icon src="assets/icon/messages.svg" class="w-24 h-24 color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(reviewsCount ?? 0) }}</ion-text>
              </div>
              <div class="d-flex align-items-center gap-12" @click.stop="showWorkoutModal('purchases')">
                <ion-icon src="assets/icon/dollar-circle.svg" class="w-24 h-24 color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(totalRevenue ?? 0) }}</ion-text>
              </div>
              <div class="d-flex align-items-center gap-12" @click.stop="showWorkoutModal('likes')">
                <ion-icon src="assets/icon/heart-filled.svg" class="w-24 h-24 color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white" styl>{{ formatNumber(recommendedCount ?? 0) }}</ion-text>
              </div>
              <div class="d-flex align-items-center gap-12" @click.stop="showWorkoutModal('views')">
                <ion-icon src="assets/icon/eye.svg" class="w-24 h-24  color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(reviewsCount ?? 0) }}</ion-text>
              </div>
            </div>
            <div class="d-flex align-items-center gap-12 justify-content-end">
              <ion-icon 
                @click.stop="shareWorkout"
                icon="assets/icon/share.svg" class="w-24 h-24 color-gold" 
              />
            </div>
          </div>
        </div>
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
    :title="'Do you want to delete' + (type === 'PASS' ? ' Gym pass' : ' drop-in?') + '?'"
    :description="(type === 'PASS' ? 'Gym Pass' : 'Drop-in') + ' will be deleted'"
    button-text="Delete"
    @discard="onDelete"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  toastController,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  Workout,
  DeleteDailyDocument 
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysStore } from "@/general/stores/useDailysStore";
import { useDailysItemsStore } from "@/general/stores/useDailysItemsStore";
import { timeConvertToHuman } from "@/helpers/date-formater";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import WorkoutModal from "@/general/components/modals/workout/WorkoutModal.vue";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { Share } from "@capacitor/share";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('analytics');

const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const store = useDailysStore();
const dailysItemsStore = useDailysItemsStore();
const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id);
const dailysItem = computed(() => dailysItemsStore.dailysData.find((item: any) => item.id === id.value));
const title = computed(() => dailysItem.value?.title);
const trainer = computed(() => dailysItem.value?.trainer.first_name + ' ' + dailysItem.value?.trainer.last_name);
const type = computed(() => dailysItem.value?.type.name);
const duration = computed(() => dailysItem.value?.duration);
const recommendedCount = computed(() => dailysItem.value?.recommended_count);
const totalRevenue = computed(() => dailysItem.value?.total_revenue);
const reviewsCount = computed(() => dailysItem.value?.reviews_count);
const videoPath = computed(() => `${process.env.VUE_APP_MEDIA_URL}${dailysItem.value?.video}`);
const share = true;

const videoRef = ref<any>();
const isPlaying = ref<boolean>(true);

const workoutModal = ref<typeof WorkoutModal | null>(null);

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

const onBack = () => {
  router.go(-1);
};

const shareWorkout = async (event: any) => {
  event.preventDefault();
  await Share.share({
    title: title.value,
    url: `${process.env.VUE_APP_URL}/users/workouts/${id.value}`,
    dialogTitle: "Share",
  });
};

const showWorkoutModal = (type: string) => {
  switch(type) {
    case 'views' :
      workoutModal.value?.present({ 
        title: 'Views',
        description: `Viewd by ${reviewsCount.value} people`,
        total_count: reviewsCount.value
      });
      break;
    
    case 'purchases' :
      workoutModal.value?.present({ 
        title: 'Purchases',
        description: `Total purchases made ${totalRevenue.value}`,
        total_count: totalRevenue.value
      });
      break;

    case 'likes' :
      workoutModal.value?.present({ 
        title: 'Views',
        description: `Liked by ${recommendedCount.value} people`,
        total_count: recommendedCount.value
      });
      break;
  }
  
}

const isSettingModalOpen = ref<boolean>(false);
const showSettingsModal = (id: number) => {
  isSettingModalOpen.value = true;
};
const handleDelete = () => {
  isSettingModalOpen.value = false;
  showModal();
}
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
}

const handleEdit = () => {
  isSettingModalOpen.value = false;
  router.push({ name: EntitiesEnum.EditWorkout, params: { id: id.value } });
}

const showReviews = () => {
  router.push({ name: EntitiesEnum.WorkoutReviews, params: { id: id.value } });
}

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
}

const handlePlay = () => {
  if(videoRef.value.paused) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
}

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
.video-content {
  position: relative;
}
.play-button {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 64px;
  display: flex;
  align-items: end;
  justify-content: center;
  inset: 0;
  z-index: 1500;

  ion-icon {
    width: 82px;
    height: 82px;
  }
}
.video-mask {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #00000ca0, #ffffff0a);
}
.top-buttons {
  position: fixed;
  top: 24px;
  left: 0px;
  padding: 12px;

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
</style>
