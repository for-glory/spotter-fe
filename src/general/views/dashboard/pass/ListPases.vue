<template>
  <div>
    <ion-item class="title ion-text-start">
      <ion-icon
        class=""
        mode="ios"
        color="medium"
        :icon="chevronBackOutline">
      </ion-icon>
      <span @click="navigate(EntitiesEnum.DashboardPassList)" class="medium ion-padding-end clickable">Gym Pass</span>
    </ion-item>
  </div>
  <ion-grid fixed>
    <ion-row>
      <ion-col size="12">
        <div class="pass-list ion-margin-top">
          <div class="d-flex justify-content-between pass-list__top">
            <div class="ion-padding-vertical">
              <!-- <ion-button
                class="button-rounded ion-margin-end"
                :fill="filter==='all'?'solid':'outline'"
                @click="handleFilter('all')">
                All
              </ion-button>
              <ion-button
                class="button-rounded ion-margin-end"
                :fill="filter==='active'?'solid':'outline'"
                @click="handleFilter('active')">
                Active
              </ion-button>
              <ion-button
                class="button-rounded ion-margin-end"
                :fill="filter==='expired'?'solid':'outline'"
                @click="handleFilter('expired')">
                Expired
              </ion-button> -->
            </div>
            <div class="ion-padding-vertical">
              <ion-button @click="navigate(EntitiesEnum.DashboardPassCreate)" class="ion-margin-end" fill="solid">
                Create Passes
              </ion-button>
            </div>
          </div>
        </div>
        <ion-spinner v-if="loadingFacilityPass" name="lines" class="spinner" />
        <div v-else>
          <div  v-if="!passes || !passes.length">
            <empty-block
              class="empty-block"
              title="Gym pass Empty"
              hideButton
              text="No Gym pass created yet"
              icon= "assets/icon/gym-user-icon.svg"
            />
          </div>
         <div v-else>
          <pass-dropins-list :dataList="passes" :unit="'Months'"  @delete="isDelete" @edit="isEditPass"/>
         </div>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
  <discard-changes
    :is-open="isDeleteModalOpen"
    @close="deleteModalClosed"
    title="Do you want to delete gym pass?"
    text="gym pass will be deleted"
    cancelButton="Cancel"
    button="Delete"
  />
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
  Query,
  GetCustomersByFacilityItemsDocument,
  FacilityItemsByFacilityIdAndTypeDocument,
  DeleteFacilityItemDocument
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinsList from "@/general/components/dashboard/pass-dropins-list/PassDropinsList.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { usePassDropinsItemsStore } from "@/general/stores/usePassDropinsItemsStore";
import { chevronBackOutline } from "ionicons/icons";

const store = usePassDropinsItemsStore();
const selectedDropin = ref(null);


const router = useRouter();
const currentFacility = useFacilityStore();
const filter = ref<string>("all");
const isDeleteModalOpen = ref(false);

const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};


// Passes start
const {
  result: facilityItemPassResultList,
  refetch
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacility.facility.id,
  item_type: "PASS"
});

const passes = computed(() => {
  console.log("### passes ", facilityItemPassResultList.value?.facilityItemsByFacilityIdAndType?.data[0]);
  return facilityItemPassResultList.value?.facilityItemsByFacilityIdAndType?.data;
});

// Passes End

const isDelete  = (data: any) => {
  console.log("Is delete: ", data);
  isDeleteModalOpen.value = true;
  selectedDropin.value = data;
};
const { mutate } = useMutation(DeleteFacilityItemDocument);

const deleteModalClosed = (approved: boolean) => {
  isDeleteModalOpen.value = false;
  if(approved){
    console.log('approved: ', approved);
    mutate({
      id: selectedDropin?.value?.id,
    })
    .then(() => {
      refetch();
    })
    .catch((err) => {
      console.log(err);
    });
  }
};
const isEditPass = (data: any) => {
  console.log('edit pass data123: ', data);
  store.setData(data);
  router.push({
    name: EntitiesEnum.DashboardPassCreate,
    params: {
      id: data.id,
    }
  })
}

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
