<template>
  <ion-spinner v-if="loading" name="lines" class="spinner" />
	<div
    v-else
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div>
      <!-- <div class="banner">
        <ion-icon src="assets/icon/arrow-back.svg" />
        <ion-title class="banner__title">{{ result?.facility?.name }}</ion-title>
      </div> -->
      <div>
        <div class="carousel">
          <ion-img :src="result?.facility?.media[0]?.pathUrl"></ion-img>
        </div>
        <div class="data-box d-flex justify-content-between">
          <div class="d-flex-col">
            <ion-text>{{ result?.facility?.name }}</ion-text>
            <div class="field-label d-flex align-items-center">
              <ion-icon src="assets/icon/location.svg"></ion-icon>
              <ion-text>{{ result?.facility?.address?.street }}</ion-text>
            </div>
          </div>
          <div class="d-flex-col">
            <ion-text>Ratings {{ result?.facility?.score }}</ion-text>
            <star-rating :rating="result?.facility?.score??0"/>
          </div>
          <div class="d-flex-col align-items-center">
            <ion-text>Reviews</ion-text>
            <review-status-bar :positiveCount="result?.facility?.positive_reviews_count??0" :negativeCount="result?.facility?.negative_reviews_count??0"/>
            <ion-text class="total-review">based on {{ result?.facility?.reviews_count??0 }} reviews</ion-text>
          </div>
        </div>
        <div class="description-field">
          <ion-title>Description:</ion-title>
          <ion-text>{{ result?.facility?.description }}</ion-text>
        </div>
        <div class="feature-field">
          <div>
            <ion-title>Equipment</ion-title>
            <div class="features">
              <ion-button 
                v-for="(item, id) in result?.facility?.equipments" 
                :key="id" 
                fill="outline"
              >
                <ion-icon :src="item.iconUrl"></ion-icon>
                {{item.name}}
              </ion-button>
            </div>
          </div>
          <div>
            <ion-title>Amenities</ion-title>
            <div class="features">
              <ion-button 
                v-for="(item, id) in result?.facility?.amenities" 
                :key="id" 
                fill="outline"
              >
                <ion-icon :src="item.iconUrl"></ion-icon>
                {{item.name}}
              </ion-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="d-flex justify-content-center">
        <ion-button class="add-gym-btn" @click="goToGymCreate">Add new gym</ion-button>
      </div>
      <div class="contact-field" v-if="manager">
        <ion-avatar class="photo">
					<ion-img v-if="manager.avatarUrl" :src="manager.avatarUrl"></ion-img>
					<template v-else>
						{{ manager.first_name?.charAt(0) }}
					</template>
				</ion-avatar>
        <ion-label class="name">
          {{ `${manager.first_name} ${manager.last_name}`}}
          <!-- <ion-icon slot="icon-only" src="assets/icon/arrow-down.svg"></ion-icon> -->
        </ion-label>
        <ion-text class="contact">{{"Gym Manager"}}</ion-text>
        <ion-text class="contact">{{ manager.email }}</ion-text>
        <!-- <ion-text class="contact">{{"(+1)70 8750 9216"}}</ion-text> -->
      </div>
      <div>
        <ion-button class="share-btn">Share Gym</ion-button>
        <div class="tabs-holder">
          <page-tabs
            :tabs="tabs"
            class="page-tabs"
            :value="activeTab"
            @change="tabsChanged"
          />
          <div class="content">
            <ion-spinner v-if="reviewLoading" name="lines" class="review-spinner" />
            <!-- <div v-else>
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
            </div> -->

            <div v-else>
              <div class="black-box review" v-for="review in reviews" :key="review.id">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex reviewer align-items-center">
                    <avatar :src="review.avatarUrl" />
                    <ion-text class="reviewer-name">{{ review.fullName }}</ion-text>
                    <ion-text class="review-point">{{ review.rating }}</ion-text>
                  </div>
                  <ion-text class="review-date">{{ dayjs(review.date).format("D MMMM, YYYY") }}</ion-text>
                </div>
                <ion-text class="review-message">{{ review.text }}</ion-text>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
	</div> 
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonLabel,
  IonText,
  IonIcon,
  IonImg,
  IonTitle,
  IonAvatar
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  Facility,
  RoleEnum,
  GetManagersByFacilityDocument,
  FeedbackEntityEnum,
  Query,
  Review,
  ReviewsDocument,
  ReviewTypeEnum,
  SettingsCodeEnum,
  UnfollowDocument,
} from "@/generated/graphql";
import { TabItem } from "@/interfaces/TabItem";
import { Review as UserReview } from "@/ts/types/user";
import { useQuery } from "@vue/apollo-composable";
import PageTabs from "@/general/components/PageTabs.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import StarRating from "@/general/components/dashboard/StarRating.vue";
import ReviewStatusBar from "@/general/components/dashboard/ReviewStatusBar.vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { GetFacilityDocument } from "@/graphql/documents/userDocuments";
import ReviewItem from "@/general/components/blocks/ratings/ReviewItem.vue";
import Avatar from "@/general/components/blocks/Avatar.vue";
import dayjs from "dayjs";

const currentFacility = useFacilityStore();

const filter = ref<string>('recent');

const { result, loading, onResult } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: currentFacility.facility.id,
  }
);

const { result: managerResult, loading: managerLoading } = useQuery(
  GetManagersByFacilityDocument,
  {
    role: RoleEnum.Manager,
    facilities: [currentFacility.facility.id],
    first: 1,
    page: 1
  }
);
console.log(managerResult)
const manager = computed(() =>
  managerResult?.value?.managers?.data.length ? managerResult?.value?.managers?.data[0] : {}
);

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

const router = useRouter();

const {
  result: reviewsResult,
  loading: reviewLoading,
  refetch,
} = useQuery(ReviewsDocument, () => ({
  id: currentFacility.facility.id,
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
      return acc;
    },
    []
  )
);

const goToGymCreate = () => {
  router.push({
    name: EntitiesEnum.DashboardGymCreate
  })
}
</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 420px;
  padding-top: -40px;
}
.banner {
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding-bottom: 40px;

  &__title {
    padding: 0;
    color: var(--gold);
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
}
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  img {
    width: 100%;
    max-width: 650px;
    max-height: 310px;
  }
}
.data-box {
  padding-top: 24px;
  padding-bottom: 40px;
  
  .field-label {
    color: var(--gray-400);
    font: 16px/1 var(--ion-font-family);
    
    ion-icon {
      width: 24px;
      height: 24px;
    }
  }
  ion-text {
    font: 500 20px/1 var(--ion-font-family);
  }
}
.d-flex-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.total-review {
  color: var(--grey-text);
  font: 14px/1 var(--ion-font-family);
}
.description-field {
  margin-bottom: 24px;

  ion-title {
    font: 500 20px/1 var(--ion-font-family);
    padding: 0;
    margin-bottom: 10px;
  }
  ion-text {
    font: 16px/1 var(--ion-font-family);
    color: var(--grey-text);
  }
}
.feature-field {
  display: flex;
  justify-content: space-between;
  gap: 30px;

  .features {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;

    ion-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
  ion-title {
    padding: 0;
  }
}
.panel {
  width: 383px;
  position: fixed;
  right: 0;
  top: 90px;
  height: 100%;
  background-color: var(--gray-700);
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 9px;
  padding-bottom: 37px;
  overflow-y: scroll;

  .share-btn {
    width: 100%;
    max-height: 56px;
    margin-bottom: 14px;
  }
  .add-gym-btn {
    width: 40%;
    margin: 20px 0;
  }
  .black-box {
    background-color: var(--main-color);
    border-radius: 8px;
    padding: 4px;
    margin-top: 2px;
    margin-bottom: 2px;

    .normal-button {
      padding-top: 7.5px;
      padding-bottom: 7.5px;
      padding-right: 25px;
      padding-left: 25px;
      font: 14px/1 var(--ion-font-family);
      color: var(--gray-400);
      border-radius: 8px;
      cursor: pointer;
    }
    .active-button {
      padding-top: 7.5px;
      padding-bottom: 7.5px;
      padding-right: 25px;
      padding-left: 25px;
      font: 14px/1 var(--ion-font-family);
      background-color: var(--gold);
      color: var(--main-color);
      border-radius: 8px;
      cursor: pointer;
    }
  }
  .review {
    padding: 16px;

    .reviewer {
      display: flex;
      gap: 12px;

      .reviewer-name {
        font: 14px/1 var(--ion-font-family);
        color: white;
      }
      .review-point {
        border: 1px solid;
        border-radius: 20px;
        border-color: var(--gray-400);
        color: var(--gray-400);
        font: 500 12px/1 var(--ion-font-family);
        padding: 2px;
        padding-left: 10px;
        padding-right: 10px;
      }
      ion-img {
        width: 32px;
        height: 32px;
      }
    }
    .review-message{
      font: 300 14px/1 var(--ion-font-family);
      color: var(--gray-400);
      margin-top: 12px;
    }
    .review-date{
      font: 500 12px/1 var(--ion-font-family);
      color: var(--gray-500);
    }
  }
}
.contact-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 50px 0 80px 0;

  .name {
    font: 500 24px/1 var(--ion-font-family);
    color: var(--fitnesswhite);
  }
  .contact{
    font: 16px/1 var(--ion-font-family);
    color: var(--gray-400);
  }

  ion-img {
    width: 86px;
  }
}
.flex-auto {
  flex: auto;
}
.spinner {
  position: fixed;
  top: 50vh;
  left: 50vw;
  --color: var(--ion-color-white);
}
.review-spinner {
  margin: 20px auto;
}
.photo {
    width: 94px;
    height: 94px;
  }
</style>
