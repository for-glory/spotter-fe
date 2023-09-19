<template>
  <base-layout>
    <template #header>
      <page-header :title="dynamicTitle" back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="events__container">
        <template v-if="selectedEvents &&
          selectedEvents.length &&
          !isTrainingsLoading &&
          !isEventsLoading &&
          !isFacilitiesLoading
          ">
          <event-item v-for="event in selectedEvents" :key="event.id" :item="event"
            :rounded="activeTab === EntitiesEnum.Trainings" @click="openEvent(event.id)" />
        </template>
        <ion-spinner name="lines" class="spinner" v-else-if="isTrainingsLoading || isEventsLoading || isFacilitiesLoading
          ">
        </ion-spinner>
        <div class="upper_head" style="margin:20px;display:flex;">
          <router-link to="/users/dashboard"><img src="assets/backgrounds/arrback.svg" style="margin-top:18px;width:30px;"/></router-link><h2>My Drop-ins</h2>
        </div>
        <div class="item_cont_flex" style="display:flex;justify-content:space-between;">
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> 2 days left </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">7 Days</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_1.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --></div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
        </div>
        <div class="item_cont_flex" style="display:flex;justify-content:space-between;">
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> 3 days left </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">5 Days</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_3.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
        </div>
        <div class="item_cont_flex" style="display:flex;justify-content:space-between;">
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> 6 days left </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">9 Days</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_1.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --></div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_3.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --></div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
        </div>
        <div class="item_cont_flex" style="display:flex;justify-content:space-between;">
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> 2 days left</div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(225, 219, 197);font-size:15px;">4 Days</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_3.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
          <ion-item data-v-136129e6="" class="event item md item-lines-default item-fill-none item-label mob_tab"
            style="padding: 0px;width:100%;margin:20px;"><ion-thumbnail data-v-136129e6="" class="event__photo md"><img data-v-136129e6=""
                src="assets/backgrounds/Gym_2.png" class="event__img"></ion-thumbnail>
            <div data-v-136129e6="" class="event__holder"><ion-label data-v-136129e6=""
                class="event__title sc-ion-label-md-h sc-ion-label-md-s md">Diamond Gym</ion-label>
              <div data-v-136129e6="" class="event__time my_txt2">
                <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> --> </div><!-- <ion-text class="event__date">
            &nbsp;
            <template> </template>
          </ion-text> -->
              <div data-v-136129e6="" class="d-flex align-items-center justify-content-between" style="margin-top: 14px;">
                <address-item data-v-136129e6="" class="event__address">
                  <div data-v-136129e6="" class="mid_txt" style="display: flex; align-items: center;"><img
                      data-v-136129e6="" src="assets/icon/pin_loc.png" class="img-fluid" style="width: 15px;"><span
                      data-v-136129e6="" style="padding-left: 10px;">Light Street, 24</span></div>
                </address-item><ion-text data-v-136129e6="" class="status-text md txt_sd"><span data-v-136129e6=""
                    style="color: rgb(193, 68, 68);font-size:15px;">Expired</span></ion-text></div>
            </div>
          </ion-item>
        </div>
        <!-- <empty-block v-else hide-button icon="assets/icon/empty.svg" :title="`Sorry, no ${bookingName} found`"
          :text="`Currently you have no booked ${bookingName}`" /> -->
        <ion-infinite-scroll threshold="100px" class="infinite-scroll" @ionInfinite="loadData" v-if="(activeTab === EntitiesEnum.Facilities &&
            facilities &&
            facilities?.length < totalFacilities) ||
          (activeTab === EntitiesEnum.Trainings &&
            trainings &&
            trainings?.length < totalTrainings) ||
          (activeTab === EntitiesEnum.Events &&
            events &&
            events?.length < totalEvents)
          ">
          <ion-infinite-scroll-content loading-spinner="lines" loading-text="Loading more data...">
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
      
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import PageTabsNew from "@/general/components/PageTabsNew.vue";
import { TabItemNew } from "@/interfaces/TabItemNew";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import EventItem from "@/general/components/EventItem.vue";
import { useQuery } from "@vue/apollo-composable";
import {
  FacilityItemPass,
  MyEventsDocument,
  MyFacilityItemPassesDocument,
  MyTrainingsDocument,
  QueryMyEventsOrderByColumn,
  QueryMyFacilityItemPassesOrderByColumn,
  QueryMyTrainingsOrderByColumn,
  SortOrder,
  Training,
  Event,
} from "@/generated/graphql";
import { useRouter } from "vue-router";
import {
  IonSpinner,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  InfiniteScrollCustomEvent,
} from "@ionic/vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import dayjs from "dayjs";

const router = useRouter();

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
    labelActive: "assets/icon/TrainerActive.png",
    labelInactive: "assets/icon/Trainer.png",
  },
  {
    name: EntitiesEnum.Events,
    labelActive: "assets/icon/facilitiesActive.png",
    labelInactive: "assets/icon/facilities.png",
  },
];

const activePage = ref<number>(1);

const {
  result: facilitiesResult,
  loading: isFacilitiesLoading,
  refetch: refetchFacilities,
  onResult: gotFacilities,
} = useQuery(
  MyFacilityItemPassesDocument,
  {
    page: activePage.value,
    first: 6,
    orderBy: [
      {
        column: QueryMyFacilityItemPassesOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const {
  result: trainingsResult,
  loading: isTrainingsLoading,
  refetch: refetchTrainings,
  onResult: gotTrainings,
} = useQuery(
  MyTrainingsDocument,
  {
    page: activePage.value,
    first: 6,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "y").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyTrainingsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const {
  result: eventsResult,
  loading: isEventsLoading,
  refetch: refetchEvents,
  onResult: gotEvents,
} = useQuery(
  MyEventsDocument,
  {
    page: activePage.value,
    first: 6,
    start_date: {
      from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
    },
    orderBy: [
      {
        column: QueryMyEventsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const totalFacilities = computed<number>(
  () => facilitiesResult?.value?.myFacilityItemPasses?.paginatorInfo?.total ?? 0
);
const totalTrainings = computed<number>(
  () => trainingsResult?.value?.trainerTrainings?.paginatorInfo?.total ?? 0
);
const totalEvents = computed<number>(
  () => eventsResult?.value?.events?.paginatorInfo?.total ?? 0
);

const facilities = ref<Event[]>();
const trainings = ref<Event[]>();
const events = ref<Event[]>();

gotFacilities((response) => {
  const newFacilities =
    response.data?.myFacilityItemPasses?.data?.map(
      (facilityPass: FacilityItemPass) => ({
        id: facilityPass.id,
        title: facilityPass.facilityItem.facility.name,
        end_date: facilityPass.end_date,
        start_date: dayjs(facilityPass.end_date)
          .subtract(facilityPass.facilityItem.qr_code_lifetime_value ?? 0, "d")
          .format("YYYY-MM-DD HH:mm:ss"),
        media: facilityPass.facilityItem.facility.media,
        address: facilityPass.facilityItem.facility.address,
      })
    ) ?? [];

  if (!facilities.value?.length) {
    facilities.value = newFacilities;
  } else if (
    facilities.value.findIndex(
      (training) => training.id === newFacilities[0].id
    ) === -1
  ) {
    facilities.value = [...facilities.value, ...newFacilities];
  }
});

gotTrainings((response) => {
  const newTrainings =
    response.data?.myTrainings?.data?.map((training: Training) => ({
      ...training,
      title: `${training.trainer.first_name} ${training.trainer.last_name}`,
      address: training.trainer.address,
      media: [{ pathUrl: training.trainer.avatarUrl }],
    })) ?? [];

  if (!trainings.value?.length) {
    trainings.value = newTrainings;
  } else if (
    trainings.value.findIndex(
      (training) => training.id === newTrainings[0].id
    ) === -1
  ) {
    trainings.value = [...trainings.value, ...newTrainings];
  }
});

gotEvents((response) => {
  const newEvents = response?.data?.myEvents?.data ?? [];

  if (!events.value?.length) {
    events.value = newEvents;
  } else if (
    events.value.findIndex((training) => training.id === newEvents[0].id) === -1
  ) {
    events.value = [...events.value, ...newEvents];
  }
});

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("dashboard_active_tab") as EntitiesEnum) ||
  EntitiesEnum.Facilities
);

const selectedEvents = computed(() => {
  switch (activeTab.value) {
    case EntitiesEnum.Trainings:
      return trainings.value;

    case EntitiesEnum.Events:
      return events.value;

    default:
      return facilities.value;
  }
});

const dynamicTitle = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {

    return 'Upcoming Events';
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return 'My Passes';
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return 'My Drop-ins';
  }

  return 'Upcoming Trainings';
});


const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  activePage.value = 1;
  facilities.value = [];
  trainings.value = [];
  events.value = [];

  updateBookings();
};

const onBack = () => {
  router.go(-1);
};

const openEvent = (id: string | number) => {
  switch (activeTab.value) {
    case EntitiesEnum.Facilities:
      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.Facility,
        },
      });

    case EntitiesEnum.Trainings:
      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.Training,
        },
      });

    case EntitiesEnum.Events:
      return router.push({
        name: EntitiesEnum.BookedTraining,
        params: { id },
        query: {
          type: EntitiesEnum.Event,
        },
      });

    default:
      break;
  }
};

const loadData = async (ev: InfiniteScrollCustomEvent) => {
  if (
    (activeTab.value === EntitiesEnum.Trainings &&
      trainings.value &&
      trainings.value.length < totalTrainings.value) ||
    (activeTab.value === EntitiesEnum.Events &&
      events.value &&
      events.value.length < totalTrainings.value)
  ) {
    activePage.value++;
    await updateBookings();
    ev.target.complete();
  }
};

const updateBookings = async () => {
  return new Promise((resolve, reject) => {
    switch (activeTab.value) {
      case EntitiesEnum.Facilities:
        refetchFacilities({
          page: activePage.value,
          first: 6,
          orderBy: [
            {
              column: QueryMyFacilityItemPassesOrderByColumn.StartDate,
              order: SortOrder.Asc,
            },
          ],
        })
          ?.then(() => {
            resolve(true);
          })
          .catch((err) => {
            console.log("err:", err);
            reject();
          });
        break;

      case EntitiesEnum.Trainings:
        refetchTrainings({
          page: activePage.value,
          first: 6,
          start_date: {
            from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
          },
          orderBy: [
            {
              column: QueryMyTrainingsOrderByColumn.StartDate,
              order: SortOrder.Asc,
            },
          ],
        })
          ?.then(() => {
            resolve(true);
          })
          .catch((err) => {
            console.log("err:", err);
            reject();
          });
        break;

      case EntitiesEnum.Events:
        refetchEvents({
          page: activePage.value,
          first: 6,
          start_date: {
            from: dayjs().format("YYYY-MM-DD HH:mm:ss"),
            to: dayjs().add(1, "M").format("YYYY-MM-DD HH:mm:ss"),
          },
          orderBy: [
            {
              column: QueryMyEventsOrderByColumn.StartDate,
              order: SortOrder.Asc,
            },
          ],
        })
          ?.then(() => {
            resolve(true);
          })
          .catch((err) => {
            console.log("err:", err);
            reject();
          });
        break;

      default:
        break;
    }
  });
};

const bookingName = computed(() => {
  switch (activeTab.value) {
    case EntitiesEnum.Trainings:
      return "trainings";

    case EntitiesEnum.Events:
      return "events";

    default:
      return "gyms";
  }
});
</script>

<style lang="scss" scoped>
.events {
  &__container {
    padding: 24px 16px 78px;
  }
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 21000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 100px;
}

.empty-block {
  margin: 48px 0;
}

.spinner {
  display: block;
  margin: 64px auto;
}

.trainer-item {
  margin-left: -16px;
  margin-right: -16px;
}

.txt_sd{

  position: absolute;
  right:0;
  padding:0 !important;
}

.mob_tab{

  
}


@media only screen and (max-width: 900px){


  .item_cont_flex{

    display: block !important;
  }


  .mob_tab{

  margin:16px 0 !important;

  }
  

}

.event {
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  position: relative;
  --border-radius: 8px;
  --min-height: 73px;
  --padding-top: 13px;
  --padding-bottom: 13px;
  --padding-start: 16px;
  --padding-end: 16px;
  --background: var(--gray-700);

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;

    &--rounded {
      --border-radius: 50%;
    }
  }

  &__holder {
    min-height: 73px;
    width: calc(100% - 68px);

    .event--time-hidden & {
      display: flex;
      padding-top: 4px;
      padding-bottom: 4px;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 2px;
    max-width: calc(100% - 86px);
    color: var(--ion-color-white);

    .event--time-hidden & {
      max-width: none;
    }
  }

  &__date {
    display: block;
    margin-bottom: 2px;
  }

  &__time {
    position: absolute;
    display: flex;
    align-items: center;
    top: 0;
    right: 0;
    color: var(--ion-color-white);

    ion-icon {
      line-height: 1;
      font-size: 24px;
      color: var(--ion-color-primary);
    }
  }
}

</style>
