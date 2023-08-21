<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Gym pass" />
    </template>
    <template #content>
      <ion-grid fixed>
        <ion-row>
          <ion-col size="12">
            <div class="pass-list ion-margin-top">
              <div class="d-flex justify-content-between pass-list__top">
                <div class="ion-padding-vertical">
                  <ion-button class="button-rounded ion-margin-end" fill="solid"
                    >All</ion-button
                  >
                  <ion-button
                    color="medium"
                    class="button-rounded ion-margin-end"
                    fill="outline"
                    >Active</ion-button
                  >
                  <ion-button
                    color="medium"
                    class="button-rounded ion-margin-end"
                    fill="outline"
                    >Renewal</ion-button
                  >
                  <ion-button
                    color="medium"
                    class="button-rounded ion-margin-end"
                    fill="outline"
                    >Expired</ion-button
                  >
                </div>
                <div class="ion-padding-vertical">
                  <ion-button
                    @click="navigate(EntitiesEnum.DashboardPassCreatePass)"
                    class="ion-margin-end"
                    fill="solid"
                    >Create Gym pass</ion-button
                  >
                  <ion-button
                    @click="navigate(EntitiesEnum.DashboardPassCreateDropin)"
                    class=""
                    fill="outline"
                    >Create Drop ins</ion-button
                  >
                </div>
              </div>
            </div>

            <div class="segment">
              <ion-segment mode="ios" value="subscribers">
                <ion-segment-button
                  @click="changeSegment('subscribers')"
                  value="subscribers"
                >
                  <ion-label class="ion-text-wrap"
                    >Membership subscribers</ion-label
                  >
                </ion-segment-button>
                <ion-segment-button
                  @click="changeSegment('dropins')"
                  value="dropins"
                >
                  <ion-label class="ion-text-wrap">Drop ins sales</ion-label>
                </ion-segment-button>
              </ion-segment>
            </div>

            <div>
              <pass-subscriber-data-table v-if="activeTab === 'subscribers'" />
              <pass-dropin-data-table v-if="activeTab === 'dropins'" />
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
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
  PaymentGatewayRefundDocument,
  Query,
  SettingsCodeEnum,
  TrainingDocument,
  TrainingStatesEnum,
  FacilityItemPassDocument,
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinDataTable from "@/general/components/dataTables/PassDropinDataTable.vue";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();

const changeSegment = (segment: string) => {
  activeTab.value = segment;
  console.log("segment: " + segment);
};
const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};

const {
  result: facilityResult,
  load: getFacility,
  onResult: gotFacility,
} = useLazyQuery<Pick<Query, "facilityItemPass">>(FacilityItemPassDocument, {
  id: currentFacility.facility.id,
});

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.title {
  padding: 0;
  display: block;
  color: var(--beige);
  font: 400 24px var(--ion-font-family);

  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}
.pass-list {
  background-color: var(--gray-700);

  &__top {
    margin-bottom: 16px;
    padding: 8px 24px;
    .button {
      height: 42px;
    }
  }
}
.segment {
  margin-bottom: 72px;
  width: fit-content;
}
ion-segment {
  border: 1px solid var(--beige);
  --background: var(--gray-700);
  border-radius: 0;
  width: 230px;
}

ion-segment-button {
  padding: 12px 16px;
  --indicator-color: var(--beige);
  --color: var(--ion-color-light);
  --color-checked: var(--ion-color-dark);
  --border-radius: 0;
  margin: 0 -2px;
}

ion-label {
  font-size: 16px;
}
</style>
