<template>
  <ion-spinner
        v-if="loading"
        name="lines"
        class="spinner"
      />
	<div
		class="holder-content ion-padding-horizontal"
		:class="{ 'holder-content--empty': !loading }"
    v-else
	>
    <div class="banner d-flex justify-content-between align-items-center">
      <ion-title class="banner__title">Gym Manager Profile</ion-title>
      <ion-button expand="block">Edit</ion-button>
    </div>
    <div class="content-container">
      <div class="profile-field">
        <div class="contact-field">
          <ion-avatar class="photo">
            <ion-img v-if="manager.avatarUrl" :src="manager.avatarUrl"></ion-img>
            <template v-else>
              {{ manager.first_name?.charAt(0) }}
            </template>
          </ion-avatar>
          <ion-label class="name">
            {{ `${manager.first_name} ${manager.last_name}`}}
          </ion-label>
          <!-- <ion-text class="contact">{{ manager.employment_type }}</ion-text> -->
          <ion-text class="contact">{{ manager.email }}</ion-text>
          <!-- <ion-text class="contact">{{"(+1)70 8750 9216"}}</ion-text> -->
        </div>
        <div class="data-box d-flex align-items-center justify-content-between">
          <div class="d-flex-col align-items-center">
            <ion-text>{{40}}</ion-text>
            <ion-text class="field-label">Age</ion-text>
          </div>
          <div class="vertical-line"/>
          <div class="d-flex-col align-items-center">
            <ion-text>{{ manager.employment_type }}</ion-text>
            <ion-text class="field-label">Employment type</ion-text>
          </div>
          <div class="vertical-line"/>
          <div class="d-flex-col align-items-center">
            <ion-text>{{"Manager"}}</ion-text>
            <ion-text class="field-label">Position</ion-text>
          </div>
        </div>
      </div>
      <!-- <div class="data-field">
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
      </div> -->
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
  IonAvatar,
  IonImg
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import {
  UserDocument,
  QueryWorkoutsOrderByColumn,
  RoleEnum,
  SortOrder,
} from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
// import dayjs from "dayjs";
import SummaryItem from "@/general/components/dashboard/SummaryItem.vue";

const route = useRoute();

const { result, loading } = useQuery(UserDocument, {
  id: route.params.id
});
console.log(result.value)
const manager = computed(() => {
  return result.value?.user ?? {
    first_name: "",
    last_name: "",
    avatarUrl: "",
    employment_type: ""
  };
});
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
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.photo {
  width: 94px;
  height: 94px;
}

</style>
