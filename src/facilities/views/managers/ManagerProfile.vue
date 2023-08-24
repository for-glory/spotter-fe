<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Gym Manager Profile">
        <template #custom-btn>
          <ion-icon id="header" @click="handleAddGymManager" src="assets/icon/plus.svg" />
        </template>
      </page-header>
    </template>
    <template #content>
      <div class="main-content">
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
        </div>
      </div>
    </template>
  </base-layout>
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
  RoleEnum
} from "@/generated/graphql";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";
import { useQuery } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import Calendar from "@/general/components/dashboard/Calendar.vue";

const router = useRouter();
const currentFacility = useFacilityStore();
const { role } = useRoles();
const { id } = useId();

onMounted(() => {
  console.log("id:", currentFacility.facility.id);
});

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
  border-width: 2px;
  border-radius: 2px;
  min-height: 32px;
  border-color: var(--main-color);
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
</style>
