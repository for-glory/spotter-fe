<template>
  <base-layout
    draggable
    header-fixed
    :initial-breakpoint="0.4"
    :draggable-background="draggableBackground"
  >
    <template #header>
      <page-header back-btn @back="handleBack" :transparent="true">
        <template #custom-btn>
          <ion-button
            class="header-btn"
            @click="handleEdit"
            v-if="editButton || isMyProfile"
          >
            <ion-icon icon="assets/icon/more.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #static>
      <div v-if="photosUrl" class="photos">
        <detail-photo :photos-url="photosUrl" :name="name || ''" />
      </div>
      <div class="symbols" v-if="!photosUrl && !videoUrl">{{ symbols }}</div>
      <div v-if="videoUrl" class="video">
        <video-player
          :pathUrl="videoUrl"
          :width="800"
          :height="350"
          :photoUrl="photoUrl"
        />
      </div>
    </template>
    <template #draggable>
      <div class="detail__container">
        <div class="detail__header ion-padding-horizontal">
          <div class="main-info">
            <ion-title class="name" v-if="name">
              {{ name }}
            </ion-title>
            <ion-text class="address" v-if="address">
              <ion-icon
                src="assets/icon/geolocation.svg"
                class="address__icon"
              />
              {{ address }}
              <span class="distance" v-if="distance">&nbsp;{{ distance }}</span>
            </ion-text>
          </div>
          <follow
            v-if="!hiddenReviews && !isMyProfile"
            class="follow"
            :is-followed="isFollowed"
            @handle-click="$emit('handle-follow')"
          />
          <share class="follow" @share="shareEvent" v-if="showShareButton" />
        </div>
        <slot name="info"></slot>
        <slot name="content"></slot>
        <div v-if="!hiddenReviews" class="reviews__container">
          <div class="reviews__header">
            <ion-text class="reviews__title">Reviews</ion-text>
            <rating is-total :value="totalRating" />
            <ion-text class="rating rating__likes">
              <ion-icon src="assets/icon/like.svg" class="rating__icon" />
              {{ likes }}
            </ion-text>
            <ion-text class="rating rating__dislikes">
              <ion-icon src="assets/icon/dislike.svg" class="rating__icon" />
              {{ dislikes }}
            </ion-text>
            <router-link
              :to="{ name: viewAllLink }"
              class="reviews__all"
              v-if="viewAllLink"
            >
              View all
            </router-link>
          </div>
          <div class="reviews__content">
            <slot name="reviews"></slot>
          </div>
        </div>
        <div
          class="advantages__container"
          v-if="$slots.advantages && showAdvantages"
        >
          <div class="advantages__header">
            <ion-text class="advantages__title">
              {{ advantagesTitle }}
            </ion-text>
          </div>
          <div class="advantages__content">
            <slot name="advantages"></slot>
          </div>
        </div>
        <div
          class="advantages__container"
          v-if="$slots.equipments && showEquipments"
        >
          <div class="advantages__header">
            <ion-text class="advantages__title">
              {{ equipmentsTitle }}
            </ion-text>
          </div>
          <div class="advantages__content">
            <slot name="equipments"></slot>
          </div>
        </div>
        <div class="advantages__container" v-if="certificatesTitle">
          <div class="advantages__header">
            <ion-text class="advantages__title">
              {{ certificatesTitle }}
            </ion-text>
          </div>
          <div class="advantages__content">
            <slot name="certificates"></slot>
          </div>
        </div>
        <div class="advantages__container" v-if="labilitiesTitle">
          <div class="advantages__header">
            <ion-text class="advantages__title">
              {{ labilitiesTitle }}
            </ion-text>
          </div>
          <div class="advantages__content">
            <slot name="labilities"></slot>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <gym-fixed
        v-if="role === EntitiesEnum.User && !hiddenFooter"
        :title="name"
        :location="footerSubtitle || address"
      >
        <template #button>
          <ion-button
            expand="block"
            color="primary"
            class="fixed-holder__button"
            :disabled="disabled"
            @click="handleBook"
            v-if="isTrusted"
            v-show="!ordered"
          >
            {{ buttonText }}
          </ion-button>
        </template>
      </gym-fixed>
      <div
        class="ion-padding-horizontal ion-padding-top button-panel"
        v-else-if="isMyProfile"
      >
        <ion-button
          expand="block"
          @click="handleStart"
          class="fixed-holder__button"
          :disabled="gettingProfile"
        >
          <template v-if="!gettingProfile">Let's Start</template>
          <ion-spinner v-else name="lines" />
        </ion-button>
      </div>
      <div v-else></div>
    </template>
  </base-layout>
</template>
<script setup lang="ts">
import { IonTitle, IonIcon, IonText, IonButton, IonSpinner } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import Follow from "@/general/components/blocks/Follow.vue";
import Share from "@/general/components/blocks/Share.vue";
import Rating from "@/general/components/blocks/ratings/Rating.vue";
import GymFixed from "@/general/components/blocks/GymFixed.vue";
import DetailPhoto from "@/general/components/blocks/DetailPhoto.vue";
import { defineProps, defineEmits, withDefaults, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import VideoPlayer from "@/general/components/VideoPlayer.vue";
import useId from "@/hooks/useId";
import { useLazyQuery } from "@vue/apollo-composable";
import { MeDocument } from "@/generated/graphql";
const props = withDefaults(
  defineProps<{
    name?: string;
    address?: string;
    totalRating?: number | string;
    likes?: number | string;
    dislikes?: number | string;
    photosUrl?: string[];
    isFollowed?: boolean;
    buttonText?: string;
    hiddenReviews?: boolean;
    showShareButton?: boolean;
    advantagesTitle?: string;
    equipmentsTitle?: string;
    footerSubtitle?: string;
    videoUrl?: string;
    editButton?: boolean;
    distance?: string;
    photoUrl?: string;
    certificatesTitle?: string;
    labilitiesTitle?: string;
    draggableBackground?: string;
    viewAllLink?: string;
    hiddenFooter?: boolean;
    disabled?: boolean;
    showAdvantages?: boolean;
    showEquipments?: boolean;
    ordered?: boolean;
    symbols?: string;
    isTrusted?: boolean;
  }>(),
  {
    buttonText: "Book now",
    hiddenReviews: false,
    showShareButton: false,
    advantagesTitle: "Certifications",
    equipmentsTitle: "",
    editButton: false,
    address: "",
    draggableBackground: "",
    like: 0,
    dislikes: 0,
    totalRating: "0.0",
    hiddenFooter: false,
    disabled: false,
    ordered: false,
    symbols: "",
    isTrusted: true,
  }
);
const emits = defineEmits<{
  (e: "handle-follow"): void;
  (e: "handle-book"): void;
  (e: "handle-edit"): void;
}>();
const router = useRouter();
const handleBack = () => {
  router.go(-1);
};
const handleBook = () => {
  emits("handle-book");
};
const handleEdit = () => {
  emits("handle-edit");
};
const { role } = JSON.parse(localStorage.getItem("user") || "{}");
const { id } = useId();
const route = useRoute();
const isMyProfile = computed(() => route.params.id === id);
const {
  onResult: gotProfile,
  load: getProfile,
  loading: gettingProfile,
} = useLazyQuery(MeDocument, {
  fetchPolicy: "no-cache",
});
const handleStart = () => {
  getProfile();
};
gotProfile((response) => {
  const user = {
    ...JSON.parse(localStorage.getItem("user") ?? "{}"),
    first_name: response.data.me.first_name,
    last_name: response.data.me.last_name,
  };
  localStorage.setItem("user", JSON.stringify(user));
  router.push({ name: EntitiesEnum.TrainerSchedule });
});
const shareEvent = async () => {
  await Share.share({
    title: props.name,
    url: `https://${process.env.VUE_APP_URL}/users/activites/event/${route.params.id}`,
    dialogTitle: "Share",
  });
};
</script>
<style scoped lang="scss">
ion-title {
  font-family: "Yantramanav", serif;
  font-weight: 500;
  display: inline-block;
  font-size: 20px;
  line-height: 150%;
  padding: 0;
  --color: var(--ion-color-white);
}

ion-text {
  font-weight: 400;
  font-size: 14px;
  color: var(--gray-400);

  &.main-info {
    font-weight: 500;
    font-size: 16px;
    padding: 4px;
    --color: var(--ion-color-white);
  }

  &.secondary-info {
    font-weight: 300;
    font-size: 14px;
  }
}

.detail {
  &__container {
    padding-bottom: 24px;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 6px;
  }
}

.main-info {
  display: flex;
  flex: 1 1 100%;
  flex-direction: column;
}

.name {
  padding-bottom: 9px;
}

.address {
  display: flex;
  align-items: flex-start;

  &__icon {
    font-size: 18px;
    padding-right: 10px;
  }
}

.distance {
  color: var(--ion-color-primary);
}

.follow {
  margin-top: 2px;
  margin-right: 13px;
}

.photos {
  z-index: 10;
  width: 100vw;
  height: 100%;
  position: relative;

  .swiper {
    height: 100%;
  }
}

.video {
  width: 100vw;
  z-index: 10;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  height: 100%;

  .video-js .vjs-tech {
    position: static !important;
  }

  .vjs-tech {
    position: static !important;
  }
}

.reviews {
  &__container {
    margin-bottom: 16px;
  }

  &__header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    gap: 10px;
    padding: 0 16px;
    margin-bottom: 14px;
  }

  &__all {
    font-weight: 400;
    font-size: 14px;
    margin-left: auto;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }
}

.advantages {
  &__header {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
    padding: 10px 16px;
    margin-bottom: 6px;
  }

  &__title {
    font-weight: 500;
    font-size: 16px;
    color: var(--ion-color-white);
  }

  &__content {
    display: flex;
    padding: 0 16px;
    flex-wrap: wrap;
  }
}

.rating {
  display: flex;
  align-items: center;

  &__icon {
    font-size: 18px;
    margin-right: 3px;
  }

  &__likes {
    color: var(--ion-color-success-tint);
  }

  &__dislikes {
    color: var(--ion-color-danger-tint);
  }
}

.header-btn {
  margin: 0;
  height: 32px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  backdrop-filter: blur(4px);
  border-radius: 50%;
  --border-radius: 50% !important;
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
  --background: rgba(var(--ion-color-black-rgb), 0.12);

  ion-icon {
    font-size: 1em;
  }
}

.share-btn {
  margin-left: 16px;
}

.button-panel {
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));

  .button {
    margin: 0;
  }
}

.fixed-holder {
  .button {
    margin: 0;
  }
}

.symbols {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  font-size: 84px;
  line-height: 1.5;
  font-weight: 700;
  text-align: center;
  position: absolute;
  align-items: center;
  flex-direction: column;
  color: var(--gray-700);
  justify-content: center;
  background: var(--gray-600);
}
</style>