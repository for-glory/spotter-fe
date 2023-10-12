<template>
  <div>
    <ion-item class="title ion-text-start">
      <ion-icon
        class=""
        mode="ios"
        color="medium"
        :icon="chevronBackOutline">
      </ion-icon>
      <span @click="onBack" class="medium ion-padding-end clickable">Back</span>
    </ion-item>
  </div>
  <ion-grid fixed>
    <ion-row>
      <ion-col size="12">
        <ion-spinner v-if="loadingFacilityPass" name="lines" class="spinner" />
        <div v-else>
          <div  v-if="!facilityItems || !facilityItems.length">
            <empty-block
              class="empty-block"
              :title="emptyTitle"
              hideButton
              :text="emptyText"
              :icon= "emptyImage"
            />
          </div>
         <div v-else>
          <pass-dropins-list :dataList="facilityItems" :unit="unit" is-purchase  @purchase="handlePurchase"/>
         </div>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/vue";
import {
  FacilityItemsByFacilityIdAndTypeDocument,
} from "@/generated/graphql";
import PassDropinsList from "@/general/components/dashboard/pass-dropins-list/PassDropinsList.vue";
import { useQuery } from "@vue/apollo-composable";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { chevronBackOutline } from "ionicons/icons";

const router = useRouter();
const route = useRoute();

// facility items
const {
  result: facilityItemPassResultList,
  loading: loadingFacilityPass
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: route.params.id,
  item_type: route.params.type
});

const facilityItems = computed(() => {
  return facilityItemPassResultList.value?.facilityItemsByFacilityIdAndType?.data;
});

const unit = computed(() => {
  return route.params.type === "PASS" ? "Months" : "Days";
});

const emptyTitle = computed(() => {
  return route.params.type === "PASS" ? "Passes Empty" : "Drop-ins Empty";
});

const emptyText = computed(() => {
  return route.params.type === "PASS" ? "No Gym pass created yet" : "No drop-ins created yet";
});

const emptyImage = computed(() => {
  return route.params.type === "PASS" ? "assets/icon/gym-user-icon.svg" : "assets/icon/dropin.svg";
});

const handlePurchase = () => {
  console.log('purchase');
}

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

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.title {
  padding: 0;
  display: block;
  font: 400 24px var(--ion-font-family);
  --background: transparent;
  cursor: pointer;
  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}
</style>
