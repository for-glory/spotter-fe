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
              <ion-button
                @click="navigate(EntitiesEnum.DashboardDropinCreate)"
                class=""
                fill="solid"
                >Create Drop ins</ion-button
              >
            </div>
          </div>
        </div>        
        <ion-spinner
          v-if="loadingFacilityDropin"
          name="lines"
          class="spinner"
        />
        <div v-else>
          <pass-dropins-list :dataList="dropins"  @delete="isDelete" @edit="isEditPass"/>
          <!-- <pass-dropin-data-table :dropins="dropins"/> -->
        </div>
        <div class="card-background" v-if="!dropins || !dropins.length">
            <empty-block
              title="Drop-ins Empty"
              hideButton
              text="No drop-ins created yet"
              icon= "assets/icon/dropin.svg"
            />
          </div>
      </ion-col>
    </ion-row>
  </ion-grid>
  <discard-changes
      :is-open="isDeleteModalOpen"
      @close="deleteModalClosed"
      title="Do you want to delete drop-in?"
      text="gym drop-in will be deleted"
      cancelButton="Cancel"
      button="Delete"
    />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol
} from "@ionic/vue";
import {
  // GetCustomersByFacilityItemsDocument,
  FacilityItemsByFacilityIdAndTypeDocument
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinDataTable from "@/general/components/dataTables/PassDropinDataTable.vue";
import PassDropinsList from "@/general/components/dashboard/pass-dropins-list/PassDropinsList.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { ref, computed } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const router = useRouter();
const filter = ref<string>("all");
const currentFacility = useFacilityStore();

const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
const isDeleteModalOpen = ref(false);

// Dropins start
const {
  result: dropinResult,
  loading: loadingFacilityDropin
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacility.facility.id,
  item_type: "DROPIN"
});

const dropins = computed(() => {
  console.log("### dropinResult ", dropinResult.value?.facilityItemsByFacilityIdAndType);
  return dropinResult.value?.facilityItemsByFacilityIdAndType?.data;
});

// Dropins End

// const {
//   result: dropinResult,
//   loading: loadingFacilityDropin,
//   onResult
// } = useQuery(GetCustomersByFacilityItemsDocument, {
//   facility_id: currentFacility.facility.id,
//   item_type: "DROPIN"
// });

// const dropins = computed(() => {
//   return dropinResult.value?.getCustomersByFacilityItems?.data.filter(item => {
//     if (filter.value === "all") {
//       return true;
//     }
//     else if (filter.value === "active") {
//       return item.is_active_pass;
//     }
//     else if (filter.value === "expired") {
//       return !item.is_active_pass;
//     }
//   })
// });
const handleFilter = (filterStr: string) => {
  filter.value = filterStr;
}

const isDelete = (flag: Boolean) => {
  console.log("Is delete");
  isDeleteModalOpen.value = true;
};

const deleteModalClosed = (approved: boolean) => {
  isDeleteModalOpen.value = false;
  if (approved) {
    console.log("aasdasda")
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
  // navigate(EntitiesEnum.DashboardDropinCreate);
  router.push({
    name: EntitiesEnum.DashboardDropinCreate,
    params: {
      id: data.id
    },
  });
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
