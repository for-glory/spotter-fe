<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Gym Manager Profile">
      </page-header>
    </template>
    <template #content>
      <div class="main-content">
        <div class="profile-field">
          <div class="contact-field">
            <img :src="avatarUrl" id="avatar" />
            <ion-label class="name">
              {{ name }}
              <ion-icon slot="icon-only" src="assets/icon/arrow-down-light.svg"></ion-icon>
            </ion-label>
            <ion-text class="contact">{{"Gym Manager"}}</ion-text>
            <ion-text class="contact">{{"gymmanager@spotterfitness.com"}}</ion-text>
            <ion-text class="contact">{{"(+1)70 8750 9216"}}</ion-text>
          </div>
          <div class="data-box d-flex align-items-center justify-content-between">
            <div class="d-flex-col align-items-center">
              <ion-text id="main">{{40}}</ion-text>
              <ion-text class="field-label">Age</ion-text>
            </div>
            <div class="vertical-line"/>
            <div class="d-flex-col align-items-center">
              <ion-text id="main">{{"Full-Time"}}</ion-text>
              <ion-text class="field-label">Employment type</ion-text>
            </div>
            <div class="vertical-line"/>
            <div class="d-flex-col align-items-center">
              <ion-text id="main">{{"Manager"}}</ion-text>
              <ion-text class="field-label">Position</ion-text>
            </div>
          </div>
        </div>
        <week-calendar
          v-model="selectedDate"
          :bookings="bookings"
          @handle-view="onViewCalendar"
        />
        <div class="membership">
          <ion-title class="title">Membership Summary</ion-title>
          <ion-grid class="block">
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Message counts" value="13"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="Expiring membership" value="24"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <ion-button @click="showModal" fill="outline" color="danger" id="delete">Delete Manager</ion-button>
      </div>
    </template>
  </base-layout>
  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to delete account"
    description="Gym manager will be deleted"
    button-text="Cancel"
    cancel-button-text="No"
    @discard="onDeleteManager"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import {
  Query,
  GetManagersByFacilityDocument,
  UserDocument,
  RoleEnum,
  UserAvailabilityDocument
} from "@/generated/graphql";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter, useRoute } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@vue/apollo-composable";
import dayjs, { Dayjs } from "dayjs";
import useId from "@/hooks/useId";
import { useManagerStore } from "@/facilities/store/manager";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Calendar from "@/general/components/dashboard/Calendar.vue";
import WeekCalendar from "@/general/components/blocks/calendar/WeekCalendar.vue";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";

const router = useRouter();
const route = useRoute();
const currentFacility = useFacilityStore();
const { role } = useRoles();
const { id } = useId();
const store = useManagerStore();
const managerId = computed(() => route.params.id);

const name = computed(() => store.first_name + ' ' + store.last_name);
const avatarUrl = computed(() => store.avatarUrl);
const address = computed(() => store.address);
const selectedDate = ref<Dayjs | null>(dayjs());

const onViewCalendar = () => {
  router.push({ name: EntitiesEnum.DashboardCalendar });
};

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

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();

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
  }
  return availability;
});

onMounted(() => {
  console.log("id:", currentFacility.facility.id);
  console.log({ name });
  console.log({ avatarUrl });
  console.log({ address });
});

const onDeleteManager = () => {
  console.log("delete manager");
}
const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
.vertical-line {
  border: solid;
  border-width: 1px;
  border-radius: 2px;
  min-height: 100%;
  padding: 23px 0;
  border-color: var(--main-color);
}
.profile-field {
  display: flex;
  flex-direction: column;
  gap:22px;

  .calendar-title {
    font: 20px/1 var(--ion-font-family);
    color: #ffffff6a;
    padding: 0;
  }
}
.data-field {
  flex: auto;
}
.contact-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

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

img#avatar {
  border-radius: 100%;
  width: 86px;
  height: 86px;
}
.data-box {
  background-color: var(--gray-700);
  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 28px;
  padding-left: 28px;
  border-radius: 8px;

  .field-label {
    font: 300 14px/1 var(--ion-font-family);
    color: var(--gray-400);
    padding-top: 4px;
  }
}
.d-flex-col {
  display: flex;
  flex-direction: column;
}
ion-text#main {
  font: 500 18px/1 Yantramanav;
  color: #EFEFEF;
}
ion-button#delete {
  width: 100%;
  margin-top: 24px;
}

.membership {
  margin-top: 16px;

  .count {
    font-size: 1.625rem;
    color: var(--gold);
    padding-left: 0.6rem;
    font-weight: bold;
  }
  .period {
    font-size: 1rem;
    color: grey;
    padding-bottom: 0.6rem;
  }
  .time {
    font-size: 0.875rem;
    color: var(--gold);
  }
  .content {
    font-size: 1rem;
    color: #797979;
  }

  ion-row {
    justify-content: space-between;
    gap: 24px;
  }
}
.block {
  width: 100%;
  background-color: #262626;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;

  ion-row {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font: 400 16px/1 Lato;
  color: var(--fitnesswhite);
}
</style>
