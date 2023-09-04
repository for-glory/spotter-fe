<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack">
        <template #custom-btn>
          <ion-button @click="handleCreate" class="header-btn">
            <ion-icon src="assets/icon/three-dot.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <div
        class="workout-item common-style"
        :class="{ 'workout-item--hidden': hidden }"
      >
        <div class="workout-item__photo">
          <ion-img :src="pathUrl"></ion-img>
          
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
              <div class="d-flex align-items-center gap-12" @click="showReviews">
                <ion-icon src="assets/icon/messages.svg" class="w-24 h-24 color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(24567) }}</ion-text>
              </div>
              <div class="d-flex align-items-center gap-12" @click="showWorkoutModal('purchases')">
                <ion-icon src="assets/icon/dollar-circle.svg" class="w-24 h-24 color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(3832) }}</ion-text>
              </div>
              <div class="d-flex align-items-center gap-12" @click="showWorkoutModal('likes')">
                <ion-icon src="assets/icon/heart-filled.svg" class="w-24 h-24 color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white" styl>{{ formatNumber(3300000) }}</ion-text>
              </div>
              <div class="d-flex align-items-center gap-12" @click="showWorkoutModal('views')">
                <ion-icon src="assets/icon/eye.svg" class="w-24 h-24  color-gold"></ion-icon>
                <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(12345678) }}</ion-text>
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
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsByFacilityDocument,
  RecommendedWorkoutsByBodyPartsDocument,
  RecommendedWorkoutsByTypeDocument,
  WorkoutDocument,
  Workout,
  HideWorkoutDocument,
  ShowWorkoutDocument,
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useDailysItemStore } from "@/general/stores/useDailysItemStore";
import { timeConvertToHuman } from "@/helpers/date-formater";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import WorkoutModal from "@/general/components/modals/workout/WorkoutModal.vue";
import { Share } from "@capacitor/share";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const tab = ref<string>('analytics');

const { id: myId } = useId();
const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const store = useDailysItemStore();
const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id);
const pathUrl = computed(() => store.workoutPath);
const title = computed(() => store.workoutTitle);
const trainer = computed(() => store.trainer);
const type = computed(() => store.workoutType);
const duration = computed(() => store.workoutDuration);
const share = true;

const workoutModal = ref<typeof WorkoutModal | null>(null);

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
        description: `Viewd by ${3309234} people`
      });
      break;
    
    case 'purchases' :
      workoutModal.value?.present({ 
        title: 'Purchases',
        description: `Total purchases made ${3309234}`
      });
      break;

    case 'likes' :
      workoutModal.value?.present({ 
        title: 'Views',
        description: `Liked by ${3309234} people`
      });
      break;
  }
  
}

const showReviews = () => {
  router.push({ name: EntitiesEnum.WorkoutReviews, params: { id: id.value } });
}

const formatNumber = (num: number) => {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e4) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return Math.floor(num / 1e3) + (num >= 1e3 ? ',' : '') + (num % 1e3);
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

  .d-flex-col {
    display: flex;
    flex-direction: column;
  }
  .gap-24 {
    gap: 24px;
  }
  .gap-12 {
    gap: 12px;
  }
  .gap-8 {
    gap: 8px;
  }
  .gap-6 {
    gap: 6px;
  }
  .gap-4 {
    gap: 4px;
  }


  .font-bold {
    font-weight: 700;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-light {
    font-weight: 300;
  }

  .font-12 {
    font-size: 12px;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-18 {
    font-size: 18px;
  }
  .font-20 {
    font-size: 20px;
  }
  .font-24 {
    font-size: 24px;
  }

  .color-gray {
    color: #afafaf;
  }
  .color-gold {
    color: #E1DBC5;
  }
  .color-gray-400 {
    color: var(--gray-400);
  }
  .color-white {
    color: white;
  }
  .color-fitness-white{
    color: #EFEFEF;
  }
}
</style>
