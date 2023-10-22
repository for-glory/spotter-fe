<template>

  <base-layout :class="{ 'web-discover': isWeb }" :hide-navigation-menu="isSearchOnFocus || isWeb">
    <template v-if="!isWeb" #header>
      <search-form :type="EntitiesEnum.FacilityDropins" :is-with-tabs="true" @handle-focus="isSearchOnFocus = true"
        @handle-blur="isSearchOnFocus = false" />

      <page-tabs-New :tabs="tabs" class="page-tabs" :value="activeTab" @change="tabsChanged" />
    </template>


    <template #content>
      <div class="dashboard">
        <div class="web-header d-flex-col justify-content-center align-items-center gap-16" v-if="isWeb">
          <search-form :type="activeTab" is-web :is-with-tabs="true" @handle-focus="isSearchOnFocus = true"
        @handle-blur="isSearchOnFocus = false" />

          <page-tabs-New :tabs="tabs" class="page-tabs" :value="activeTab" @change="tabsChanged" />
        </div>
        <div class="events__container">
          <div data-v-2b823bc0="" class="draggable-content display-grid">
          <template v-if="activeTab == EntitiesEnum.Facilities">
            <div v-if="!passes || !passes.length">
              <empty-block
                title="Gym Passes Empty"
                hideButton
                text="No Passes available"
                icon= "assets/icon/gym-user-icon.svg"
              />
            </div>
            <ion-item v-else lines="none" :class="['event','facility-item', { 'mt-2': !isWeb }]" @click="goToGymPassDropinDetail(item.id)" v-for="item in passes" :key="item.id">
              <ion-thumbnail class="event__photo">
                <img :src="item.facility?.media?.length?item.facility?.media[0].pathUrl:''" class="event__img" />
              </ion-thumbnail>
              <div class="facility-item__holder">
                <div style="width: calc(100% - 80px);">
                  <ion-label class="facility-item__title">{{ item.facility?.name }}</ion-label>
                  <div class="facility-item__address">
                    <ion-img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                    <ion-title style="padding-left:10px;">{{ item.facility?.address?.distance_from_auth_location.toFixed(1) }} miles away from you</ion-title>
                  </div>
                </div>
                <div>
                  <div class="facility-item__price">
                    {{ formatCurrency(item.price/100, "fixed") }}
                  </div>
                  <ion-text class="facility-item__status-text ">
                    <span style="color:#E1DBC5;">{{ item.duration }} {{ item.duration>1?"Months":"Month" }}</span> <br><span style="font-size:16px;">Access</span> 
                  </ion-text>
                  <!-- <ion-button class="evnt_btn" @click="goToGymPassDropinDetail(item.id)">Subscribe</ion-button> -->
                </div>
              </div>
            </ion-item>
          </template>
          <template v-if="activeTab == EntitiesEnum.FacilityDropins">
            <div v-if="!dropins || !dropins.length">
              <empty-block
                title="Drop-ins Empty"
                hideButton
                text="No Dropins available"
                icon= "assets/icon/dropin.svg"
              />
            </div>
            <ion-item v-else lines="none" :class="['event','facility-item', { 'mt-2': !isWeb }]" @click="goToGymPassDropinDetail(item.id)" v-for="item in dropins" :key="item.id">
              <ion-thumbnail class="event__photo">
                <img :src="item.facility?.media?.length?item.facility?.media[0].pathUrl:''" class="event__img" />
              </ion-thumbnail>
              <div class="facility-item__holder">
                <div style="width: calc(100% - 80px);">
                  <ion-label class="facility-item__title">{{ item.facility?.name }}</ion-label>
                  <div class="facility-item__address">
                    <ion-img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                    <ion-title style="padding-left:10px;">{{ item.facility?.address?.distance_from_auth_location.toFixed(1) }} miles away from you</ion-title>
                  </div>
                </div>
                <div>
                  <div class="facility-item__price">
                    {{ formatCurrency(item.price/100, "fixed") }}
                  </div>
                  <ion-text class="facility-item__status-text ">
                    <span style="color:#E1DBC5;">{{ item.duration }} {{ item.duration>1?"Days":"Day" }}</span> <br><span style="font-size:16px;">Access</span> 
                  </ion-text>
                  <!-- <ion-button class="evnt_btn" @click="goToGymPassDropinDetail(item.id)">Buy</ion-button> -->
                </div>
              </div>
            </ion-item>
          </template>
          <template v-if="activeTab == EntitiesEnum.Trainings">
            <div v-if="!trainers || !trainers.length">
              <empty-block
								title="Trainers Empty"
								hideButton
								text="No Trainers available"
								icon= "assets/icon/trainers.svg"
							/>
            </div>
            <ion-item v-else lines="none" :class="['event', 'trainers', { 'mt-2': !isWeb }]" @click="goToTrainerDetail('preview', item.id)" v-for="item in trainers" :key="item.id">
              <ion-thumbnail class="event__photo img-rounded">
                <img :src="item.avatarUrl?item.avatarUrl:''" class="event__img img-rounded" />
              </ion-thumbnail>
              <div class="event__holder">

                <ion-text class="event__date" style="display:flex !important;">
                  <ion-label class="event__title">{{ `${item.first_name} ${item.last_name}` }}</ion-label>
                  <ion-button fill="outline" size="small" shape="round">{{ item.score }}</ion-button>
                  &nbsp;
                </ion-text>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="d-flex" style="font-size:13px;">
                    <ion-icon src="assets/icon/address.svg" class="time-icon" />
                    {{ item.address?.distance_from_auth_location.toFixed(1) }} miles away from you
                  </div>
                  <ion-text class="status-text">
                    <ion-button class="btn_txt" @click.stop="goToTrainerDetail('book', item.id)">Book</ion-button>
                  </ion-text>
                </div>
              </div>
            </ion-item>

          </template>
          <template v-if="activeTab == EntitiesEnum.Events">
            <div v-if="!events || !events.length">
              <empty-block
								title="Events Empty"
								hideButton
								text="No Events available"
								icon= "assets/icon/events.svg"
							/>
            </div>
            <ion-item v-else lines="none" :class="['event', { 'mt-2': !isWeb }]" :key="event.id" v-for="event in events">
              <ion-thumbnail class="event__photo">
                <img :src="event.media?.length?event.media[0].pathUrl:''" class="event__img" />
              </ion-thumbnail>
              <div class="event__holder">
                <ion-label class="event__title">{{ event.title }}</ion-label>
                <div class="event__time font-lato">
                  <ion-icon src="assets/icon/time.svg" class="time-icon" />
                  {{ dayjs(event.start_date).format("h:mm A") }}
                </div>
                <div class="w-100">
                  <div class="d-flex align-items-center justify-content-between w-100">
                    <div style="width: calc(100% - 80px);">
                      <ion-text class="event__date">
                        {{ formatEventDate(event) }}
                        <template>- endDate </template>
                      </ion-text>
                      <div class="event__address">
                          <ion-img src="assets/icon/pin_loc.png" class="img-fluid" style="width:15px;"/>
                          <ion-title style="padding-left:10px;">{{ event.address?.distance_from_auth_location.toFixed(1) }} miles away from you</ion-title>
                      </div>
                    </div>
                    <ion-button class="evnt_btn" @click="goToEventDetail(event.id)">Register</ion-button>
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

<script setup lang="ts">

import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { IonButton, IonIcon, IonText, IonThumbnail, IonLabel, IonImg, IonTitle, IonItem } from "@ionic/vue";
import { TabItemNew } from "@/interfaces/TabItemNew";
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted, ref } from "vue";
import PageTabsNew from "@/general/components/PageTabsNew.vue";
import {
  DashboardWidgetDocument,
  SortOrder,
  FacilityItemsByFacilityIdAndTypeDocument,
  EventsQueryVariables,
  QueryEventsOrderByColumn,
  EventsQuery,
  EventsDocument,
  RoleEnum,
  UsersDocument,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import SearchForm from "@/general/components/forms/SearchActivitiesForm.vue";
import useRoles from "@/hooks/useRole";
import { Capacitor } from "@capacitor/core";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

withDefaults(defineProps<{
  isWeb:boolean
}>(), {
  isWeb: false
})

const router = useRouter();
const { id } = useId();
const unreadMessages = ref<number[]>([]);
const { role } = useRoles()

const {
  result: trainersResult,
  loading: isTrainingsLoading,
  refetch: refetchTrainings,
} = useQuery(
  UsersDocument,
  {
    page: 1,
    first: 100,
    role: RoleEnum.Trainer
  },
  {
    fetchPolicy: "no-cache",
  }
);
const trainers = computed(() => {
  return trainersResult.value?.users?.data;
});
// Dashboard widgets - Activity + My Ratings widgets info
const { result: dashboardWidgetResult } = useQuery(DashboardWidgetDocument);

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
      refetchPasses();
      break;

    default:
      break;
  }
};

const goToGymPassDropinDetail = (id) => {
  router.push({
    name: Capacitor.isNativePlatform()?EntitiesEnum.DropinsPassesDetail:EntitiesEnum.DashboardDropinsPassesDetail,
    params: {
      id
    },
  });
}

const goToTrainerDetail = (type:string, id:number) => {
  if(Capacitor.isNativePlatform()){
    return router.push({ 
      name: type === 'preview' ? EntitiesEnum.Trainer : EntitiesEnum.BookTrainer, 
      params: { id } 
   });
  }
  router.push({ 
    name: type === 'preview' ? EntitiesEnum.TrainerPreview : EntitiesEnum.TrainerBooking, 
    params: { id } 
  })
}

const goToEventDetail = (id) => {
  router.push({
    name: Capacitor.isNativePlatform() ? EntitiesEnum.UserEventDetail : EntitiesEnum.DashboardEventDetail,
    params: {
      id: id,
    },
  });
}

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

// Passes start
const {
  result: facilityItemPassResult,
  loading: loadingFacilityPass,
  refetch: refetchPasses
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  item_type: "PASS"
});

const passes = computed(() => {
  return facilityItemPassResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Passes End


// Dropins start
const {
  result: dropinResult,
  loading: loadingFacilityDropin,
  refetch: refetchDropins
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  item_type: "DROPIN"
});

const dropins = computed(() => {
  return dropinResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Dropins End

// Events List
const eventsParams: EventsQueryVariables = {
  first: 100,
  page: 1,
  orderBy: [
    {
      column: QueryEventsOrderByColumn.StartDate,
      order: SortOrder.Asc,
    },
  ]
};

const {
  result: eventResult,
  loading: eventsLoading,
  refetch: refetchEvents
} = useQuery<EventsQuery>(EventsDocument, eventsParams, {
  notifyOnNetworkStatusChange: true,
  fetchPolicy: "no-cache",
});

const events = computed(() => {
  return eventResult.value?.events?.data;
});
const formatEventDate = (event) => {
  return dayjs(event.start_date).format(
    dayjs(event.start_date).year() !== dayjs(event.end_date).year()
      ? "D MMM YYYY"
      : "D MMMM")
}
// End Events
const formatCurrency = (num: number, type: string) => {
  if (num < 1e3) {
    if(type === 'normal') {
      return "$"+num.toString();
    } else {
      return "$"+num.toFixed(2).toString();
    }
  } else if (num < 1e6) {
    return "$" + (num / 1e3).toFixed(1) + 'k';
  } else {
    return "$" + (num / 1e6).toFixed(1) + 'M';
  }
};
</script>
<style scoped lang="scss">
.dashboard {
  padding: 24px 16px 78px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.web-header {
  width: 100%;
}

.events__container {
  width: 100%;
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

.my_txt_rate{
  padding: 0px 35px 0px 0px;

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
}

.item-native{

  background-color:red !important;
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
    width: 100%;
    font-family: 'Yantramanav';
    .event--time-hidden & {
      display: flex;
      padding-top: 4px;
      padding-bottom: 4px;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  &__title {
    font-family: 'Yantramanav';
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
  &__address {
    display: flex;
    ion-title {
      width: calc(100% - 30px);
      padding: 0;
      color: var(--Grey-text, #AFAFAF);
      font-family: Yantramanav;
      font-size: 14px;
      font-style: normal;
      font-weight: 300;
      line-height: 150%; /* 21px */
    }
  }
}

.facility-item {
  &__holder {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  &__title {
    color: var(--fitnesswhite);
    font-family: Yantramanav;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%;
  }
  &__address {
    display: flex;
    margin-top: 16px;
    ion-title {
      padding: 0;
      width: calc(100% - 30px);
      color: var(--gray-400);
      font-family: Yantramanav;
      font-size: 14px;
      font-style: normal;
      font-weight: 300;
      line-height: 150%; /* 21px */
    }
  }
  &__price {
    color: var(--fitnesswhite);
    font-family: Yantramanav;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
  }
  &__status-text {
    color: var(--gold);
    font-family: Yantramanav;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 150%; /* 24px */
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
  font-family: 'Yantramanav';
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
  font-family: 'Yantramanav';
  --border-radius: 20px;
  font-size: 14px;
  --padding-bottom: 12px;
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

.my_txt{

position: absolute;
right:0px;

}

.my_txt2{

  padding: 0px 11px 0px 0px;  
}

.btn_txt{
  position:absolute;
  right:0;
  bottom:15px;
  font-size: 14px;
  --border-radius: 4px;
  &::part(native){
    padding: 6px 20px;
  }
  }

.evnt_btn{
  height:16px !important;
  position: absolute;
  right:0;
  font-size: 14px;
  --padding-start: 16px;
  --padding-end: 16px;
}

.web-discover {
  :deep {
    ion-content, ion-header, .draggable-content {
      --background: var(--main-color);
      background: var(--main-color);
    }
  }

  .page-tabs {
    width: 530px;
  }
  .display-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 10px;
  }
}
</style>
