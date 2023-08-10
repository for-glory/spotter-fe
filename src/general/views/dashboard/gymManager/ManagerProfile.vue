<template>
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
	>
    <div class="banner d-flex justify-content-between align-items-center">
      <ion-title class="banner__title">Gym Manager Profile</ion-title>
      <ion-button expand="block">Edit</ion-button>
    </div>
    <div class="content-container">
      <div class="profile-field">
        <div class="contact-field">
          <ion-img src="assets/manager-avatar.png"></ion-img>
          <ion-label class="name">
            {{"Ray Espinal"}}
            <ion-icon slot="icon-only" src="assets/icon/arrow-down.svg"></ion-icon>
          </ion-label>
          <ion-text class="contact">{{"Gym Manager"}}</ion-text>
          <ion-text class="contact">{{"gymmanager@spotterfitness.com"}}</ion-text>
          <ion-text class="contact">{{"(+1)70 8750 9216"}}</ion-text>
        </div>
        <div class="data-box d-flex align-items-center justify-content-between">
          <div class="d-flex-col align-items-center">
            <ion-text>{{40}}</ion-text>
            <ion-text class="field-label">Age</ion-text>
          </div>
          <div class="vertical-line"/>
          <div class="d-flex-col align-items-center">
            <ion-text>{{"Full-Time"}}</ion-text>
            <ion-text class="field-label">Employment type</ion-text>
          </div>
          <div class="vertical-line"/>
          <div class="d-flex-col align-items-center">
            <ion-text>{{"Manager"}}</ion-text>
            <ion-text class="field-label">Position</ion-text>
          </div>
        </div>
        <ion-title class="calendar-title">Calendar</ion-title>
        <calendar
          :selected="selectedDate"
          @change-day="dayChanged"
          :showAdditionalContent="false"
          :min="props?.options?.min"
          :max="props?.options?.max"
        />
      </div>
      <div class="data-field">
        <div class="content-box">
          <ion-title class="top">Membership Summary</ion-title>
          <ion-grid>
            <ion-row>
              <ion-col size="4">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="4">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
              <ion-col size="4">
                <summary-item title="Total" keyText="Experiment membership" value="24"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="4">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="4">
                <summary-item title="Today's" keyText="Event counts" value="13"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>
        <div class="content-box">
          <div >
            <div class="top d-flex justify-content-between align-items-center">
              <ion-title>Notification</ion-title>
              <div>
                <ion-text>{{ 8 }} task</ion-text>
                <ion-text>{{ " " + "completed" + " " }}</ion-text>
                <ion-text>out of {{ 10 }}</ion-text>
              </div>
            </div>
          </div>
          <div class="notification-box">
            <notification-item></notification-item>
            <notification-item></notification-item>
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
  IonGrid,
  IonText,
  IonTitle,
  IonIcon
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  WorkoutsDocument,
  QueryWorkoutsOrderByColumn,
  RoleEnum,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import useId from "@/hooks/useId";
import useFacilityId from "@/hooks/useFacilityId";
// import dayjs from "dayjs";
import useRoles from "@/hooks/useRole";
import {
  DatePickerModalResult,
  DatePickerModalOptions,
} from "@/interfaces/DatePickerModal";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import NotificationItem from "@/general/components/dashboard/NotificationItem.vue";
import Calendar from "@/general/components/dashboard/Calendar.vue";

const filter = ref<string>('profile');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");
const props = ref<DatePickerModalOptions>();
const selectedDate = ref<number>(Date.now());

const router = useRouter();

const handleClick = (value: string) => {
	filter.value = value;
}
const dayChanged = (event: any) => {
  selectedDate.value = new Date(event).getTime();
};

</script>

<style scoped lang="scss">
.holder-content {
  padding-left: 50px;
  padding-right: 28px;
  padding-top: -40px;
}
.banner {
  width: 100%;
  position: relative;
  overflow: hidden;

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
.content-container {
  padding-top: 51px;
  display: flex;
  gap: 62px;

  .top {
    margin-bottom: 40px;
  }
  .profile-field {
    width: 350px;
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
}
.content-box {
  background-color: var(--gray-700);
  padding-top: 34px;
  padding-left: 31px;
  padding-right: 31px;
  padding-bottom: 20px;
  border-radius: 8px;
  margin-bottom: 18px;
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
.notification-box {
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.d-flex-col {
  display: flex;
  flex-direction: column;
}
.vertical-line {
  border: solid;
  border-width: 2px;
  border-radius: 2px;
  min-height: 32px;
  border-color: var(--main-color);
}

</style>
