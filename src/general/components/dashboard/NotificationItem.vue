<template>
  <div class="notification-item d-flex justify-content-between">
    <div>
      <div class="notification-information">
        <ion-text>Google meet call schedule</ion-text>
        <div class="d-flex">
          <div class="time-field">
            <ion-text class="field-label">Due date:</ion-text>
            <ion-text class="field-value">30 August, 2023</ion-text>
          </div>
          <div class="time-field">
            <ion-text class="field-label">Due time:</ion-text>
            <ion-text class="field-value">8: 34 AM</ion-text>
          </div>
        </div>
      </div>
      <div class="avatar-field d-flex align-items-center">
        <ion-img src="assets/manager-avatar.png" class="avatar"></ion-img>
        <ion-text>Gym owner</ion-text>
      </div>
    </div>
    <div class="behaviour">
      <ion-text>Reminder</ion-text>
      <ion-button>Connect</ion-button>
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


const filter = ref<string>('profile');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();

</script>

<style scoped lang="scss">
.content-box {
  background-color: var(--gray-700);
  padding-top: 34px;
  padding-left: 30px;
  padding-right: 90px;
  padding-bottom: 20px;
  border-radius: 8px;
}
.notification-item {
  background-color: var(--main-color);
  padding-top: 16px;
  padding-left: 22px;
  padding-right: 22px;
  padding-bottom: 18px;
  border-radius: 4px;
  
  .notification-information {
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .time-field {
    display: flex;
    padding-right: 47px;
    gap: 5px;
    font: 13px/1 var(--ion-font-family);
  }
  .field-label {
    color: var(--gray-500);
  }
  .field-value {
    color: var(--gray-text);
  }
  .avatar-field {
    padding-top: 24px;
    font: 13px/1 var(--ion-font-family);

    .avatar {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
    
    ion-text{
      color: var(--gray-text);
    }
  }
  .behaviour {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    font: 500 12px/1 var(--ion-font-family);

    ion-button {
      --background: #2ed47a;
      color: var(--fintnesswhite);
      font: 500 12px/1 var(--ion-font-family);
      max-height: 38px;
    }
  }
}
</style>
