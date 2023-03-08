<template>
  <base-layout>
    <template #header>
      <page-header @back="handleBack" back-btn title="Reviews" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <template v-else>
        <div class="rating ion-padding-horizontal">
          <div class="rating-star">
            <span class="rating-star__title">{{ trainer?.score }}</span>
            <star-rating :model-value="trainer?.score || 0" size="medium" />
            <ion-text color="medium" class="rating-star__reviews">
              based on {{ trainer?.reviews_count }} reviews
            </ion-text>
          </div>
          <like-rating
            :likes="trainer?.positive_reviews_count || 0"
            :total="trainer?.reviews_count || 0"
            :dislikes="trainer?.negative_reviews_count || 0"
            :progressValue="progressValue"
          />
        </div>
        <div class="tabs-holder">
          <page-tabs
            :tabs="tabs"
            class="page-tabs ion-padding-horizontal"
            :value="activeTab"
            @change="tabsChanged"
          />
          <div class="content ion-padding-horizontal">
            <ion-spinner v-if="reviewLoading" name="lines" class="spinner" />
            <div v-else>
              <review-item
                v-for="review in reviews"
                :key="review.id"
                class="review-item"
                :avatar-url="review.avatarUrl"
                :full-name="review.fullName"
                :date="review.date"
                :rating="review.rating"
                :text="review.text"
              />
            </div>
          </div>
        </div>
      </template>
    </template>
    <template #footer>
      <gym-fixed
        :loading="loading"
        :title="trainerName"
        :location="trainerLocation"
      >
        <template #button>
          <ion-button
            expand="block"
            color="primary"
            class="fixed-holder__button"
            @click="onAddReview"
            v-if="isAbleToAddReview"
          >
            Add review
          </ion-button>
        </template>
      </gym-fixed>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton, IonText, IonSpinner } from "@ionic/vue";
import { Review as UserReview } from "@/ts/types/user";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import StarRating from "@/users/components/StarRating.vue";
import LikeRating from "@/users/components/LikeRating.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
import GymFixed from "@/general/components/blocks/GymFixed.vue";
import { ref, computed } from "vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import router from "@/router";
import { useQuery } from "@vue/apollo-composable";
import {
  FeedbackEntityEnum,
  Query,
  Review,
  ReviewsDocument,
  ReviewTypeEnum,
  UserDocument,
} from "@/generated/graphql";
import { useRoute } from "vue-router";

const route = useRoute();

const tabs: TabItem[] = [
  {
    name: ReviewTypeEnum.Recent,
    label: "Recent",
  },
  {
    name: ReviewTypeEnum.Positive,
    label: "Positive",
  },
  {
    name: ReviewTypeEnum.Negative,
    label: "Negative",
  },
];

const activeTab = ref<ReviewTypeEnum>(ReviewTypeEnum.Recent);

const tabsChanged = (newTab: ReviewTypeEnum) => {
  activeTab.value = newTab;
};

const onAddReview = () => {
  router.push({ name: EntitiesEnum.TrainingReview });
};

const handleBack = () => {
  router.go(-1);
};

const { result: reviewsResult, loading: reviewLoading } = useQuery(
  ReviewsDocument,
  () => ({
    id: route.params.id,
    type: FeedbackEntityEnum.User,
    review_type: activeTab.value,
  })
);

const reviews = computed(() =>
  reviewsResult?.value?.reviews?.data.reduce(
    (acc: UserReview[], cur: Review) => {
      acc.push({
        id: cur.id,
        date: cur.created_at,
        rating: cur.score || 0,
        text: cur.review,
        avatarUrl: cur.author?.avatarUrl || "",
        fullName: `${cur.author?.first_name} ${cur.author?.last_name}`,
      });
      return acc;
    },
    []
  )
);

const { result, loading } = useQuery<Pick<Query, "user">>(UserDocument, {
  id: route.params.id,
});

const trainer = computed(() => result.value?.user);

const isAbleToAddReview = computed(
  () => trainer.value?.was_visited_by_me && !trainer.value?.was_commented_by_me
);

const trainerName = computed(
  () =>
    `${result.value?.user?.first_name} ${result.value?.user?.last_name}` || ""
);
const trainerLocation = computed(
  () => result.value?.user?.facilities[0]?.address?.street || ""
);

const progressValue = computed(() => {
  if (
    trainer.value?.positive_reviews_count &&
    trainer.value?.negative_reviews_count &&
    trainer.value?.score
  ) {
    return (
      ((trainer.value?.positive_reviews_count +
        trainer.value?.negative_reviews_count) /
        trainer.value?.score) *
      100
    );
  } else {
    return 0;
  }
});
</script>

<style scoped lang="scss">
.rating {
  display: flex;
  padding-top: 30px;
  margin-bottom: 25px;

  .like-rating {
    flex: 1 1 auto;
  }
}

.rating-star {
  text-align: center;
  flex: 0 0 50%;
  border-right: 1px solid var(--gray-600);
  padding-right: 5px;

  &__title {
    display: block;
    margin-bottom: 20px;
    font-size: 32px;
    line-height: 1.1;
    color: var(--ion-color-white);
  }

  &__reviews {
    font-size: 14px;
    line-height: 1.5;
  }
}

.tabs-holder {
  .page-tabs {
    margin-bottom: 25px;
    padding-left: 24px;
    padding-right: 24px;

    :deep(.review) {
      margin-bottom: 20px;
    }
  }
}

.review-item {
  margin-bottom: 16px;
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
</style>
