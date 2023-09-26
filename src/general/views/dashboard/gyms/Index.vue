<template>
  <template v-if="isWebView">
  <ion-spinner v-if="loading" name="lines" class="spinner" />
	<div
    v-else
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div>
      <div class="banner">
        <ion-icon class="cursor-pointer" @click="goBack" src="assets/icon/arrow-back.svg" />
        <!-- <ion-title class="banner__title">{{ result?.facility?.name }}</ion-title> -->
      </div>
      <div>
        <div class="carousel">
          <swiper
            v-if="medias.length"
            free-mode
            slidesPerView="auto"
            :spaceBetween="16"
            :slidesOffsetAfter="0"
            :slidesOffsetBefore="0"
            :modules="[FreeMode]"
          >
            <swiper-slide
              v-for="(item, index) in medias"
              :key="`swiper_${index}`"
              class="swiper-slide"
            >
              <ion-img
                :src="item?.pathUrl"
                class="media-item"
              />
            </swiper-slide>
          </swiper>
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
        </div>
        <div class="description-field">
          <ion-title>Description:</ion-title>
          <ion-text>{{ result?.facility?.description }}</ion-text>
        </div>
        <div class="d-flex">
          <div class="d-flex reviews">
            <ion-text>Reviews</ion-text>
            <ion-text class="review-count">{{result?.facility?.score}}</ion-text>
            <review-status-bar :positiveCount="result?.facility?.positive_reviews_count??0" :negativeCount="result?.facility?.negative_reviews_count??0" :ratings="result?.facility?.score"/>
            <!-- <ion-text class="total-review">based on {{ result?.facility?.reviews_count??0 }} reviews</ion-text> -->
          </div>
          <ion-text class="ion-text-end reviews">View All</ion-text>
        </div>
      </div>
      <!-- <ion-spinner v-if="reviewLoading" name="lines" class="review-spinner" /> -->
      <div>
        <ion-row>
          <ion-col size="6" v-for="review in reviews" :key="review.id">
            <div class="black-box review">
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
          </ion-col>
        </ion-row>
        
      </div>
    </div>
    <div class="panel">
        <!-- <ion-button class="add-gym-btn" @click="goToGymCreate">Add new gym</ion-button> -->
      <div class="d-flex justify-content-center">
        <ion-button class="add-gym-btn cursor-pointer" @click="goToGymCreate">Share Gym</ion-button>
      </div>
      <div class="d-flex justify-content-center">
        <ion-button class="add-gym-btn cursor-pointer" @click="goToGymEdit">Edit</ion-button>
      </div>
      <div class="d-flex justify-content-center">
        <ion-button class="add-gym-btn cursor-pointer" color="danger" fill="outline" @click="deleteGym">Delete</ion-button>
      </div>
      <div class="feature-field ion-margin-top">
        <div>
          <ion-title>Equipment:</ion-title>
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
        <div class="ion-margin-top">
          <ion-title>Amenities:</ion-title>
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
      <!-- <div class="contact-field" v-if="manager">
        <ion-avatar class="photo">
					<ion-img v-if="manager.avatarUrl" :src="manager.avatarUrl"></ion-img>
					<template v-else>
						{{ manager.first_name?.charAt(0) }}
					</template>
				</ion-avatar> -->
        <!-- <ion-label class="name">
          {{ `${manager.first_name} ${manager.last_name}`}}
        </ion-label> -->
        <!-- <ion-text class="contact">{{"Gym Manager"}}</ion-text>
        <ion-text class="contact">{{ manager.email }}</ion-text> -->
        <!-- <ion-text class="contact">{{"(+1)70 8750 9216"}}</ion-text> -->
      <!-- </div> -->
      <div class="ion-margin-top">
        <ion-title class="ion-no-padding">Offerings:</ion-title>
        <page-tabs-New
          :tabs="tabs"
          class="page-tabs"
          @change="tabsChanged"
        />
        <!-- <ion-button class="share-btn">Share Gym</ion-button> -->
        <div class="tabs-holder tabs-text-content d-flex ion-margin-top" v-if="!activeOfferingsTab || activeOfferingsTab == EntitiesEnum?.FacilityDropins">
          <div class="card-background"  v-if="!dropins || !dropins.length">
            <empty-block
              title="Drop-ins Empty"
              hideButton
              text="No Dropins available for this location, create new dropins to get started"
              icon= "assets/icon/dropin.svg"
            />
          </div>
          <div class="ion-text-center"  v-for="dropin in dropins">
            <ion-title class="offering-title">${{dropin.price}}</ion-title>
            <ion-text>1 Day</ion-text>
            <ion-text>{{dropin.title}}</ion-text>
          </div>
        </div>
        <div class="tabs-holder tabs-text-content d-flex ion-margin-top" v-if="activeOfferingsTab == EntitiesEnum.Facilities">
          <div class="card-background"  v-if="!passes || !passes.length">
            <empty-block
              title="Passes Empty"
              hideButton
              text="No Passes available for this location, create new passes to get started"
              icon= "assets/icon/gym-user-icon.svg"
            />
          </div>
          <div class="ion-text-center"  v-for="pass in passes">
            <ion-title class="offering-title">${{pass.price}}</ion-title>
            <ion-text>1 Month</ion-text>
            <ion-text>{{pass.title }}</ion-text>
          </div>
        </div>
        <div class="tabs-text-content ion-margin-top"  v-if="activeOfferingsTab == EntitiesEnum?.Trainings">
          <div class="card-background"  v-if="!dailysData || !dailysData.length">
            <empty-block
              title="Dailys Empty"
              hideButton
              text="No dailys available for this location, create new dailys to get started"
              icon="assets/icon/daily.svg"
            />
          </div>
          <div class="card-background" v-for="dailys in dailysData" @click="openViewModal(dailys)">
            <div class="d-flex">
              <ion-title class="ion-no-padding offering-title">{{ dailys?.title }}</ion-title>
              <ion-text class="offering-name ion-text-end">{{ dailys?.type?.name }}</ion-text>
            </div>
            <div class="d-flex inner-text">
              <div class="width75">
                <ion-item class="ion-no-padding" lines="none">
                  <ion-icon src="assets/icon/time-light.svg"></ion-icon>
                  <ion-text>{{ dailys?.duration + ' min -' + dailys?.type?.name }}</ion-text>
                </ion-item>
              </div>
              <div class="width25 ion-text-end">
                <ion-item class="ion-no-padding ion-text-end sub-text" lines="none">
                  <ion-icon src="assets/icon/person-light.svg"></ion-icon>
                  <ion-text class="bold-lato">{{dailys?.type?.views_count ? dailys?.type?.views_count : 0 }}</ion-text>
                </ion-item>
              </div>
            </div>
          </div>
          </div>
          <div class="tabs-text-content ion-margin-top"  v-if="activeOfferingsTab == EntitiesEnum?.Events">
            <div class="card-background"  v-if="!allEvents || !allEvents.length">
              <empty-block
                title="Events Empty"
                hideButton
                text="No Events available for this location, create new events to get started"
                icon= "assets/icon/events.svg"
              />
            </div>
          <div class="card-background" v-for="event in allEvents" @click="openEvent(event.id)">
            <div class="d-flex">
              <ion-title class="ion-no-padding offering-title">{{ event?.title }}</ion-title>
              <!-- <ion-text class="offering-name ">{{ event?.description }}</ion-text> -->
              <ion-item class="ion-no-padding ion-text-end" lines="none">
                  <ion-icon src="assets/icon/time-light.svg"></ion-icon>
                  <ion-text>{{ event?.start_date }}</ion-text>
                </ion-item>
            </div>
            <ion-text class="offering-name">{{ event?.start_date }}</ion-text>
            <div class="d-flex inner-text">
              <div class="width50 ">
                <ion-item class="ion-no-padding" lines="none">
                  <ion-icon src="assets/icon/location-light.svg"></ion-icon>
                  <ion-text>{{ event?.address?.street }}</ion-text>
                </ion-item>
              </div>
              <div class="width50 ion-text-end">
                <ion-item class="ion-no-padding ion-text-end sub-text" lines="none">
                  <ion-icon src="assets/icon/person-light.svg"></ion-icon>
                  <ion-text class="bold-lato">{{ event?.booked_count }}</ion-text>
                </ion-item>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
	</div> 
  
</template>
<template v-else>
  <base-layout :hide-navigation-menu="role !== RoleEnum.Trainer">
      <template #header>
      <page-header
          back-btn
          :title="''"
          @back="onBack"
      />
      
      <ion-icon class="menu-option" @click="openActionOption" src="assets/icon/vertical-ellipsis-light.svg"></ion-icon>
      </template>
      <template #content>
        <div
          class="holder-content ion-padding-horizontal"
          :class="{ 'holder-content--empty': !loading }"
        >
          <div>
            <div>
              <div class="carousel">
                <swiper
                  v-if="medias.length"
                  free-mode
                  slidesPerView="auto"
                  :spaceBetween="16"
                  :slidesOffsetAfter="0"
                  :slidesOffsetBefore="0"
                  :modules="[FreeMode]"
                >
                  <swiper-slide
                    v-for="(item, index) in medias"
                    :key="`swiper_${index}`"
                    class="swiper-slide"
                  >
                    <ion-img
                      :src="item?.pathUrl"
                      class="media-item"
                    />
                  </swiper-slide>
                </swiper>
              </div>
              <div class="ion-padding mobile-view-content">
              <div class="data-box d-flex justify-content-between">
                <div class="d-flex-col">
                  <ion-text>{{ result?.facility?.name }}</ion-text>
                  <div class="field-label d-flex align-items-center">
                    <ion-icon src="assets/icon/location.svg"></ion-icon>
                    <ion-text>{{ result?.facility?.address?.street }}</ion-text>
                  </div>
                </div>
              </div>
              <div class="description-field">
                <ion-text>{{ result?.facility?.description }}</ion-text>
              </div>
              <div class="d-flex">
                <div class="d-flex reviews">
                  <ion-text>Reviews</ion-text>
                  <ion-text class="review-count">{{ result?.facility?.score }}</ion-text>
                  <review-status-bar :positiveCount="result?.facility?.positive_reviews_count ?? 0" :negativeCount="result?.facility?.negative_reviews_count ?? 0" :ratings="result?.facility?.score"/>
                  <!-- <ion-text class="total-review">based on {{ result?.facility?.reviews_count??0 }} reviews</ion-text> -->
                </div>
                <ion-text class="ion-text-end reviews">View All</ion-text>
              </div>
              <div>
                <ion-row>
                  <ion-col size="6" v-for="review in reviews" :key="review.id">
                    <div class="black-box review">
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
                  </ion-col>
                </ion-row>
              </div>
              <div class="ion-margin-top">
                <ion-title class="ion-no-padding color-white font16">Offerings</ion-title>
                <page-tabs-New
                  :tabs="tabs"
                  class="page-tabs"
                  @change="tabsChanged"
                />
                <!-- <ion-button class="share-btn">Share Gym</ion-button> -->
                <div class="tabs-holder tabs-text-content d-flex ion-margin-top" v-if="!activeOfferingsTab || activeOfferingsTab == EntitiesEnum?.FacilityDropins">
                  <div class="card-background"  v-if="!dropins || !dropins.length">
                    <empty-block
                      title="Drop-ins Empty"
                      hideButton
                      text="No Dropins available for this location, create new dropins to get started"
                      icon= "assets/icon/dropin.svg"
                    />
                  </div>
                  <div class="ion-text-center"  v-for="dropin in dropins">
                    <ion-title class="offering-title">${{dropin.price}}</ion-title>
                    <ion-text>1 Day</ion-text>
                    <ion-text>{{dropin.title}}</ion-text>
                  </div>
                </div>
                <div class="tabs-holder tabs-text-content d-flex ion-margin-top" v-if="activeOfferingsTab == EntitiesEnum.Facilities">
                  <div class="card-background"  v-if="!passes || !passes.length">
                    <empty-block
                      title="Passes Empty"
                      hideButton
                      text="No Passes available for this location, create new passes to get started"
                      icon= "assets/icon/gym-user-icon.svg"
                    />
                  </div>
                  <div class="ion-text-center" v-for="pass in passes" > 
                    <ion-title class="offering-title">${{pass.price}}</ion-title>
                    <ion-text>1 Month</ion-text>
                    <ion-text>{{pass.title }}</ion-text>
                  </div>
                  <!-- <div class="ion-text-center">
                    <ion-title class="offering-title">$139.00</ion-title>
                    <ion-text>1 Month</ion-text>
                    <ion-text>Standard plan</ion-text>
                  </div>
                  <div class="ion-text-center">
                    <ion-title class="offering-title">$179.00</ion-title>
                    <ion-text>1 Month</ion-text>
                    <ion-text>Premium plan</ion-text>
                  </div> -->
                </div>
                <div class="tabs-text-content ion-margin-top"  v-if="activeOfferingsTab == EntitiesEnum?.Trainings">
                  <div class="card-background"  v-if="!dailysData || !dailysData.length">
                    <empty-block
                      title="Dailys Empty"
                      hideButton
                      text="No dailys available for this location, create new dailys to get started"
                      icon="assets/icon/daily.svg"
                    />
                  </div>
                  <div class="card-background" v-for="dailys in dailysData"  @click="openViewModal(dailys)">
                    <div class="d-flex">
                      <ion-title class="ion-no-padding offering-title">{{ dailys?.title }}</ion-title>
                      <ion-text class="offering-name ion-text-end">{{ dailys?.type?.name }}</ion-text>
                    </div>
                    <div class="d-flex inner-text">
                      <div class="width75">
                        <ion-item class="ion-no-padding" lines="none">
                          <ion-icon src="assets/icon/time-light.svg"></ion-icon>
                          <ion-text>{{ dailys?.duration + ' min -' + dailys?.type?.name }}</ion-text>
                        </ion-item>
                      </div>
                      <div class="width25 ion-text-end">
                        <ion-item class="ion-no-padding ion-text-end sub-text" lines="none">
                          <ion-icon src="assets/icon/person-light.svg"></ion-icon>
                          <ion-text class="bold-lato">{{ dailys?.type?.views_count ? dailys?.type?.views_count : 0 }}</ion-text>
                        </ion-item>
                      </div>
                    </div>
                  </div>
                  </div>
                  <div class="tabs-text-content ion-margin-top"  v-if="activeOfferingsTab == EntitiesEnum?.Events">
                    <div class="card-background"  v-if="!allEvents || !allEvents.length">
                      <empty-block
                        title="Events Empty"
                        hideButton
                        text="No Events available for this location, create new events to get started"
                        icon= "assets/icon/events.svg"
                      />
                    </div>
                  <div class="card-background" v-for="event in allEvents"  @click="openEvent(event.id)">
                    <div class="d-flex">
                      <ion-title class="ion-no-padding offering-title">{{ event?.title }}</ion-title>
                      <!-- <ion-text class="offering-name ">{{ event?.description }}</ion-text> -->
                      <ion-item class="ion-no-padding ion-text-end" lines="none">
                          <ion-icon src="assets/icon/time-light.svg"></ion-icon>
                          <ion-text>{{ event?.start_date }}</ion-text>
                        </ion-item>
                    </div>
                    <ion-text class="offering-name">{{ event?.start_date }}</ion-text>
                    <div class="d-flex inner-text">
                      <div class="width50 ">
                        <ion-item class="ion-no-padding" lines="none">
                          <ion-icon src="assets/icon/location-light.svg"></ion-icon>
                          <ion-text>{{ event?.address?.street }}</ion-text>
                        </ion-item>
                      </div>
                      <div class="width50 ion-text-end">
                        <ion-item class="ion-no-padding ion-text-end sub-text" lines="none">
                          <ion-icon src="assets/icon/person-light.svg"></ion-icon>
                          <ion-text class="bold-lato">{{ event?.booked_count }}</ion-text>
                        </ion-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <div class="feature-field ion-margin-top">
                  <div>
                    <ion-title class="color-white font16">Equipment</ion-title>
                    <div class="features">
                      <ion-button 
                        v-for="(item, id) in result?.facility?.equipments" 
                        :key="id" 
                        fill="outline"
                      >
                        <ion-icon :src="item.iconUrl"></ion-icon>
                        {{ item.name }}
                      </ion-button>
                    </div>
                  </div>
                  <div class="ion-margin-top">
                    <ion-title class="color-white font16">Amenities</ion-title>
                    <div class="features">
                      <ion-button 
                        v-for="(item, id) in result?.facility?.amenities" 
                        :key="id" 
                        fill="outline"
                      >
                        <ion-icon :src="item.iconUrl"></ion-icon>
                        {{ item.name }}
                      </ion-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> 
      </template>
  </base-layout>
</template>
  <create-facility-modal ref="createFacilityModal" @close="reloadData" />
  <discard-changes
    :is-open="isDeleteModalOpen"
    @close="deleteModalClosed"
    title="Do you want to delete gym?"
    text="Changes will not be saved"
    cancelButton="Cancel"
    button="Delete"
  />
  <view-daily-modal ref="dailyModal"  />
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
  IonAvatar,
  actionSheetController
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
  EventsQuery,
  EventsDocument,
  QueryEventsOrderByColumn,
  EventsQueryVariables,
  SortOrder,
  WorkoutsByFacilityDocument,
  QueryFacilityWorkoutsOrderByColumn,
  DeleteFacilityDocument,
  FacilityItemsByFacilityIdAndTypeDocument
} from "@/generated/graphql";
import { TabItem } from "@/interfaces/TabItem";
import { Review as UserReview } from "@/ts/types/user";
import { useQuery } from "@vue/apollo-composable";
import PageTabs from "@/general/components/PageTabs.vue";
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
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
import BaseCarousel from "@/general/components/base/BaseCarousel.vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { FreeMode } from "swiper";
import { TabItemNew } from "@/interfaces/TabItemNew";
import PageTabsNew from "@/general/components/PageTabsNew.vue";
import { useNewFacilityStore } from "@/facilities/store/new-facility";
import CreateFacilityModal from "@/general/views/dashboard/gyms/CreateFacility.vue";
import {
  NativeGeocoderResult,
} from "@awesome-cordova-plugins/native-geocoder";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useDailysItemsStore } from "@/general/stores/useDailysItemsStore";
import { Capacitor } from '@capacitor/core';
import { useMutation } from "@vue/apollo-composable";
import { toastController } from "@ionic/vue";
import ViewDailyModal from "@/general/components/modals/workout/ViewDailyModal.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const dailyModal = ref<typeof ViewDailyModal | null>(null);

const openViewModal = (daily: any) => {
  dailyModal.value?.present({ ...daily });
};

const openEvent = (eventId: string) => {
  router.push({
    name: EntitiesEnum.DashboardEventDetail,
    params: {
      id: eventId,
    },
  });
};

const props = withDefaults(
  defineProps<{
    isWebView?: boolean;
  }>(),
  {
    isWebView: Capacitor.isNativePlatform() ? false : true,
  }
);
const { role } = useRoles();

const deleteGymModal = ref<typeof DeleteGymModal | null>(null);

const { mutate: deleteFacility, onDone: facilityDeleted} = useMutation(
  DeleteFacilityDocument
);

const createFacilityModal = ref<typeof CreateFacilityModal | null>(null);

const store = useNewFacilityStore();

const route = useRoute();

const currentFacilityId = route.params.id;

const filter = ref<string>('recent');

const { result, loading, onResult, refetch } = useQuery<Pick<Query, "facility">>(
  GetFacilityDocument,
  {
    id: currentFacilityId,
  }
);

const medias = ref<any>([]);

const reloadData = () =>{
  refetch();
}

onResult((result:any) => {
  console.log("### ",result );
  medias.value = result.data?.facility?.media.length ? result.data.facility?.media : []
})

const openActionOption = async (index?: number, mediaId?: string) => {
  const mobileButtons = [
    {
      text: "Edit",
      data: {
        type: "edit",
      },
    },
    {
      text: "Delete",
      data: {
        type: "delete",
      },
    },
    {
      text: "Cancel",
      role: "cancel",
    },
  ];

  const actionSheet = await actionSheetController.create({
    mode: "ios",
    buttons: mobileButtons,
  });

  await actionSheet.present();

  const { data } = await actionSheet.onWillDismiss();
  const type = data?.type;

  const actions = {
    ['edit']: () =>
    goToGymEdit(),
    ['delete']: () =>
     deleteGym()
  };

  if (actions[type]) {
    actions[type]();
  }
};

// const tabs: TabItem[] = [
//   {
//     name: ReviewTypeEnum.Recent,
//     label: "Recent",
//   },
//   {
//     name: ReviewTypeEnum.Positive,
//     label: "Positive",
//   },
//   {
//     name: ReviewTypeEnum.Negative,
//     label: "Negative",
//   },
// ];

const tabs: TabItemNew[] = [
  {
    name: EntitiesEnum.FacilityDropins,
    labelActive: "assets/icon/dropinsActive.png",
    labelInactive: "assets/icon/dropins.png",
  },
  {
    name: EntitiesEnum.Facilities,
    labelActive: "assets/icon/dumbbell.png",
    labelInactive: "assets/icon/dumbbellActive.png",
  },

  {
    name: EntitiesEnum.Trainings,
    labelActive: "assets/icon/DailysActive.png",
    labelInactive: "assets/icon/DailysInactive.png",
  },
  {
    name: EntitiesEnum.Events,
    labelActive: "assets/icon/facilitiesActive.png",
    labelInactive: "assets/icon/facilities.png",
  },
];

const activeTab = ref<ReviewTypeEnum>(ReviewTypeEnum.Recent);
const activeOfferingsTab = ref<any>(null);

const tabsChanged = (newTab: any) => {
  activeOfferingsTab.value = newTab;
};

const router = useRouter();

const {
  result: reviewsResult,
  loading: reviewLoading,
  refetch: refetchReviews,
} = useQuery(ReviewsDocument, () => ({
  id: currentFacilityId,
  type: FeedbackEntityEnum.Facility,
  review_type: activeTab.value,
}));

onMounted(() => {
  refetchReviews();
  eventsRefetch();
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

const goToGymEdit = () => {
  store.clear();
  const curFacility = result.value.facility;
  store.setAddress(
    curFacility?.address?.city?.state,
    curFacility?.address?.city,
    {
      thoroughfare: curFacility?.address?.street,
      subThoroughfare: curFacility?.address?.extra,
      latitude: curFacility?.address?.lat,
      longitude: curFacility?.address?.lng,
    } as NativeGeocoderResult
  );

  const amenities = curFacility?.amenities?.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: true,
      iconUrl: option.iconUrl || undefined,
    };
  });
  const equipments = curFacility?.equipments?.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: true,
      iconUrl: option.iconUrl || undefined,
    };
  });

  curFacility.media?.map((option) => {
    store.addPhoto({
      ...option,
      url: option.pathUrl,
    });
  });
  store.setAmenities(amenities);
  store.setDescription(curFacility.description);
  store.setEquipments(equipments);
  store.setTitle(curFacility.name);

  createFacilityModal.value?.present({
    isEdit: true,
    selectedFacilityId: result?.value?.facility?.id
  });
}

const isDeleteModalOpen = ref(false);

const deleteGym = () => {
  isDeleteModalOpen.value = true;
}

const deleteModalClosed = (approved: boolean) => {
  isDeleteModalOpen.value = false;
  if(approved){
    deleteFacility({ id : currentFacilityId})
    .then(async () => {
      const toast = await toastController.create({
        message: "Gym was deleted successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      goBack();
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
};

const goBack = () => {
  router.go(-1);
}

// Events List
const idFilter = computed(() => {
  return { created_by_facility: currentFacilityId }
});

const eventsPage = ref<number>(1);
 const totalEvents = ref<number>(0);
const eventsParams: EventsQueryVariables = {
  first: 8,
  page: eventsPage.value,
  orderBy: [
    {
      column: QueryEventsOrderByColumn.StartDate,
      order: SortOrder.Asc,
    },
  ],
  // start_date: {
  //   from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
  //   to: dayjs().add(1, 'y').format("YYYY-MM-DD HH:mm:ss"),
  // },
  ...idFilter.value,
};

const {
  onResult: gotEvents,
  loading: eventsLoading,
  refetch: eventsRefetch,
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  notifyOnNetworkStatusChange: true,
  fetchPolicy: "no-cache",
});

const allEvents = ref([]);
const status = route.query.status;
const events = computed(() => {
   return allEvents.value.filter(ev => {
    if(filter.value === 'all') return true;
    return ev.status === filter.value
  });  
  
});

gotEvents((response) => {
  totalEvents.value = response.data?.events?.paginatorInfo.total ?? 0;
  allEvents.value = [];
  response.data?.events?.data.map(item => {
    allEvents.value.push({
      ...item,
      status: dayjs().isBefore(item.end_date) ?  'upcoming' : 'finished',
    })
  });
});
// End Events

// Dailys data
const dailysItemsStore = useDailysItemsStore();
const summaryData = ref<any>({
  totalViews: 0,
  subscribers: 0,
  totalRevenue: 0,
  viewsPerDaily: 0,
  topDailys: [],
});
const { result: dailysResult, loading: dailysLoading, refetch: refetchDailys, onResult: gotDailysData } = useQuery(
  WorkoutsByFacilityDocument,
  {
    page: 1,
    first: 1000,
    facility_id: currentFacilityId,
    orderByColumn: QueryFacilityWorkoutsOrderByColumn.CreatedAt,
    order: SortOrder.Asc,
  },
  {
    fetchPolicy: "no-cache",
  }
);

gotDailysData(({ data }) => {
  let dailys = [ ...data.facilityWorkouts.data ];
  dailys.sort((a: any, b: any) => {
    return a.total_revenue - b.total_revenue;
  });
  summaryData.value.topDailys = dailys.slice(0, 10);
  let recentDailys = [ ...data.facilityWorkouts.data ];
  recentDailys.sort((a: any, b: any) => {
    const dateFirst = dayjs(a, "h:mm A");
    const dateLast = dayjs(b, "h:mm A");
    return dateFirst.isBefore(dateLast) ? 1 : -1;
  });
  dailysItemsStore.setData(recentDailys);
});

const dailysData = computed(
  () => dailysItemsStore.dailysData
);

const onBack = () => {
  router.go(-1);
};
// Dailys End

// Passes start
const {
  result: facilityItemPassResult,
  loading: loadingFacilityPass,
  onResult: gotFacility,
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacilityId,
  item_type: "PASS"
});

const passes = computed(() => {
  return facilityItemPassResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Passes End


// Dropins start
const {
  result: dropinResult,
  loading: loadingFacilityDropin
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacilityId,
  item_type: "DROPIN"
});

const dropins = computed(() => {
  return dropinResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Dropins End

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
  // display: flex;
  font-size: 30px;
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
  .media-item {
    width: 46.528vw;
    // max-width: 650px;
    // max-height: 310px;
    height: 33.712vh;
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
  // display: flex;
  // justify-content: space-between;
  // gap: 30px;

  .features {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    ion-button {
      height: 4.33vh;
    }

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
  height: 86vh;
  // background-color: var(--gray-700);
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 9px;
  padding-bottom: 37px;
  overflow: auto;
  margin-top: 4%;

  .share-btn {
    width: 100%;
    max-height: 56px;
    margin-bottom: 14px;
  }
  .add-gym-btn {
    width: 51%;
    height: 3.919vh;
  }
  
}
.black-box {
    background-color: #262626;
    border-radius: 8px;
    padding: 4px;
    margin: 5px;
    height: 14.743vh;

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

.review-count {
  padding: 3px 15px;
  border: 1px solid #e1dbc5;
  border-radius: 25px;
  margin: 0 10px;
}

.reviews {
  width: 50%;
  color: #e1dbc5;
}

.page-tabs {
  background-color: #262626;
  border-radius: 10px;
}

.tabs-holder {
  background-color: #262626;
  border-radius: 8px;
  padding: 8px;
  justify-content: center;
  gap: 20px;
  // ion-title {
  //   font-size: 16px !important;
  //   font-family: 'Yantramanav';
  //   font-weight: 500;
  // }

  ion-text {
    display: block;
    font-size: 14px;
    font-family: 'Yantramanav';
    font-weight: 300;
    color: #C4C4C4;
  }
}

.back-btn {
  // position: absolute;
  font-size: 30px;
  // left: 19%;
}

.tabs-text-content {
  background-color: #262626;
  max-height: 25vh;
  padding: 10px;
  border-radius: 8px;
  overflow: auto;
  .width50 {
    width: 50%;
    height: 30px;
  }
  .width75 {
    width: 75%;
    height: 30px;
  }
  .width25 {
    width: 25%;
    height: 30px;
  }
  .inner-text {
    padding-bottom: 5px;
    ion-icon {
      font-size: 20px;
    }
  }
  .sub-text {
    float: right;
  }
  ion-item {
    --background: transparent;
    ion-text {
      font-size: 14px;
      font-family: 'Yantramanav';
      padding-left: 5px;
      font-weight: 300;
    }
    .bold-lato {
      font-weight: 500;
      font-family: 'lato';
    }
  }
  .card-background {
    background-color: #202020;
    padding: 5px;
    border-radius: 8px;
    margin-bottom: 5px;
  }
}

.offering-name {
  font-family: 'lato';
  font-weight: 500;
  font-size: 14px !important;
  color: #C4C4C4;
}

.offering-title {
  font-size: 16px;
  font-weight: 500;
  font-family: 'Lato';
  padding-bottom: 10px;
}
.cursor-pointer {
  cursor: pointer;
}
.color-white {
  color: #fff !important;
}
.font16 {
  font-size: 16px;
}
@media (max-width: 767px) {
  ion-header {
    position: absolute;
    ion-toolbar {
      --background: transparent !important;
      ion-buttons {
        margin: 16px 0px !important;
      }
    }
  }
  .holder-content {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  .media-item {
    width: 100vw !important;
    max-height: 275px !important;
    object-fit: cover;
  }
  .swiper-slide {
    margin-right: 0 !important;
  }
  .swiper {
    margin-left: 0;
    margin-right: 0;
    // position: unset;
    overflow: unset;
    list-style: none;
    padding: 0;
    z-index: 1;
  }
  .carousel {
    display: block;
    height: auto;
    position: fixed;
    z-index: 9;
    top: 0;
  }
  .mobile-view-content {
    overflow: auto;
    position: relative;
    top: 230px;
  }
  .data-box {
    padding-top: 16px;
    padding-bottom: 16px;
    .field-label {
      color: var(--gray-400);
      font: 16px/1 var(--ion-font-family);
      
      ion-icon {
        width: 24px;
        height: 24px;
      }

      ion-text {
        font-size: 14px;
      }
    }
    ion-text {
      font: 500 20px/1 var(--ion-font-family);
    }
  }
  .reviews {
    color: #fff;
    font-size: 16px;
    font-weight: 500;
  }

  .menu-option {
    font-size: 30px;
    position: absolute;
    right: 16px;
    top: 20px;
    border-radius: 50%;
    background-color: #0000005e;
    padding: 5px;
    z-index: 999;
  }
}
</style>
