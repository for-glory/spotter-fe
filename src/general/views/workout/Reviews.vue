<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Reviews">
      </page-header>
    </template>
    <template #content>
      <div class="common-style">
        <div class="header">
          <ion-text class="font-medium font-14 color-white">Showing {{ formatNumber(totalReviewsCount) }} reviews</ion-text>
        </div>
        <div class="rating ion-padding-horizontal">
          <div class="rating-star">
            <span class="rating-star__title">{{ score }}</span>
            <star-rating :model-value="score ?? 0" size="medium" />
            <ion-text color="medium" class="rating-star__reviews">
              based on {{ formatNumber(totalReviewsCount) ?? 0 }} reviews
            </ion-text>
          </div>
          <like-rating
            :likes="positiveCount ?? 0"
            :total="totalReviewsCount ?? 0"
            :dislikes="negativeCount ?? 0"
            :progressValue="positiveCount / (positiveCount + negativeCount)"
          />
        </div>
        <div class="tabs-holder">
          <page-tabs
            :tabs="tabs"
            class="page-tabs ion-padding-horizontal"
            :value="activeTab"
            type="label"
            @change="tabsChanged"
          />
        </div>
        <div class="content ion-padding-horizontal w-100 h-100">
          <ion-spinner v-if="reviewLoading || dailyLoading" name="lines" class="spinner" />
          <div v-else-if="!reviews.length" class="d-flex align-items-center justify-content-center">
            <ion-text class="font-bold font-20 color-white">No reviews</ion-text>
          </div>
          <div v-else>
            <div
              v-for="review in reviews"
              :key="review.id"
              class="review-item"
            >
              <div class="d-flex align-items-center justify-content-between" style="gap: 8px">
                <div class="d-flex align-items-center" style="gap: 8px;">
                  <ion-img :src="review.avatarUrl" class="w-68 h-68" style="border-radius: 100px" />
                  <ion-text class="font-medium font-16 color-white">{{ review.fullName }}</ion-text>
                </div>
                <ion-text class="font-medium font-12 color-gray" style="text-align: end">{{ dayjs(review.date).format('D MMMM YYYY') }}</ion-text>
              </div>
              <ion-text class="font-14 color-gray-400">{{ review.text }}</ion-text>
            </div>
          </div>
        </div>
      </div>
    </template>
  </base-layout>
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
  ReviewTypeEnum,
  FeedbackEntityEnum,
  ReviewsDocument,
  WorkoutDocument
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { timeConvertToHuman } from "@/helpers/date-formater";
import { TabItem } from "@/interfaces/TabItem";
import { useDailysStore } from "@/general/stores/useDailysStore";
import useRoles from "@/hooks/useRole";
import StarRating from "@/users/components/StarRating.vue";
import LikeRating from "@/users/components/LikeRating.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
import dayjs from "dayjs";

const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const router = useRouter();
const route = useRoute();
const store = useDailysStore();

const id = computed(() => route.params.id);

const tabs: TabItem[] = [
  {
    name: ReviewTypeEnum.Recent,
    labelActive: "Recent",
    labelInactive: "Recent",
  },
  {
    name: ReviewTypeEnum.Positive,
    labelActive: "Positive",
    labelInactive: "Recent",
  },
  {
    name: ReviewTypeEnum.Negative,
    labelActive: "Negative",
    labelInactive: "Recent",
  },
];

const activeTab = ref<ReviewTypeEnum>(ReviewTypeEnum.Recent);

const tabsChanged = (newTab: ReviewTypeEnum) => {
  activeTab.value = newTab;
  refetch({
    id: route.params.id,
    type: FeedbackEntityEnum.Workout,
    review_type: activeTab.value
  })
};

const onAddReview = () => {
  router.push({ name: EntitiesEnum.TrainingReview });
};

const handleBack = () => {
  router.go(-1);
};

const { result: reviewsResult, loading: reviewLoading, refetch, onResult: getReviews } = useQuery(
  ReviewsDocument,
  () => ({
    id: route.params.id,
    type: FeedbackEntityEnum.Workout,
    review_type: activeTab.value,
  })
);
const { result: dailyResult, loading: dailyLoading, refetch: refetchDaily } = useQuery(
  WorkoutDocument,
  () => ({
    id: route.params.id,
  })
);

const reviews = computed(() =>
  reviewsResult?.value?.reviews?.data.reduce(
    (acc: any, cur: any) => {
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
const totalReviewsCount = ref<number>(0);
const score = ref<number>(0);
const positiveCount = computed(() => dailyResult.value?.workout?.positive_reviews_count);
const negativeCount = computed(() => dailyResult.value?.workout?.negative_reviews_count);

getReviews(({ data }) => {
  if(activeTab.value === 'Recent') {
    score.value = 0;
    totalReviewsCount.value = data?.reviews?.data?.length;
    if(totalReviewsCount.value) {
       data?.reviews?.data.map((review: any) => {
        score.value += review.score;
      });
      score.value /= data?.reviews?.data?.length;
    }
    console.log(score.value);
    refetchDaily();
  }
});

const onBack = () => {
  router.go(-1);
};

const formatNumber = (num: number) => {
  if(num < 1e3) {
    return num;
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e5) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return Math.floor(num / 1e3) + (num >= 1e3 ? ',' : '') + (num % 1e3);
  }
}

</script>

<style scoped lang="scss">
.header {
  padding: 9px 20px;
}
.rating {
  display: flex;
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
  border: 1px solid #3d3d3d;
  margin-bottom: 16px;
  padding: 17px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ion-img {
    &::part(image) {
      border-radius: 100px;
    }
  }
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
.common-style {
  .font-12 {
    font-size: 14px;
  }
  .font-14 {
    font-size: 14px;
  }
  .font-16 {
    font-size: 16px;
  }
}
.w-68 {
  width: 68px;
}
.h-68 {
  height: 68px;
}
</style>
