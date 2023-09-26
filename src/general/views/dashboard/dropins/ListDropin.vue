<template>
  <div>
    <ion-item class="title ion-text-start">
      <ion-icon
        class=""
        mode="ios"
        color="medium"
        :icon="chevronBackOutline">
      </ion-icon>
      <span @click="navigate(EntitiesEnum.DashboardDropinList)" class="medium ion-padding-end clickable">Drop-Ins</span>
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
          <pass-dropins-list :dataList="dropins" :unit="'Days'"  @delete="isDelete" @edit="isEditPass"/>
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
  FacilityItemsByFacilityIdAndTypeDocument,
  DeleteFacilityItemDocument
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinDataTable from "@/general/components/dataTables/PassDropinDataTable.vue";
import PassDropinsList from "@/general/components/dashboard/pass-dropins-list/PassDropinsList.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { ref, computed } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { usePassDropinsItemsStore } from "@/general/stores/usePassDropinsItemsStore";

const router = useRouter();
const filter = ref<string>("all");
const currentFacility = useFacilityStore();

const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
const isDeleteModalOpen = ref(false);
const store = usePassDropinsItemsStore();
const selectedDropin = ref(null);

store.clearState();
// Dropins start
const {
  result: dropinResult,
  loading: loadingFacilityDropin,
  refetch
} = useQuery(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacility.facility.id,
  item_type: "DROPIN"
});

const dropins = computed(() => {
  return dropinResult.value?.facilityItemsByFacilityIdAndType?.data;
});

const handleFilter = (filterStr: string) => {
  filter.value = filterStr;
}

const isDelete = (data: any) => {
  isDeleteModalOpen.value = true;
  selectedDropin.value = data;
};

const { mutate } = useMutation(DeleteFacilityItemDocument);

const deleteModalClosed = (approved: boolean) => {
  isDeleteModalOpen.value = false;
  if (approved) {
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
  store.setData(data);
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
.title {
  cursor: pointer;
  padding: 0;
  display: block;
  font: 400 24px var(--ion-font-family);
  --background: transparent;
  ion-icon {
    margin-right: 8px;
    margin-left: -6px;
  }
}
</style>
