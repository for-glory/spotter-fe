<template>
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
          <pass-dropins-list :dataList="passes"  @delete="isDelete" @edit="isEditPass"/>
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
  FacilityItemsByFacilityIdAndTypeDocument
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinsList from "@/general/components/dashboard/pass-dropins-list/PassDropinsList.vue";
import { useQuery } from "@vue/apollo-composable";
import { ref, computed } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

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
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacility.facility.id,
  item_type: "PASS"
});

const passes = computed(() => {
  console.log("### passes ", facilityItemPassResultList.value?.facilityItemsByFacilityIdAndType?.data[0]);
  return facilityItemPassResultList.value?.facilityItemsByFacilityIdAndType?.data;
});

// Passes End

const isDelete  = (flag: Boolean) => {
  console.log("Is delete");
  isDeleteModalOpen.value = true;
};

const deleteModalClosed = (approved: boolean) => {
  isDeleteModalOpen.value = false;
  if(approved){
    console.log("aasdasda");
    // deleteFacility({ id : currentFacilityId})
    // .then(async () => {
    //   const toast = await toastController.create({
    //     message: "Gym was deleted successfully",
    //     duration: 2000,
    //     icon: "assets/icon/success.svg",
    //     cssClass: "success-toast",
    //   });
    //   toast.present();
    //   goBack();
    // })
    // .catch(async (error) => {
    //   const toast = await toastController.create({
    //     message: "Something went wrong. Please try again.",
    //     icon: "assets/icon/info.svg",
    //     cssClass: "danger-toast",
    //   });
    //   toast.present();
    //   throw new Error(error);
    // });
  }
};
const isEditPass = (data: any) => {
  console.log('edit pass data: ', data)
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
</style>
