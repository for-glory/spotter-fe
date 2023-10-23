<template>

    <base-layout :hide-navigation-menu="isSearchOnFocus">
      <template #header>
        <search-form :type="EntitiesEnum.FacilityDropins" @handle-focus="isSearchOnFocus = true"
          @handle-blur="isSearchOnFocus = false" />
  
        <page-tabs :tabs="tabs" class="page-tabs" :value="activeTab" @change="tabsChanged" />
      </template>
  
  
      <template #content>
        <div class="dashboard">
          <!-- <div class="dashboards-items">
            <dashboard-item :items="activityItems">
              <template #title>
                <ion-icon src="assets/icon/activity.svg" class="activity-icon" />
                Activity
              </template>
            </dashboard-item>
            <dashboard-item :items="ratingItems">
              <template #title>
                <ion-icon src="assets/icon/trophy.svg" class="trophy-icon" />
                My Ratings
              </template>
              <template #bottom>
                <div class="rating__container">
                  <ion-text class="rating-likes">
                    {{ widgetInfo?.positive_reviews_count || 0 }}
                    <ion-icon class="like-icon" src="assets/icon/like.svg" />
                  </ion-text>
                  <ion-text class="rating-dislikes">
                    {{ widgetInfo?.negative_reviews_count || 0 }}
                    <ion-icon class="dislike-icon" src="assets/icon/dislike.svg" />
                  </ion-text>
                </div>
              </template>
            </dashboard-item>
          </div> -->
          <!-- <week-calendar v-model="selectedDate" :bookings="bookings" @handle-view="onViewCalendar" /> -->
          <div class="events__container">
            <!-- <items-header :title="dynamicTitle" @handle-view="onViewAllEvents" :hide-view-more="!selectedEvents?.length ||
              isFacilitiesLoading ||
              isTrainingsLoading ||
              isEventsLoading || isDropinsLoading
              " /> -->
              <div data-v-2b823bc0="" class="fixed-content"></div>
              <div data-v-2b823bc0="" class="draggable-content">
            <template v-if="activeTab == EntitiesEnum.Facilities">
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_1.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Diamond Gym</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $ 89.90
                  </div>
  
                  <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Light Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">7 Days</span> <br><span style="#E1DBC5;">Subscription</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_2.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Fantastic Gym</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $ 42.90
                  </div>
  
                  <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Wall Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">3 Days</span> <br><span style="color:#E1DBC5;">Subscription</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_3.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Summer</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $ 30.90
                  </div>
  
                  <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Yellow Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">7 Days</span> <br><span style="color:#E1DBC5;">Subscription</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_3.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Summer</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $55.85
                  </div>
  
                 <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Yellow Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">5 Days</span> <br><span style="color:#E1DBC5;">Subscription</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
            </template>
            <template v-if="activeTab == EntitiesEnum.FacilityDropins">
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_1.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Diamond Gym</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $ 89.90
                  </div>
  
                  <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Light Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">7 Days</span> <br><span style="font-size:12px;">Access</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_2.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Fantastic Gym</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $ 42.90
                  </div>
  
                  <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Wall Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">3 Days</span> <br><span style="font-size:12px;">Access</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_3.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Summer</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $ 30.90
                  </div>
  
                  <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Yellow Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">7 Days</span> <br><span style="font-size:12px;">Access</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_3.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Summer</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $55.85
                  </div>
  
                 <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Yellow Street, 24</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">5 Days</span> <br><span style="font-size:12px;">Access</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/Gym_3.png" class="event__img" />
  
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Antimatter Gym</ion-label>
                  <div class="event__time">
                    <!-- <ion-icon src="assets/icon/dollar-circle.svg" class="doller-icon" /> -->
                    $55.85
                  </div>
  
                 <!-- <ion-text class="event__date">
                    &nbsp;
                    <template> </template>
                  </ion-text> -->
                  <div class="d-flex align-items-center justify-content-between" style="margin-top:14px;">
                    <address-item class="event__address">
                      <div class="mid_txt" style="display:flex;align-items:center;">
                      <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                      <span style="padding-left:10px;">Jason Street, 78</span>
                    </div>
                    </address-item>
                    <ion-text class="status-text ">
                     <span style="color:#E1DBC5;">5 Days</span> <br><span style="font-size:12px;">Access</span> 
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
            </template>
            <template v-if="activeTab == EntitiesEnum.Trainings">
              <!-- <event-item v-for="event in selectedEvents" :key="event.id" :item="event"
                :rounded="activeTab === EntitiesEnum.Trainings" :date-range="activeTab === EntitiesEnum.Facilities"
                @click="openEvent(event.id)" /> -->
  
  
              <ion-item lines="none" class="event trainers">
                <ion-thumbnail class="event__photo img-rounded">
                  <img src="assets/backgrounds/tamra.png" class="event__img img-rounded" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
  
                  <ion-text class="event__date" style="display:flex !important;">
                    <ion-label class="event__title">Tamra Dae</ion-label>
                    <ion-button fill="outline" size="small" shape="round"
                      style="border-radius:none !important">4.5</ion-button>
                    &nbsp;
                  </ion-text>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex" style="font-size:13px;">
                      <ion-icon src="assets/icon/time.svg" class="time-icon" />
                      09:00 AM - 06:00 PM
                    </div>
                    <ion-text class="status-text">
                      <ion-button>Book</ion-button>
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event trainers">
                <ion-thumbnail class="event__photo img-rounded">
                  <img src="assets/backgrounds/women2.png" class="event__img img-rounded" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
  
                  <ion-text class="event__date" style="display:flex !important;">
                    <ion-label class="event__title">Jennifer Oven</ion-label>
                    <ion-button fill="outline" size="small" shape="round"
                      style="border-radius:none !important">4.5</ion-button>
                    &nbsp;
                  </ion-text>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex" style="font-size:13px;">
                      <ion-icon src="assets/icon/time.svg" class="time-icon" />
                      09:00 AM - 06:00 PM
                    </div>
                    <ion-text class="status-text">
                      <ion-button>Book</ion-button>
                    </ion-text>
                  </div>
                </div>
              </ion-item>
              <ion-item lines="none" class="event trainers">
                <ion-thumbnail class="event__photo img-rounded">
                  <img src="assets/backgrounds/women3.png" class="event__img img-rounded" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
  
                  <ion-text class="event__date" style="display:flex !important;">
                    <ion-label class="event__title">Alice James</ion-label>
                    <ion-button fill="outline" size="small" shape="round"
                      style="border-radius:none !important">4.5</ion-button>
                    &nbsp;
                  </ion-text>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex" style="font-size:13px;">
                      <ion-icon src="assets/icon/time.svg" class="time-icon" />
                      09:00 AM - 06:00 PM
                    </div>
                    <ion-text class="status-text">
                      <ion-button>Book</ion-button>
                    </ion-text>
                  </div>
                </div>
              </ion-item>
              <ion-item lines="none" class="event trainers">
                <ion-thumbnail class="event__photo img-rounded">
                  <img src="assets/backgrounds/women4.png" class="event__img img-rounded" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
  
                  <ion-text class="event__date" style="display:flex !important;">
                    <ion-label class="event__title">China Xang</ion-label>
                    <ion-button fill="outline" size="small" shape="round"
                      style="border-radius:none !important">4.5</ion-button>
                    &nbsp;
                  </ion-text>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex" style="font-size:13px;">
                      <ion-icon src="assets/icon/time.svg" class="time-icon" />
                      09:00 AM - 06:00 PM
                    </div>
                    <ion-text class="status-text">
                      <ion-button>Book</ion-button>
                    </ion-text>
                  </div>
                </div>
              </ion-item>
  
            </template>
            <template v-if="activeTab == EntitiesEnum.Events">
              <!-- <event-item v-for="event in selectedEvents" :key="event.id" :item="event"
                :rounded="activeTab === EntitiesEnum.Trainings" :date-range="activeTab === EntitiesEnum.Facilities"
                @click="openEvent(event.id)" /> -->
  
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/food1.png" class="event__img" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Food Festival</ion-label>
                  <div class="event__time">
                    <ion-icon src="assets/icon/time.svg" class="time-icon" />
                    08:30 AM
                  </div>
                  <div>
                   
                  <div class="d-flex align-items-center justify-content-between">
  
                    <address-item class="event__address">
                      <ion-text class="event__date">
                        17 June
                        <template>- endDate </template>
                      </ion-text>
                      <div class="mid_txt" style="display:flex;align-items:center;">
                        <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                        <span style="padding-left:10px;">Light Street, 24</span>
                      </div>
                    </address-item>
                    <ion-text class="status-text">
  
                    </ion-text>
                    <ion-button style="height:16px; !important">Register</ion-button>
                  </div>
                </div>
                </div>
              </ion-item>
  
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/train.png" class="event__img" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Train Meeting</ion-label>
                  <div class="event__time">
                    <ion-icon src="assets/icon/time.svg" class="time-icon" />
                    08:30 AM
                  </div>
                  <div>
                   
                  <div class="d-flex align-items-center justify-content-between">
  
                    <address-item class="event__address">
                      <ion-text class="event__date">
                        17 June
                        <template>- endDate </template>
                      </ion-text>
                      <div class="mid_txt" style="display:flex;align-items:center;">
                        <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                        <span style="padding-left:10px;">Light Street, 24</span>
                      </div>
                    </address-item>
                    <ion-text class="status-text">
  
                    </ion-text>
                    <ion-button style="height:16px; !important">Register</ion-button>
                  </div>
                </div>
                </div>
              </ion-item>
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/run.png" class="event__img" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Run Competition</ion-label>
                  <div class="event__time">
                    <ion-icon src="assets/icon/time.svg" class="time-icon" />
                    08:30 AM
                  </div>
                  <div>
                   
                  <div class="d-flex align-items-center justify-content-between">
  
                    <address-item class="event__address">
                      <ion-text class="event__date">
                        17 June
                        <template>- endDate </template>
                      </ion-text>
                      <div class="mid_txt" style="display:flex;align-items:center;">
                        <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                        <span style="padding-left:10px;">Light Street, 24</span>
                      </div>
                    </address-item>
                    <ion-text class="status-text">
  
                    </ion-text>
                    <ion-button style="height:16px; !important">Register</ion-button>
                  </div>
                </div>
                </div>
              </ion-item>
              <ion-item lines="none" class="event">
                <ion-thumbnail class="event__photo">
                  <img src="assets/backgrounds/run.png" class="event__img" />
                  <template>
                    fdfvdffv
                  </template>
                </ion-thumbnail>
                <div class="event__holder">
                  <ion-label class="event__title">Run Competition</ion-label>
                  <div class="event__time">
                    <ion-icon src="assets/icon/time.svg" class="time-icon" />
                    08:30 AM
                  </div>
                  <div>
                   
                  <div class="d-flex align-items-center justify-content-between">
  
                    <address-item class="event__address">
                      <ion-text class="event__date">
                        17 June
                        <template>- endDate </template>
                      </ion-text>
                      <div class="mid_txt" style="display:flex;align-items:center;">
                        <img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                        <span style="padding-left:10px;">Light Street, 24</span>
                      </div>
                    </address-item>
                    <ion-text class="status-text">
  
                    </ion-text>
                    <ion-button style="height:16px; !important">Register</ion-button>
                  </div>
                </div>
                </div>
              </ion-item>
            </template>
          </div>
  </div>
        </div>
      </template>
      
    </base-layout>
  </template>

  <script lang="ts">
export default {
  name: "Dashboard",
  // data() {
  //   return {
  //     tabs: [
  //       {
  //         name: "Facilities",
  //         labelActive: "assets/icon/dumbbellActive.png",
  //         labelInactive: "assets/icon/dumbbellActive.png",
  //       },
  //       {
  //         name: "FacilityDropins",
  //         labelActive: "assets/icon/dropinsActive.png",
  //         labelInactive: "assets/icon/dropinsInactive.png",
  //       },
  //       {
  //         name: "Trainings",
  //         labelActive: "assets/icon/trainerActive.png",
  //         labelInactive: "assets/icon/trainerInactive.png",
  //       },
  //       {
  //         name: "Events",
  //         labelActive: "assets/icon/facilitiesActive.png",
  //         labelInactive: "assets/icon/facilitiesInactive.png",
  //       },
  //     ],
  //     activeTab: "Facilities", // Initialize the active tab
  //   };
  // },
  // methods: {
  //   tabsChanged(tabName: string) {
  //     this.activeTab = tabName;
  //   },
  // },
};
</script>

<script setup lang="ts">

import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import DashboardItem from "@/general/components/DashboardItem.vue";
import { IonButton, IonIcon, IonText, IonSpinner } from "@ionic/vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted, ref } from "vue";
import PageTabs from "@/general/components/PageTabs.vue";
import {
  EventPaginator,
  MyEventsDocument,
  MyFacilityItemPassesDocument,
  FacilityItemPass,
  UserPaginator,
  MyTrainingsDocument,
  DashboardWidgetDocument,
  UserAvailabilityDocument,
  Training,
  QueryMyTrainingsOrderByColumn,
  SortOrder,
  QueryMyFacilityItemPassesOrderByColumn,
  QueryMyEventsOrderByColumn,
  TrainingStatesEnum,
  RoleEnum,
  UsersDocument,
  UsersQuery,

} from "@/generated/graphql";
import { useLazyQuery, useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import SearchForm from "@/general/components/forms/SearchActivitiesForm.vue";
import { distanceBetweenCoords } from "@/helpers/distance-between-coords";
import { ActivityItem } from "@/interfaces/ActivityItem";

const router = useRouter();
const { id } = useId();
const unreadMessages = ref<number[]>([]);


const {
  result: eventsResult,
  loading: isEventsLoading,
  refetch: refetchEvents,
} = useQuery(
  MyEventsDocument,
  {
    page: 1,
    first: 4,
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

const {
  result: trainingsResult,
  loading: isTrainingsLoading,
  refetch: refetchTrainings,
} = useQuery(
  MyTrainingsDocument,
  {
    page: 1,
    first: 4,
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
  },
  {
    fetchPolicy: "no-cache",
  }
);



const {
  result: dropinsResult,
  loading: isDropinsLoading,
  refetch: refetchDropins,
} = useQuery(
  MyTrainingsDocument,
  {
    page: 1,
    first: 4,
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
  },
  {
    fetchPolicy: "no-cache",
  }
);

const {
  result: facilitiesResult,
  loading: isFacilitiesLoading,
  refetch: refetchFacilities,
} = useQuery(
  MyFacilityItemPassesDocument,
  {
    page: 1,
    first: 4,
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

// Dashboard widgets - Activity + My Ratings widgets info
const { result: dashboardWidgetResult } = useQuery(DashboardWidgetDocument);

// Calendar info
const { result: calendarWidgetResult } = useQuery(
  UserAvailabilityDocument,
  {
    id,
    from: dayjs().startOf("d").format("YYYY-MM-DD HH:mm:ss"),
    to: dayjs().day(6).endOf("d").format("YYYY-MM-DD HH:mm:ss"),
  },
  {
    fetchPolicy: "no-cache",
  }
);

const bookings = computed(() => {
  const availability = [];
  if (calendarWidgetResult && calendarWidgetResult?.value) {
    const userAvailability = calendarWidgetResult?.value?.userAvailability;

    if (userAvailability && userAvailability?.events) {
      const { events } = userAvailability;
      const bookedEvents = events.map((event: any) => ({
        start_date: event?.start_date || null,
      }));

      availability.push(...bookedEvents);
    }
    if (userAvailability && userAvailability?.trainings) {
      const { trainings } = userAvailability;
      const bookedTrainings = trainings
        .filter(
          (training: Training) => training.state === TrainingStatesEnum.Accepted
        )
        .map((training: Training) => ({
          start_date: training?.start_date || null,
        }));
      availability.push(...bookedTrainings);
    }
  }
  return availability;
});

const fetchChats = () => {
  if (unreadMessages.value.length) unreadMessages.value = [];
  onValue(chatsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const chat = childSnapshot.val();
      if (chat.unread && chat.unread[id]) {
        unreadMessages.value.push(chat.unread[id]);
      }
    });
  });
};

onMounted(() => {
  fetchChats();
});

const widgetInfo = computed(() => dashboardWidgetResult?.value?.me || []);

const ratingItems = computed(() => [
  {
    value: widgetInfo?.value?.reviews_count || 0,
    description: "total feedbacks",
  },
]);

const activityItems = computed(() => [
  {
    value: widgetInfo?.value?.checkins_count || 0,
    description: "gym check-ins",
  },
  {
    value: widgetInfo?.value?.completed_trainings_count || 0,
    description: "trainings done",
  },
]);

const events = computed<EventPaginator["data"]>(() =>
  eventsResult?.value?.myEvents?.data ? eventsResult.value.myEvents.data : []
);

const trainings = computed(() =>
  trainingsResult?.value?.myTrainings?.data
    ? trainingsResult.value.myTrainings.data.map((training: Training) => ({
      ...training,
      title: `${training.trainer.first_name} ${training.trainer.last_name}`,
      address: training.trainer.address,
      media: [{ pathUrl: training.trainer.avatarUrl }],
    }))
    : []
);

const dropins = computed(() =>
  dropinsResult?.value?.myTrainings?.data
    ? trainingsResult.value.myTrainings.data.map((training: Training) => ({
      ...training,
      title: `${training.trainer.first_name} ${training.trainer.last_name}`,
      address: training.trainer.address,
      media: [{ pathUrl: training.trainer.avatarUrl }],
    }))
    : []
);

const facilities = computed<UserPaginator["data"]>(() =>
  facilitiesResult?.value?.myFacilityItemPasses?.data
    ? facilitiesResult.value.myFacilityItemPasses.data.map(
      (facilityPass: FacilityItemPass) => ({
        id: facilityPass.id,
        title: facilityPass.facilityItem.facility.name,
        end_date: facilityPass.end_date,
        start_date: dayjs(facilityPass.end_date)
          .subtract(
            facilityPass.facilityItem.qr_code_lifetime_value ?? 0,
            "d"
          )
          .format("YYYY-MM-DD HH:mm:ss"),
        media: facilityPass.facilityItem.facility.media,
        address: facilityPass.facilityItem.facility.address,
      })
    )
    : []
);








const selectedEvents = computed(() => {


  if (activeTab.value === EntitiesEnum.Events) {

    return events.value;
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return facilities.value;
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return dropins.value;
  }
  return trainings.value;
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

const bookingName = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return "events";
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return "gyms";
  }

  return "trainings";
});

const tabs: TabItem[] = [
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

const selectedDate = ref<Dayjs | null>(dayjs());

const isSearchOnFocus = ref<boolean>(false);

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("dashboard_active_tab") as EntitiesEnum) ||
  EntitiesEnum.Facilities
);

const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  refetchBooking();
};

const openFacility = (facilityId: string | number) => {
  router.push({
    name: EntitiesEnum.NearbyGym,
    params: {
      id: facilityId,
    },
  });
};


const refetchBooking = () => {
  switch (activeTab.value) {
    case EntitiesEnum.Events:
      refetchEvents();
      break;

    case EntitiesEnum.FacilityDropins:
      refetchDropins();
      break;

    case EntitiesEnum.Trainings:
      refetchTrainings();
      break;

    case EntitiesEnum.Facilities:
      refetchFacilities();
      break;

    default:
      break;
  }
};

const onViewAllEvents = () => {
  router.push({ name: EntitiesEnum.DashboardEvents });
};

const onViewChat = () => {
  router.push({ name: EntitiesEnum.ChatList });
};
const onViewFavourites = () => {
  router.push({ name: EntitiesEnum.Favourites });
};

const onViewCalendar = () => {
  router.push({ name: EntitiesEnum.DashboardCalendar });
};

const openEvent = (id: string | number) => {
  switch (activeTab.value) {
    case EntitiesEnum.Facilities:
      return router.push({
        name: EntitiesEnum.Facilities,
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
        name: EntitiesEnum.Event,
        params: { id },
        query: {
          type: EntitiesEnum.Event,
        },
      });

    default:
      break;
  }
};
</script>
<style scoped lang="scss">
.dashboard {
  padding: 24px 16px 78px;
}

.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
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

  ion-icon {
    font-size: 1em;
  }

  &__badge {
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    position: absolute;
    margin: -12px 0 0 4px;
    background: var(--ion-color-danger-tint);
  }
}

.dashboards-items {
  display: flex;
  justify-content: space-between;
}

.rating {
  &__container {
    display: flex;
    align-items: flex-end;
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
  }

  &-likes {
    color: var(--ion-color-success-tint);
  }

  &-dislikes {
    color: var(--ion-color-danger-tint);
  }

  &-likes,
  &-dislikes {
    display: flex;
    align-items: center;
    gap: 2px;
  }
}

.like-icon,
.dislike-icon {
  font-size: 24px;
}

.event__time {
  font-size: 16px;
  padding: 0px 2px 0px 0px;

}

.trophy-icon {
  font-size: 18px;
  padding-right: 6px;
  padding-left: 4px;
  padding-bottom: 4px;
}

.activity-icon {
  font-size: 24px;
  padding-right: 4px;
}

.trainers .event__title {
  padding: 12px 0;
}

// .page-tabs {
//   left: 0;
//   right: 0;
//   display: flex;
//   z-index: 21000;
//   // position: fixed;
//   align-items: center;
//   pointer-events: none;
//   flex-direction: column;
//   justify-content: center;
//   bottom: calc(84px + var(--ion-safe-area-bottom));
//   --btn-min-width: 100px;
// }

.empty-block {
  margin-top: 48px;
}

.spinner {
  display: block;
  margin: 64px auto;
}


.img-rounded {

  border-radius: 50%;
}

.page-tabs {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 400;
  --color: var(--gray-400);
  /* min-width: var(--btn-min-width); */
  --padding-top: 9px;
  --padding-bottom: 9px;
  /* --padding-start: 59px; */
  // --padding-end: 0;
  --color-checked: var(--gray-700);
  --indicator-color: var(--ion-color-primary);
  padding: 12px 20px 12px 20px;
}

.item-inner {
  padding-left: unset;
  padding-right: unset;
  padding-inline-start: var(--inner-padding-start);
  padding-inline-end: unset; /* Remove padding-inline-end */
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
    max-width: calc(100% - 140px);
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

.time-icon {
  font-size: 20px;
  padding-right: 4px;
}

.status-text {
  font: 16px Lato;
  padding: 2px 0px 2px 8px;
  border-radius: 16px;
}

.ongoing {
  background-color: #E1DBC5;
  color: #19191B;
}

.status-text ion-button {
  height: 30px;
  margin-top: -55px;
}

.event__date ion-button {
  height: 30px;
  padding: 5px;
}

.finished {
  background: none;
  border: 1px #AFAFAF;
  color: #AFAFAF;
}

.justify-content-between ion-button {
  height: 36px;
}

.draggable-content{
  z-index: 50;
  padding-top: 24px;
  position: relative;
  border-radius: 20px 20px 0 0;
  margin-top: 1px;
  transition: margin-top 0.35s ease;
  background: var(--ion-background-color);
  min-height: calc(100% - var(--offset) - var(--ion-safe-area-top));
}

.item-inner {
  padding-left: unset;
  padding-right: unset;
  padding-inline-start: var(--inner-padding-start);
  padding-inline-end: 0px !important;
}


</style>