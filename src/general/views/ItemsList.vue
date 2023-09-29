<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" :title="type === 'PASS' ? 'Passes' : 'Drop-ins'">
        <template #custom-btn>
          <ion-button @click="handleCreate" class="header-btn">
            <ion-icon src="assets/icon/plus.svg" />
          </ion-button>
        </template>
      </page-header>
    </template>
    <template #content>
      <ion-spinner
        v-if="loadingFacilityItems"
        name="lines"
        class="spinner"
      />
      <div v-else class="main-content">
        <div v-if="!products?.length" class="empty-pass d-flex-col align-items-center justify-content-center gap-25">
          <ion-button @click="handleCreate">{{type === 'PASS' ? 'Create Pass' : 'Create Drop-in'}}</ion-button>
          <div class="empty-box d-flex-col align-items-center">
            <ion-icon src="assets/icon/drop-ins.svg"></ion-icon>
            <ion-text class="status">{{ type === 'PASS' ? 'Pass' : 'Drop-in' }} Empty</ion-text>
          </div>
        </div>
        <div v-else>
          <product-item 
            v-for="(product, id) in products"
            :key="id"
            :item="product"
            @open-settings="showSettingsModal(product.id)"
          />
        </div>
      </div>
    </template>
  </base-layout>
  <ion-modal
    ref="modal"
    :is-open="isSettingModalOpen"
    class="settings-modal"
    @willDismiss="isSettingModalOpen = false"
  >
    <div class="main-buttons">
      <ion-button
        id="delete"
        @click="handleDelete"
        expand="block"
      >
        Delete {{type === 'PASS' ? 'Passes' : 'Drop-in'}}
      </ion-button>
      <div class="split"/>
      <ion-button
        id="create"
        @click="handleEdit"
        expand="block"
      >
        Edit {{type === 'PASS' ? 'Passes' : 'Drop-in'}}
      </ion-button>
    </div>
    <ion-button
      id="cancel"
      @click="isSettingModalOpen = false"
      expand="block"
    >
      Cancel
    </ion-button>
  </ion-modal>
  <confirmation
    :is-visible="showConfirmationModal"
    :title="'Do you want to delete' + (type === 'PASS' ? ' Passes' : ' drop-in?') + '?'"
    :description="(type === 'PASS' ? 'Passes' : 'Drop-in') + ' will be deleted'"
    button-text="Delete"
    @discard="onDelete"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonModal
} from "@ionic/vue";
import {
  PaymentGatewayRefundDocument,
  Query,
  SettingsCodeEnum,
  TrainingDocument,
  TrainingStatesEnum,
  FacilityItemsByFacilityIdAndTypeDocument,
  DeleteFacilityItemDocument,
} from "@/generated/graphql";
import PassSubscriberDataTable from "@/general/components/dataTables/PassSubscriberDataTable.vue";
import PassDropinDataTable from "@/general/components/dataTables/PassDropinDataTable.vue";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { computed, onMounted, ref } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter, useRoute } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import useId from "@/hooks/useId";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import ProductItem from "@/facilities/components/ProductItem.vue";

const modal = ref<typeof IonModal | null>(null);

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();
const { id } = useId();
const route = useRoute();
const products = ref<any>();
const type = route.params.type === 'pass' ? 'PASS' : 'DROPIN';
const selectedId = ref<number>();

const {
  result: facilityItemPassResult,
  loading: loadingFacilityItems,
  refetch,
  onResult: gotFacility,
} = useQuery<any>(FacilityItemsByFacilityIdAndTypeDocument, {
  facility_id: currentFacility.facility.id,
  item_type: type,
});

const {
  showConfirmationModal,
  hideModal,
  showModal: showModal,
} = useConfirmationModal();

const { mutate } = useMutation(DeleteFacilityItemDocument);

onMounted(() => {
  console.log(currentFacility.facility.id);
  console.log(route.params.type);
  console.log(type);
});

const handleCreate = () => {
  if(type === 'PASS'){
    router.push({ name: EntitiesEnum.CreateItem, params: { type: route.params.type } });
  } else {
    router.push({ name: EntitiesEnum.CreateItem, params: { type: route.params.type } });
  }
}

gotFacility(({ data }) => {
  products.value = data.facilityItemsByFacilityIdAndType.data;
  console.log(products.value);
});

const isSettingModalOpen = ref<boolean>(false);
const showSettingsModal = (id: number) => {
  console.log({id});
  isSettingModalOpen.value = true;
  selectedId.value = id;
};

const handleEdit = () => {
  console.log("edit");
}
const handleDelete = () => {
  isSettingModalOpen.value = false;
  showModal();
}
const onDelete = () => {
  hideModal();
  console.log(selectedId.value);
  mutate({
    id: selectedId.value,
  })
    .then(() => {
      refetch();
    })
    .catch((err) => {
      console.log(err);
    });
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
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
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

.filter-tabs {
  width: 100%;
  
  ion-button {
    --border-radius: 100px;
    font: 500 14px/1 Lato;
  }
  
  .selected {
    color: var(--main-color);
  }
  .normal {
    color: var(--grey-text);
  }
}
.d-flex-col {
  display: flex;
  flex-direction: column;
}
.gap-25 {
  gap: 25px;
}

.empty-pass {
  width: 100%;
  height: 100%;

  ion-button {
    width: 100%;
    font: 500 16px/1 Yantramanav;
  }
  .empty-box {

    ion-icon {
      width: 36px;
      height: 36px;
      margin-bottom: 24px;
    }
    
    .status {
      color: var(--ion-gray-500);
      font: 500 24px/1 Yantramanav;
      margin-bottom: 8px;
    }
    .description {
      color: var(--ion-gray-500);
      font: 300 16px/1 Yantramanav;
    }
  }
}
.pass-table {
  border: 1px solid var(--fitnesswhite);
  background: var(--gray-700);
  width: 100%;
  padding: 0;

  .table-th {
    border-bottom: 1px solid var(--beige);
    padding: 10px 16px;
  }

  .table-td {
    //  border: 1px solid var(--beige);
    padding: 0 0 0 16px;

    ion-button {
      font-size: 14px;
      height: 32px;
      margin: 16px 0;
    }
  }
}
.table-header {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: var(--main-color);
  color: var(--gold);
}

.table-row {
  border-top: 1px solid var(--beige);
}

.capitalize {
  text-transform: capitalize;
}
ion-button#gym-pass {
  width: 100%;
  font: 500 16px/1 Yantramanav;
  margin-top: 28px;
}
.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;

  ion-icon {
    width: 18px;
    height: 18px;
  }
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
.settings-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --background: none;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(
      100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom)
    );
  }
}
.main-buttons {
  border-radius: 8px;
  background: #262626;

  ion-button#create {
    --color: #EFEFEF;
    --background: none;
    font: 500 16px/1 Lato;
  }
  ion-button#delete {
    --color: #EB4336;
    --background: none;
    font: 500 16px/1 Lato;
  }
}

ion-button#cancel {
  --color: #FFFFFF6a;
  --background: #262626;
  font: 500 16px/1 Lato;
  margin-top: 16px;
}
.split {
  height: 1px;
  background-color: #3D3D3D;
}
</style>
