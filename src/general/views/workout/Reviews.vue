<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Reviews">
      </page-header>
    </template>
    <template #content>
      <ion-spinner v-if="reviewLoading" name="lines" class="spinner" />
      <template v-else>
        <div class="common-style">
          <div class="header">
            <ion-text class="font-medium font-14 color-white">Showing {{ formatNumber(0) }} reviews</ion-text>
          </div>
          <div class="rating ion-padding-horizontal">
            <div class="rating-star">
              <span class="rating-star__title">{{ trainer?.score }}</span>
              <star-rating :model-value="trainer?.score || 0" size="medium" />
              <ion-text color="medium" class="rating-star__reviews">
                based on {{ trainer?.reviews_count ?? 0 }} reviews
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
        </div>
      </template>
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
} from "@/generated/graphql";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useId from "@/hooks/useId";
import useSubscription from "@/hooks/useSubscription";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { timeConvertToHuman } from "@/helpers/date-formater";
import { TabItem } from "@/interfaces/TabItem";
import useRoles from "@/hooks/useRole";
import StarRating from "@/users/components/StarRating.vue";
import LikeRating from "@/users/components/LikeRating.vue";

const { type: subscriptionType } = useSubscription();
const currentFacility = useFacilityStore();
const router = useRouter();
const route = useRoute();

const id = computed(() => route.params.id);

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
    type: FeedbackEntityEnum.Workout,
    review_type: activeTab.value,
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

// const { result, loading } = useQuery<Pick<Query, "user">>(UserDocument, {
//   id: route.params.id,
// });

// const trainer = computed(() => result.value?.user);

// const trainerName = computed(
//   () =>
//     `${result.value?.user?.first_name} ${result.value?.user?.last_name}` || ""
// );

// const progressValue = computed(() => {
//   if (
//     trainer.value?.positive_reviews_count &&
//     trainer.value?.negative_reviews_count &&
//     trainer.value?.score
//   ) {
//     return (
//       ((trainer.value?.positive_reviews_count +
//         trainer.value?.negative_reviews_count) /
//         trainer.value?.score) *
//       100
//     );
//   } else {
//     return 0;
//   }
// });

const onBack = () => {
  router.go(-1);
};

const formatNumber = (num: number) => {
  if(num === 0) {
    return 0;
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
  padding: 9px;
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
  margin-bottom: 16px;
}

.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
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
