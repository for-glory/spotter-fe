<template>
  <div>
    <ion-title class="title">
      My Profile
    </ion-title>
    <div class="content-box content-box__top justify-content-between">
      <div class="d-flex align-items-center">
        <ion-avatar class="photo">
					<ion-img v-if="store.avatarUrl" :src="store.avatarUrl"></ion-img>
					<template v-else>
						{{ store.first_name?.charAt(0) }}
					</template>
				</ion-avatar>
        <div class="main-info-box">
          <ion-title class="content-box__title">{{ store.first_name }} {{ store.last_name }}</ion-title>
          <ion-label class="main-info-box__label" color="medium">{{ roleText }}</ion-label>
          <ion-label class="main-info-box__label" color="medium">Arizona, Phoenix, USA</ion-label>
        </div>
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <ion-menu-toggle :auto-hide="false">
          <ion-button fill="outline" class="content-box__button">Edit</ion-button>
        </ion-menu-toggle>
      </div>
    </div>
    <!-- <div class="content-box">
      <div class="content-box__top justify-content-between">
        <ion-title class="content-box__title">Personal Information</ion-title>
      </div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">First Name</ion-label>
            <ion-text class="text-value">{{ store.first_name }}</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Last Name</ion-label>
            <ion-text class="text-value">{{ store.last_name }}</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Email Address</ion-label>
            <ion-text class="text-value">{{ store.email }}</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Phone</ion-label>
            <ion-text class="text-value">N/A</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Tax ID</ion-label>
            <ion-text class="text-value">N/A</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Address</ion-label>
            <ion-text class="text-value">N/A</ion-text>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div> -->
    <!-- <div class="content-box">
      <div class="content-box__top justify-content-between">
        <ion-title class="content-box__title">Address</ion-title>
        <ion-button fill="outline"  class="content-box__button">Edit</ion-button>
      </div>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Country</ion-label>
            <ion-text class="text-value">United States</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">City/State</ion-label>
            <ion-text class="text-value">Arizona, USA</ion-text>
          </ion-col>
        </ion-row>
        <ion-row>
          <ion-col>
            <ion-label class="text-label" color="medium">Postal code</ion-label>
            <ion-text class="text-value">100011</ion-text>
          </ion-col>
          <ion-col>
            <ion-label class="text-label" color="medium">Tax ID</ion-label>
            <ion-text class="text-value">AA742GA667</ion-text>
          </ion-col>
        </ion-row>      
      </ion-grid>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
import {
	IonTitle,
  IonButton,
  IonLabel,
  IonAvatar,
  IonImg,
	IonGrid,
	IonRow,
	IonCol,
  IonMenuToggle
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { useProfileStore } from "../../../stores/profile";
import { requiredFieldSchema } from "@/validations/authValidations";
import { v4 as uuidv4 } from "uuid";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { useMutation } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { Emitter, EventType } from "mitt";

const store = useProfileStore();
console.log("store", store);


const { role } = useRoles();

const roleText = computed(() => {
  if (role === RoleEnum.Admin) {
    return "Admin";
  } else if (role === RoleEnum.FacilityOwner) {
    return "Gym Owner";
  } else if (role === RoleEnum.Manager) {
    return "Gym Manager";
  } else if (role === RoleEnum.OrganizationOwner) {
    return "Organization Owner";
  } else if (role === RoleEnum.Trainer) {
    return "Trainer";
  } else return "User";
});

</script>

<style lang="scss" scoped>

ion-grid {
  padding: 0;

  ion-col {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0; 
  }

  ion-row {
    padding-top: 8px;
    padding-bottom: 8px;
  }
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 24px;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.dashboard-btn {
  margin-top: 10px;
}
.content-box {
  background-color: #0000001a;
  margin-top: 20px;
  margin-bottom: 20px;
  padding-top: 18px;
  padding-left: 21px;
  padding-bottom: 20px;

  .photo {
    width: 94px;
    height: 94px;
    margin-right: 24px;
  }

  &__top {
    display: flex;
    padding-right: 13px;
    padding-bottom: 18px;
  }

  &__title {
    padding-top: 5px;
    padding-left: 0px;
    padding-right: 0px;

  }

  &__button {
    max-height: 40px;
    max-width: 73px;
  }

}
.main-info-box {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &__label {
    font: 14px/1 var(--ion-font-family);
  }
}
.text-value {
  color: var(--grey-text);
  font: 600 18px/1 var(--ion-font-family);
}
.text-label {
  font: 400 12px/1 var(--ion-font-family);
}
</style>
