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
            <span class="rating-star__title">{{ facility?.score }}</span>
            <star-rating :model-value="facility?.score || 0" size="medium" />
            <ion-text color="medium" class="rating-star__reviews" :class="{'font-yantramanav' : role === RoleEnum.User}">
              based on {{ facility?.reviews_count }} reviews
            </ion-text>
          </div>
          <like-rating :likes="facility?.positive_reviews_count || 0" :total="facility?.reviews_count || 0"
            :dislikes="facility?.negative_reviews_count || 0" :progressValue="progressValue" />
        </div>
        <div class="tabs-holder">
          <page-tabs :tabs="tabs" class="page-tabs ion-padding-horizontal" :value="activeTab" @change="tabsChanged" />
          <div class="content ion-padding-horizontal">
            <ion-spinner v-if="reviewLoading" name="lines" class="spinner" />
            <div v-else>
              <review-item v-for="review in tempReviews" :key="review.id" class="review-item" :avatar-url="review.avatarUrl"
                :full-name="review.fullName" :date="review.date" :rating="review.rating" :text="review.text" />
            </div>
          </div>
        </div>
      </template>
    </template>
    <template #footer>
      <gym-fixed :title="facility?.name || ''" :location="facility?.address?.street || ''">
        <template #button v-if="isAbleToAddReview">
          <ion-button expand="block" color="primary" class="fixed-holder__button font-yantramanav" @click="onAddReview">
            Add review
          </ion-button>
        </template>
      </gym-fixed>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton, IonSpinner } from "@ionic/vue";
import { Review as UserReview } from "@/ts/types/user";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import StarRating from "@/users/components/StarRating.vue";
import LikeRating from "@/users/components/LikeRating.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
import GymFixed from "@/general/components/blocks/GymFixed.vue";
import { IonText } from "@ionic/vue";
import { ref, computed, onMounted } from "vue";
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
RoleEnum,
} from "@/generated/graphql";
import { useRoute } from "vue-router";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import useRoles from "@/hooks/useRole";

const route = useRoute();

const { role } = useRoles();

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
const tempReviews: UserReview[] = [{
  id: "1",
  date: new Date().toString(),
  rating: 4.9,
  text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
  avatarUrl: "https://picsum.photos/200/300",
  fullName: 'Sharon Jem',
},
{
  id: "2",
  date: new Date().toString(),
  rating: 4.5,
  text: 'Had such an amazing session. She instantly picked up on the level of my fitness and adjusted the workout to suit me.',
  avatarUrl: "https://picsum.photos/200/300",
  fullName: 'Sharon Jem',
}];

const activeTab = ref<ReviewTypeEnum>(ReviewTypeEnum.Recent);

const tabsChanged = (newTab: ReviewTypeEnum) => {
  activeTab.value = newTab;
};

const onAddReview = () => {
  router.push({
    name: EntitiesEnum.WriteReview,
    params: { id: route.params.id },
  });
};

const handleBack = () => {
  router.go(-1);
};

const {
  result: reviewsResult,
  loading: reviewLoading,
  refetch,
} = useQuery(ReviewsDocument, () => ({
  id: route.params.id,
  type: FeedbackEntityEnum.Facility,
  review_type: activeTab.value,
}));

onMounted(() => {
  refetch();
});

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
      const t: UserReview = {
        id: "1",
        date: new Date().toString(),
        rating: cur.score || 0,
        text: cur.review,
        avatarUrl: cur.author?.avatarUrl || "",
        fullName: 'Test user',
      };
      acc.push(t);
      return acc;
    },
    []
  )
);

const { result, loading } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: route.params.id,
  }
);

const facility = computed(() => result.value?.facility);

const isAbleToAddReview = computed(
  () =>
    facility.value?.was_visited_by_me && !facility.value?.was_commented_by_me
);

const progressValue = computed(() => {
  if (
    facility.value?.positive_reviews_count &&
    facility.value?.negative_reviews_count &&
    facility.value?.score
  ) {
    return (
      ((facility.value?.positive_reviews_count +
        facility.value?.negative_reviews_count) /
        facility.value?.score) *
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
    margin-bottom: 12px;
    font-size: 32px;
    line-height: 1.5;
    font-weight: 700;
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
