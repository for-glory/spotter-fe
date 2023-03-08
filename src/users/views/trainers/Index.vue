<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
  <detail
    v-else
    :name="'Tamra Dae'"
    :likes="64"
    :total-rating="'5.00'"
    :dislikes="'0'"
    :is-followed="isFollowed"
    :photos-url="['assets/backgrounds/tamra.png']"
    :address="'20730 Johns Ferry Apt. 676'"
    @handle-book="onBook"
    @handle-edit="onEdit"
    @handle-follow="handleFollow"
    labilitiesTitle="Waiver and Labilities"
    :viewAllLink="reviews?.length ? EntitiesEnum.TrainerReviews : undefined"
  >
    <template #info>
      <div class="info">
        <div class="info__block">
          <ion-text class="main-info"> 40.00</ion-text>
          <ion-text class="secondary-info"> Hourly rate</ion-text>
        </div>
        <div class="separator" />
        <div class="info__block">
          <ion-text class="main-info"> 10</ion-text>
          <ion-text class="secondary-info"> Completed</ion-text>
        </div>
        <div class="separator" />
        <div class="info__block">
          <ion-text class="main-info"> 1</ion-text>
          <ion-text class="secondary-info"> Reviews</ion-text>
        </div>
      </div>
    </template>
    <template #reviews>
      <review-slides
        :reviews="userReviews"
        heightFixed
        v-if="userReviews?.length"
      />
      <ion-text color="secondary" class="no-reviews" v-else>
        There are no reviews yet...
      </ion-text>
    </template>
    <template #advantages v-if="userReviews?.length">
      <div v-for="certificate in userReviews?.length" :key="certificate.id">
        <advantage-item
          icon="assets/icon/advantages/certificate.svg"
          :title="'Certificate 1'"
        />
      </div>
    </template>
    <template #labilities>
      <div
        v-for="lability in userReviews?.length"
        :key="lability.id"
        id="open-pdf-modal"
      >
        <advantage-item
          icon="assets/icon/advantages/certificate.svg"
          :title="' Weiver And Labilities 1'"
        />
      </div>
    </template>
  </detail>
  <Onboarding
    :steps="steps"
    page-classname="detail"
    v-if="!isOnboardingDone"
    @finish="onboardingFinished"
  />
</template>

<script setup lang="ts">
import { IonText, IonSpinner } from "@ionic/vue";
import { useRouter } from "vue-router";
import Detail from "@/general/components/Detail.vue";
import { useMutation } from "@vue/apollo-composable";
import { UpdateUserSettingsDocument } from "@/generated/graphql";
import AdvantageItem from "@/general/components/blocks/AdvantageItem.vue";
import ReviewSlides from "@/general/components/blocks/ratings/ReviewSlides.vue";
import { EntitiesEnum } from "@/const/entities";
import Onboarding from "@/general/components/Onboarding.vue";
import { useSettings, setSettings } from "@/hooks/useSettings";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";
import { Review as UserReview } from "@/ts/types/user";

import { ref } from "vue";
import { OnboardingStep } from "@/ts/types/onboardingStep";

const router = useRouter();

const steps: OnboardingStep[] = [
  {
    attachTo: { element: "#footer-info" },
    content: {
      title: "Book a trainer",
      description: "Click 'Book Now' to begin booking process",
    },
  },
];

const { isOnboardingDone } = useSettings();

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

const onboardingFinished = () => {
  setSettings([{ isOnboardingDone: true }]);

  const { id } = useId();

  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

settingsUpdated(() => {
  router.push({ name: EntitiesEnum.Facilities });
});

const userReviews = ref<UserReview[]>([
  {
    id: 1,
    date: "6 June, 2022",
    avatarUrl: "assets/mock/user.png",
    fullName: "Sharon Jem",
    rating: 4.9,
    text: "Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.",
  },
  {
    id: 1,
    date: "6 June, 2022",
    avatarUrl: "assets/mock/user.png",
    fullName: "Sharon Jem",
    rating: 4.9,
    text: "Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.",
  },
]);
</script>

<style scoped lang="scss">
ion-text {
  font-weight: 400;
  font-size: 14px;
  color: var(--gray-400);

  &.main-info {
    font-weight: 500;
    font-size: 16px;
    padding: 4px;
    --color: var(--white);
  }

  &.secondary-info {
    font-weight: 300;
    font-size: 14px;
  }
}

.info {
  display: flex;
  justify-content: space-between;
  margin: 25px 16px;
  background-color: var(--gray-700);
  padding: 16px;
  text-align: center;
  border-radius: 8px;
  gap: 20px;

  &__block {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.separator {
  height: 32px;
  width: 1px;
  margin: auto 0;
  background-color: var(--gray-600);
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--white);
}

.review-slide {
  width: 85%;
}

.no-reviews {
  margin: 16px;
  padding: 16px;
  display: block;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  border-radius: 8px;
  background: var(--gray-700);
}
</style>
