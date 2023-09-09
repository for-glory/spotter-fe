<template>
  <ion-item class="title ion-text-start"
    ><ion-icon
      class=""
      mode="ios"
      color="medium"
      :icon="chevronBackOutline"
    ></ion-icon>
    <span
      @click="navigate(EntitiesEnum.DashboardPassList)"
      class="medium ion-padding-end clickable"
      >Create Passes</span
    >
    <ion-icon
      class=""
      mode="ios"
      color="primary"
      :icon="chevronBackOutline"
    ></ion-icon>
    <span class="current-crumb">Nick Fox profile</span>
  </ion-item>

  <div class="profile-body">
    <div class="profile-avatar ion-margin-top">
      <img src="assets/mock/profile.jpeg" alt="" />
    </div>

    <div class="profile-name ion-text-center">
      <div class="title">
        <ion-grid>
          <ion-row class="ion-align-items-center">
            <ion-col class="medium">
              <ion-label class="ion-text-nowrap">Nick Fox</ion-label>
            </ion-col>
            <ion-col class="">
              <ion-icon src="assets/icon/like.svg" class="like" />
              <sup class="like-count">64</sup>
            </ion-col>
            <ion-col class="">
              <ion-icon src="assets/icon/dislike.svg" class="dislike" />
              <sup class="like-count">48</sup>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </div>

    <div class="profile-address">
      <!-- <ion-icon src="assets/icon/map-marker.svg" class="map-marker" /> -->
      <span class=""
        ><ion-icon :icon="locationSharp" mode="ios" color="primary"
      /></span>
      <span class="address-text">Summer Gym, Wall Stree, 24</span>
    </div>

    <div class="account-block ion-text-center">
      <ion-grid>
        <ion-row>
          <ion-col class="">
            <div class="ion-text-center account-text">150+</div>
            <div class="ion-text-center account-text-sub">Trainings</div>
          </ion-col>
          <ion-col class="">
            <div class="ion-text-center account-text">10 month</div>
            <div class="ion-text-center account-text-sub">in Spotter</div>
          </ion-col>
          <ion-col class="">
            <div class="ion-text-center account-text">208</div>
            <div class="ion-text-center account-text-sub">Feedback</div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>

    <div class="profile-summary center-horizontal ion-padding-vertical">
      <div class="segment">
        <ion-segment mode="ios" value="training" class="center-horizontal">
          <ion-segment-button
            @click="changeSegment('training')"
            value="training"
          >
            <ion-label class="">Training</ion-label>
          </ion-segment-button>
          <ion-segment-button @click="changeSegment('bundle')" value="bundle">
            <ion-label class="">Bundle</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <div v-if="activeTab === 'training'" class="plan-block">
        <ion-grid>
          <ion-row>
            <ion-col size="3" class="ion-text-start">
              <div class="text-14">Current plan</div>
              <div class="title-smaller">Premium Plan</div>
            </ion-col>
            <ion-col size="5" class="ion-text-start">
              <div class="text-14">Description</div>
              <div class="title-smaller">Get 1 session at the gym</div>
            </ion-col>
            <ion-col size="2" class="ion-text-start">
              <div class="text-14">Bundle valid until</div>
              <div class="title-smaller">19/08/2023</div>
            </ion-col>
            <ion-col size="2" class="ion-text-start">
              <div class="text-14">Payment status</div>
              <div class="title-smaller">Unpaid</div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <div v-if="activeTab === 'bundle'" class="plan-block">
        <ion-grid>
          <ion-row>
            <ion-col size="3" class="ion-text-start">
              <div class="text-14">Current plan</div>
              <div class="title-smaller">Bundle XXXX</div>
            </ion-col>
            <ion-col size="5" class="ion-text-start">
              <div class="text-14">Description</div>
              <div class="title-smaller">Bundle Get 1 XXXXX</div>
            </ion-col>
            <ion-col size="2" class="ion-text-start">
              <div class="text-14">Bundle valid until</div>
              <div class="title-smaller">XXXXX</div>
            </ion-col>
            <ion-col size="2" class="ion-text-start">
              <div class="text-14">Bundle status</div>
              <div class="title-smaller">XXXXX</div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>

      <div class="ion-padding-vertical">
        <ion-button class="ion-margin-end" color="success" type="submit"
          >Renew Membership</ion-button
        >
        <ion-button class="ion-margin-end" color="medium" type="submit"
          >Cancel Membership</ion-button
        >
        <ion-button color="danger" type="submit">Send Reminder</ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonGrid,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import { chevronBackOutline, locationSharp } from "ionicons/icons";
import { ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";

const router = useRouter();
const activeTab = ref("training");

const changeSegment = (segment: string) => {
  activeTab.value = segment;
  console.log("segment: " + segment);
};

const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
</script>

<style scoped lang="scss">
.title {
  padding: 0;
  display: block;
  // color: var(--beige);
  font: 400 24px var(--ion-font-family);

  ion-icon {
    margin-right: 8px;
  }
}

.text-14 {
  font-size: 14px;
}

.title-smaller {
  padding-top: 8px;
  display: block;
  font: 400 20px var(--ion-font-family);
}

.current-crumb {
  color: var(--beige);
}

.profile-body {
  text-align: center;
  // margin: 48px 10px 0;
  // padding: 16px 72px;
  // background-color: var(--gray-700);
  // border-radius: 8px;
}
.profile-avatar {
  img {
    width: 160px;
    height: auto;
    border-radius: 50%;
  }
}

.profile-name {
  width: fit-content;
  margin-right: auto;
  margin-left: auto;

  ion-icon {
    font-size: 32px;
    line-height: 1.5;
    margin-right: 0;
    margin-left: 0;
  }
  .like {
    color: var(--ion-color-success);
  }
  .like-count {
    font-size: 10px;
    margin: 0;
  }
  .dislike {
    color: var(--ion-color-danger);
  }
  .dislike-count {
    font-size: 10px;
    margin: 0;
  }
}
.center-horizontal {
  margin-right: auto;
  margin-left: auto;
}
sup {
  vertical-align: super;
  font-size: smaller;
}
.profile-address {
  font: 300 18px var(--ion-font-family);
  padding: 10px 0 16px 0;

  .map-marker {
    font-size: 32px;
    color: var(--ion-color-light);
  }
  .address-text {
    padding-left: 6px;
  }
}

.account-block {
  background-color: var(--gray-600);
  border-radius: 8px;
  max-width: 370px;
  margin: 0 auto;
  margin-bottom: 16px;
}
.profile-summary {
  background-color: var(--gray-600);
  border-radius: 8px;
  max-width: 888px;
}
.segment {
  margin-bottom: 16px;
}
ion-segment {
  --background: var(--gray-500);
  width: 260px;
}

ion-segment-button {
  --indicator-color: var(--beige);
  --color: var(--ion-color-light);
  --color-checked: var(--ion-color-dark);
}

.plan-block {
  padding: 16px 72px;
}

.account-text {
  font-weight: bold;
  margin-top: 8px;
  margin-bottom: 16px;
}
.account-text-sub {
  color: var(--gray-400);
  font-size: 14px;
  margin-bottom: 10px;
}
.clickable {
  cursor: pointer;
}
</style>
