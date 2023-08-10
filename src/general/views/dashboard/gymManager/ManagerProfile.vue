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
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonText,
  IonTitle
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
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import NotificationItem from "@/general/components/dashboard/NotificationItem.vue";


const filter = ref<string>('profile');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();

const handleClick = (value: string) => {
	filter.value = value;
}

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
  flex-direction: column;
  gap: 62px;

  .top {
    margin-bottom: 40px;
  }
}
.content-box {
  background-color: var(--gray-700);
  padding-top: 34px;
  padding-left: 31px;
  padding-right: 31px;
  padding-bottom: 20px;
  border-radius: 8px;
}
.notification-box {
  display: flex;
  flex-direction: column;
  gap: 17px;
}
</style>
