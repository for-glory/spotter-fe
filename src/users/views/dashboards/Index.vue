<template>
<<<<<<< HEAD
  <ion-page
    class="base-layout"
    :class="{ 'has-fixed-header': headerFixed }"
    :style="{
      '--breakpoint': initialBreakpoint * 100 + 'vh',
      '--offset': offsetTop + 'px',
    }"
  >
    <div class="header-section">
      <ion-header
        class="header ion-no-border"
        :class="{ 'header--fixed': headerFixed }"
      >
        <slot name="header"></slot>
      </ion-header>
    </div>
    <!-- <div class="content-section"> -->
    <div class="dashboard-container" v-if="getPlatform == 'desktop'">
      <div class="dashboard-container__sidebar">
        <dashboard-sidebar />
=======
  <base-layout>
    <template #header>
      <page-header title="Dashboard">
        <template #custom-btn>
          <ion-button @click="onViewChat" class="header-btn">
            <ion-icon src="assets/icon/chat.svg" />
            <span class="header-btn__badge" v-if="unreadMessages.length"></span>
          </ion-button>
          <ion-button @click="onViewFavourites" class="header-btn">
            <ion-icon src="assets/icon/heart.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <div class="dashboard">
        <div class="dashboards-items">
          <dashboard-item :items="activityItems">
            <template #title>
              <ion-icon
                src="public/assets/icon/activity.svg"
                class="activity-icon"
              />
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
                  <ion-icon
                    class="dislike-icon"
                    src="assets/icon/dislike.svg"
                  />
                </ion-text>
              </div>
            </template>
          </dashboard-item>
        </div>
        <week-calendar
          v-model="selectedDate"
          :bookings="bookings"
          @handle-view="onViewCalendar"
        />
        <div class="events__container">
          <items-header
            :title="dynamicTitle"
            @handle-view="onViewAllEvents"
            :hide-view-more="
              !selectedEvents?.length ||
              isFacilitiesLoading ||
              isTrainingsLoading ||
              isEventsLoading ||
              isDropinsLoading
            "
          />
          <template
            v-if="
              selectedEvents.length &&
              !isTrainingsLoading &&
              !isEventsLoading &&
              !isFacilitiesLoading &&
              !isDropinsLoading
            "
          >
            <event-item
              v-for="event in selectedEvents"
              :key="event.id"
              :item="event"
              :rounded="activeTab === EntitiesEnum.Trainings"
              :date-range="activeTab === EntitiesEnum.Facilities"
              @click="openEvent(event.id)"
            />
          </template>
          <ion-spinner
            name="lines"
            class="spinner"
            v-else-if="
              isTrainingsLoading || isEventsLoading || isFacilitiesLoading
            "
          >
          </ion-spinner>
          <empty-block
            v-else
            hide-button
            icon="assets/icon/empty.svg"
            :title="`Sorry, no ${bookingName} found`"
            :text="`Currently you have no booked ${bookingName}`"
          />
        </div>
        <page-tabs-New
          :tabs="tabs"
          class="page-tabs"
          :value="activeTab"
          @change="tabsChanged"
        />
>>>>>>> 4a2c5a8c19259eb9e5a712aeeb4b130357980cf1
      </div>
      <div class="dashboard-container__right-section abc">
        <!-- <slot name="right-section"> -->
        <ion-content
          ref="content"
          :fullscreen="true"
          :scroll-events="draggable"
          @ionScroll="onContentScroll"
          @touchend="onContentTouchEnd"
          :scroll-y="initialBreakpoint < 1"
          @touchstart="onContentTouchStart"
          @ionScrollEnd="onContentScrollEnd"
          @ionScrollStart="onContentScrollStart"
          class="page-content has-footer has-header"
          :class="{
            'page-content--full-height': contentFullHeight,
            'page-content--fullscreen': isFullscreenView,
            'top-24': isPlatform('ios'),
          }"
        >
          <template v-if="draggable">
            <ion-backdrop
              :visible="true"
              :tappable="false"
              :style="{
                opacity:
                  1 - scrollPercents < 0
                    ? 0
                    : 1 - scrollPercents > 1
                    ? 1
                    : 1 - scrollPercents,
              }"
            >
            </ion-backdrop>
            <div
              class="fixed-content"
              :class="{
                'fixed-content--fullheight': initialBreakpoint === 1,
              }"
            >
              <slot name="static"></slot>
            </div>

            <div
              class="draggable-content"
              :style="{
                background: draggableBackground,
                '--background': draggableBackground,
              }"
            >
              <span
                draggable="true"
                class="draggable-content__drag-handle"
                :style="{ '--offset': offsetTop + 'px' }"
                :class="{
                  'draggable-content__drag-handle--fixed': isFullscreenView,
                }"
              >
              </span>
              <slot name="draggable"></slot>
            </div>
          </template>

          <slot v-else name="content"></slot>
        </ion-content>
        <!-- </slot> -->
      </div>
    </div>
    <ion-content
      v-if="getPlatform == 'ios' || getPlatform == 'android'"
      ref="content"
      :fullscreen="true"
      :scroll-events="draggable"
      @ionScroll="onContentScroll"
      @touchend="onContentTouchEnd"
      :scroll-y="initialBreakpoint < 1"
      @touchstart="onContentTouchStart"
      @ionScrollEnd="onContentScrollEnd"
      @ionScrollStart="onContentScrollStart"
      class="page-content has-footer has-header"
      :class="{
        'page-content--full-height': contentFullHeight,
        'page-content--fullscreen': isFullscreenView,
        'top-24': isPlatform('ios'),
      }"
    >
      <template v-if="draggable">
        <ion-backdrop
          :visible="true"
          :tappable="false"
          :style="{
            opacity:
              1 - scrollPercents < 0
                ? 0
                : 1 - scrollPercents > 1
                ? 1
                : 1 - scrollPercents,
          }"
        >
        </ion-backdrop>
        <div
          class="fixed-content"
          :class="{
            'fixed-content--fullheight': initialBreakpoint === 1,
          }"
        >
          <slot name="static"></slot>
        </div>

        <div
          class="draggable-content"
          :style="{
            background: draggableBackground,
            '--background': draggableBackground,
          }"
        >
          <span
            draggable="true"
            class="draggable-content__drag-handle"
            :style="{ '--offset': offsetTop + 'px' }"
            :class="{
              'draggable-content__drag-handle--fixed': isFullscreenView,
            }"
          >
          </span>
          <slot name="draggable"></slot>
        </div>
      </template>

      <slot v-else name="content"></slot>
    </ion-content>
    <!-- </div> -->
    <ion-footer
      v-if="!hideNavigationMenu"
      :class="{ 'page-footer--content-width': !fullWidthFooter }"
      collapse="fade"
      no-border
      class="page-footer ion-no-border"
    >
      <slot name="footer">
        <navigation-menu :items="menu" />
      </slot>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
export default {
  name: "BaseLayout",
};
</script>

<script setup lang="ts">
<<<<<<< HEAD
import {
  computed,
  defineExpose,
  defineProps,
  onMounted,
  onUnmounted,
  ref,
  withDefaults,
} from "vue";
import {
  IonHeader,
  IonPage,
  IonContent,
  IonFooter,
  IonBackdrop,
  isPlatform,
} from "@ionic/vue";
import NavigationMenu from "@/general/components/NavigationMenu.vue";
import DashboardSidebar from "@/general/components/blocks/DashboardSidebar.vue";
import useRoles from "@/hooks/useRole";
import { navigationMenu as navigation } from "@/const/navigation";
import { IonContentCustomEvent, ScrollDetail } from "@ionic/core";
import { RoleEnum } from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { Capacitor } from "@capacitor/core";
=======
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import DashboardItem from "@/general/components/DashboardItem.vue";
import { IonButton, IonIcon, IonText, IonSpinner } from "@ionic/vue";
import { TabItemNew } from "@/interfaces/TabItemNew";
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted, ref } from "vue";
import PageTabsNew from "@/general/components/PageTabsNew.vue";
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
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import EventItem from "@/general/components/EventItem.vue";
import ItemsHeader from "@/general/components/blocks/headers/ItemsHeader.vue";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import { onValue } from "firebase/database";
import { chatsRef } from "@/firebase/db";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
>>>>>>> 4a2c5a8c19259eb9e5a712aeeb4b130357980cf1

const props = withDefaults(
  defineProps<{
    hideNavigationMenu?: boolean;
    headerFixed?: boolean;
    contentFullHeight?: boolean;
    fullWidthFooter?: boolean;
    initialBreakpoint?: number;
    draggable?: boolean;
    offsetTop?: number;
    draggableBackground?: string;
  }>(),
  {
    hideNavigationMenu: false,
    headerFixed: false,
    fullWidthFooter: true,
    contentFullHeight: false,
    initialBreakpoint: 0.5,
    draggable: false,
    offsetTop: 42,
    draggableBackground: "",
  }
);

const content = ref<typeof IonContent | null>(null);
const { role } = useRoles();

const menuType =
  role === RoleEnum.OrganizationOwner ||
  role === RoleEnum.FacilityOwner ||
  role === RoleEnum.Manager
    ? EntitiesEnum.Facility
    : role;
const menu = navigation[menuType];

const scrollToBottom = () => {
  if (content.value) {
    content.value.$el.scrollToBottom(500);
  }
};

const showDraggable = () => {
  content?.value?.$el.scrollToPoint(
    0,
    breakpoint.value - props.offsetTop - safeArea.top,
    draggableOptions.duration
  );
};

defineExpose({
  scrollToBottom,
  showDraggable,
});

const getBreakpoint = (): number => {
  return window.innerHeight * props.initialBreakpoint;
};

if (props.draggable) {
  window.addEventListener("resize", getBreakpoint);
}

const scrollTop = ref<number>(0);
const isDraggableTouched = ref<boolean>(false);
const isOnMove = ref<boolean>(false);
const breakpoint = ref<number>(getBreakpoint());
const isDirectionTop = ref<boolean>(true);
const isOnAutoScroll = ref<boolean>(false);
const isFullscreen = ref<boolean>(scrollTop.value > breakpoint.value);
const isFullscreenView = ref<boolean>(scrollTop.value > breakpoint.value);
const scrollPercents = ref<number>(
  (breakpoint.value - scrollTop.value - props.offsetTop) / breakpoint.value
);
const safeArea = {
  top: parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--ion-safe-area-top"
    )
  ),
  bottom: parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(
      "--ion-safe-area-bottom"
    )
  ),
  // top: 50,
  // bottom: 50,
};

onMounted(() => {
  setTimeout(() => {
    safeArea.top = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--ion-safe-area-top"
      )
    );
    safeArea.bottom = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--ion-safe-area-bottom"
      )
    );
  }, 500);
});

const draggableOptions = {
  edges: breakpoint.value / 3,
  duration: 350,
};

const onContentScroll = (event: IonContentCustomEvent<ScrollDetail>) => {
  scrollPercents.value =
    (breakpoint.value - scrollTop.value) / breakpoint.value;
  isDirectionTop.value =
    scrollTop.value < event.detail.scrollTop + props.offsetTop;
  scrollTop.value = event.detail.scrollTop + props.offsetTop;
  isFullscreenView.value =
    scrollTop.value + 2 + safeArea.top >= breakpoint.value;
};

const onContentScrollEnd = () => {
  isOnMove.value = false;
  if (!isDraggableTouched.value && !isOnAutoScroll.value) {
    alignDraggableContent();
  }
};

const onContentScrollStart = () => {
  isOnMove.value = true;
};

<<<<<<< HEAD
const onContentTouchEnd = () => {
  isDraggableTouched.value = false;

  if (!isOnMove.value) {
    alignDraggableContent();
  }
};

const onContentTouchStart = () => {
  isDraggableTouched.value = true;
};

const alignDraggableContent = async () => {
  if (!isDirectionTop.value && scrollTop.value < breakpoint.value) {
    // down
    isOnAutoScroll.value = true;
    await content?.value?.$el.scrollToPoint(
      0,
      scrollTop.value - props.offsetTop + safeArea.top <
        breakpoint.value - draggableOptions.edges
        ? 0
        : breakpoint.value - props.offsetTop - safeArea.top,
      draggableOptions.duration
    );
    setTimeout(() => {
      isOnAutoScroll.value = false;
    }, 200);
  } else if (
    isDirectionTop.value &&
    scrollTop.value > props.offsetTop &&
    breakpoint.value >= scrollTop.value
  ) {
    // up
    isOnAutoScroll.value = true;
    await content?.value?.$el.scrollToPoint(
      0,
      scrollTop.value > draggableOptions.edges
        ? breakpoint.value - props.offsetTop - safeArea.top
        : 0,
      draggableOptions.duration
    );
    setTimeout(() => {
      isOnAutoScroll.value = false;
    }, 200);
=======
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
>>>>>>> 4a2c5a8c19259eb9e5a712aeeb4b130357980cf1
  }

  isFullscreen.value =
    scrollTop.value + 1 >= breakpoint.value - props.offsetTop;
};

onUnmounted(() => {
  if (props.draggable) {
    window.removeEventListener("resize", getBreakpoint);
  }
});

<<<<<<< HEAD
const getPlatform = computed(() => {
  if (Capacitor.isNativePlatform()) {
    if (isPlatform("android")) {
      return "android";
    }
    if (isPlatform("ios")) {
      return "ios";
    }
  } else {
    return "desktop";
  }
});
=======
const dynamicTitle = computed(() => {
  if (activeTab.value === EntitiesEnum.Events) {
    return "Upcoming Events";
  }

  if (activeTab.value === EntitiesEnum.Facilities) {
    return "My Passes";
  }

  if (activeTab.value === EntitiesEnum.FacilityDropins) {
    return "My Drop-ins";
  }

  return "Upcoming Trainings";
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

const activeTab = ref<EntitiesEnum>(
  (localStorage.getItem("dashboard_active_tab") as EntitiesEnum) ||
    EntitiesEnum.FacilityDropins
);

const tabsChanged = (ev: EntitiesEnum) => {
  if (!ev) return;
  activeTab.value = ev;
  localStorage.setItem("dashboard_active_tab", activeTab.value);
  refetchBooking();
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
>>>>>>> 4a2c5a8c19259eb9e5a712aeeb4b130357980cf1
</script>

<style scoped lang="scss">
.has-fixed-header {
  z-index: initial;
  contain: size style;
}

.header {
  flex-shrink: 0;

  &--fixed {
    top: 0;
    left: 0;
    right: 0;
    z-index: 1500;
    position: absolute;
  }
}

.page-content {
  overflow: hidden;
  padding-bottom: calc(32px + var(--ion-safe-area-bottom));
  --padding-start: 0;
  --padding-end: 0;

  &::part(scroll) {
    margin-right: -15px;
    padding-right: 15px;
  }

  &::part(scroll)::-webkit-scrollbar {
    display: none;
  }

  &::-webkit-scrollbar {
    display: none;
  }
}

.page-footer {
  flex-shrink: 0;

  &--content-width {
    padding: 0 24px calc(20px + var(--ion-safe-area-bottom));

    &:deep(ion-button) {
      margin: 0;
    }
  }
}

.base-layout {
  background-color: var(--gray-800);
}

.fixed-content {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
  transition: height 0.35s ease;
  height: calc(var(--breakpoint) + 20px);

  &--fullheight {
    height: 100%;
  }
}

.draggable-content {
  z-index: 50;
  padding-top: 24px;
  position: relative;
  border-radius: 20px 20px 0 0;
  margin-top: var(--breakpoint);
  transition: margin-top 0.35s ease;
  background: var(--ion-background-color);
  min-height: calc(100% - var(--offset) - var(--ion-safe-area-top));

  .modal-handle,
  &__drag-handle {
    left: 0;
    right: 0;
    z-index: 15;
    height: 20px;
    display: block;
    position: absolute;
    pointer-events: none;
    bottom: calc(100% - 20px);
    transition-duration: 0.2s;
    border-radius: 20px 20px 0 0;
    transition-timing-function: ease;
    transition-property: border-radius;
    background: var(--ion-background-color);

    &:after {
      left: 50%;
      content: "";
      bottom: 4px;
      width: 48px;
      height: 4px;
      margin-left: -24px;
      border-radius: 2px;
      position: absolute;
      pointer-events: none;
      background: rgba(255, 255, 255, 0.12);
    }

    &--fixed {
      position: fixed;
      border-radius: 0;
      height: calc(var(--offset) + var(--ion-safe-area-top) + 20px);
      bottom: calc(100% - var(--offset) - var(--ion-safe-area-top) - 20px);
    }
  }
}

.backdrop-no-tappable {
  pointer-events: none;
}
.top-24 {
  padding-top: 24px;
}

<<<<<<< HEAD
.dashboard-container {
  width: 100%;
  min-height: 100vh;
  display: flex;

  &__sidebar {
    width: 256px;
    box-shadow: 6px 0px 18px 0px rgba(0, 0, 0, 0.25);
    background: var(--gray-700);
  }
=======
.empty-block {
  margin-top: 48px;
}
>>>>>>> 4a2c5a8c19259eb9e5a712aeeb4b130357980cf1

  &__right-section {
    width: calc(100% - 256px);
  }
}
</style>