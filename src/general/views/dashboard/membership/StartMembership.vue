<template>
  <div class="page-content">
    <div class="plan">
      <ion-title class="font-20" color="primary">
        Start with 30 days free trial
      </ion-title>
      <ion-title class="font-40 white-text" color="primary">
        Choose your plan
      </ion-title>
      <div class="plan-features">
        <div class="plan-features__item">
          <ion-icon src="assets/icon/check-mark.svg" color="primary" />
          <ion-text>All Features</ion-text>
        </div>
        <div class="plan-features__item">
          <ion-icon src="assets/icon/check-mark.svg" color="primary" />
          <ion-text>Other Features</ion-text>
        </div>
        <div class="plan-features__item">
          <ion-icon src="assets/icon/check-mark.svg" color="primary" />
          <ion-text>Premium Access</ion-text>
        </div>
      </div>
      <ion-text class="font-20" color="primary">
        Enjoy full feature with the right plan
      </ion-text>
      <ion-text class="font-20 grey-text">
        You currently do not have an active plan, click next to get started
      </ion-text>
    </div>
    <div class="buttons">
      <ion-button expand="block" @click="handleContinue"> Next </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonText,
  IonImg,
  IonButton,
  IonIcon,
  IonGrid,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const router = useRouter();
const currentFacility = useFacilityStore();

if (currentFacility?.facility?.id) {
  router.push({
    name: EntitiesEnum.DashboardOverview,
  });
}

const onBack = () => {
  router.go(-1);
};

const handleContinue = () => {
  router.push({
    name: EntitiesEnum.DashboardSelectMembership,
  });
};
</script>

<style scoped lang="scss">
.page-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.title {
  padding: 0;
  margin-bottom: 20px;
  color: var(--gold);
  font-family: Lato;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
}

.plan {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: fit-content;

    &__item {
      display: flex;
      gap: 1rem;
    }
  }
}

.buttons {
  width: 40%;
  margin-top: 10vh;
  .button {
    margin: 0;
    text-align: center;
    font-family: Lato;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }
}
</style>
