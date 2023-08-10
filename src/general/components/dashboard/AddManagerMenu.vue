<template>
	<ion-menu side="end" content-id="main-content">
    <ion-header>
      <ion-toolbar class="title">
        <ion-menu-toggle class="back-btn" :auto-hide="false">
          <ion-icon src="assets/icon/arrow-back.svg"></ion-icon>
        </ion-menu-toggle>
        <ion-title>Add new manager</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="tile">
        <ion-label>Choose portfolio photo</ion-label>
        <div class="image-upload">
          <div class="icon">
            <ion-icon src="assets/icon/cross.svg"></ion-icon>
          </div>
        </div>
      </div>
      <div class="tile">
        <ion-label>Full name</ion-label>
        <ion-input placeholder="First name, Last name"></ion-input>
      </div>
      <div class="tile">
        <ion-label>Email</ion-label>
        <ion-input placeholder="Enter email address"></ion-input>
      </div>
      <div class="tile">
        <ion-label>Postal code</ion-label>
        <ion-input></ion-input>
      </div>
      <div class="tile">
        <ion-label>Date Of Birth</ion-label>
        <ion-input placeholder="DD/MM/YY"></ion-input>
      </div>
      <div class="tile">
        <ion-label>Address</ion-label>
        <ion-input placeholder="Street name Alabama, USA"></ion-input>
      </div>
      <div class="tile">
        <ion-label>Employment Type</ion-label>
        <ion-input placeholder="Full Time"></ion-input>
      </div>
      <div class="tile">
        <ion-label>Tax ID</ion-label>
        <ion-input></ion-input>
      </div>
      <ion-menu-toggle>
        <ion-button>Add Manager</ion-button>
      </ion-menu-toggle>
    </ion-content>
  </ion-menu>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonText,
  IonTitle,
  IonIcon,
  IonMenuToggle,
  IonInput,
  IonMenu,
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
const imageUrl = ref<string>('');

const { id: myId } = useId();
const { id: myFacilityId } = useFacilityId();
const { role: myRole } = useRoles();

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const router = useRouter();

</script>

<style scoped lang="scss">


.title {
  position: relative;
  text-align: center;
  padding: 9px;
}
.back-btn {
  position: absolute;
  inset: 0;
  padding-top: 9px;
  padding-bottom: 9px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}
.image-upload {
  background-color: var(--main-color);
  width: 88px;
  height: 88px;
  border: 1px dashed var(--gray-500);
  border-radius: 8px;
  position: relative;

  .icon {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

ion-button {
  max-height: 48px;
  width: 100%;
}
ion-input {
  border: solid;
  border-color: #FFFFFF6a;
  border-radius: 8px;
  border-width: 1px;
  margin-top: 6px;
  margin-bottom: 6px;
  --placeholder-color: var(--ion-color-medium);
}
ion-label {
  font: 400 14px/1 var(--ion-font-family);
}
</style>
