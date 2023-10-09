<template>
  <ion-modal ref="modal" class="equipment-amenities-modal">
    <IonHeader  class="ion-no-border">
      <IonToolbar class="header ion-no-border">
        <IonButtons slot="start">
          <IonButton @click="select">
            <IonIcon src="assets/icon/arrow-back.svg" />
          </IonButton>
        </IonButtons>
        <ion-title class="ion-text-center">
          Amenities
        </ion-title>
      </IonToolbar>
    </IonHeader>
    <ion-content :class="['ion-padding-horizontal', 'content', { 'web-modal': !isNative }]">
      <ion-spinner
        name="lines"
        class="spinner"
        v-if="equipmentLoading || amenitiesLoading"
      />
      <template v-else>
        <div class="checkbox-container">
          <div class="checkbox-col">
            <ion-text class="title"> Equipment </ion-text>
            <div class="group-box">
              <checkbox-group
                @change="onEquipmentsChange"
                :options="equipments || []"
                :selected="equipmentsValue"
                font-ytmn
              />
            </div>
          </div>
          <div class="checkbox-col">
            <ion-text class="title"> Amenities </ion-text>
            <div class="group-box">
              <checkbox-group
                @change="onAmenitiesChange"
                :options="amenities || []"
                :selected="amenitiesValue"
                font-ytmn
              />
            </div>
          </div>
        </div>
        <div v-if="!isNative" class="btn-container">
          <ion-button expand="block" class="secondary cursor-pointer" @click="select" fill="outline">Save</ion-button>
        </div>
      </template>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed, ref, defineExpose, defineEmits } from "vue";
import { IonText, IonSpinner, IonModal, IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from "@ionic/vue";
import {
  AmenitiesDocument,
  AmenitiesQuery,
  EquipmentsDocument,
  FacilitiesQuery,
} from "@/generated/graphql";
import CheckboxGroup from "../components/blocks/CheckboxGroup.vue";
import { useQuery } from "@vue/apollo-composable";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import {
  EquipmentAndAmenitiesModalOptions,
  EquipmentAndAmenitiesModalResult,
} from "@/interfaces/EquipmentAndAmenitiesModal";
import { Capacitor } from "@capacitor/core";

const modal = ref<typeof IonModal | null>(null);

const emits = defineEmits<{
  (e: "cancel", result: EquipmentAndAmenitiesModalResult): void;
}>();

const title = ref<string>("Amenities");

const amenitiesValue = ref<string[]>([]);
const equipmentsValue = ref<string[]>([]);
const isNative = Capacitor.isNativePlatform();

const params = {
  first: 1000,
  page: 1,
};

const present = (props: EquipmentAndAmenitiesModalOptions) => {
  title.value = props.title || "";
  amenitiesValue.value = props.amenities || [];
  equipmentsValue.value = props.equipments || [];
  modal?.value?.$el.present();
};

const { result: amenitiesResult, loading: amenitiesLoading } =
  useQuery<AmenitiesQuery>(AmenitiesDocument, params);

const amenities = computed((): CheckboxValueType[] | undefined =>
  amenitiesResult.value?.amenities?.data.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: false,
      iconUrl: option.iconUrl || undefined,
    };
  })
);

const { result: equipmentsResult, loading: equipmentLoading } =
  useQuery<FacilitiesQuery>(EquipmentsDocument, params);

const equipments = computed((): CheckboxValueType[] | undefined =>
  equipmentsResult.value?.equipments?.data.map((option) => {
    return {
      id: option.id,
      label: option.name || "",
      value: option.id || "",
      isChecked: false,
      iconUrl: option.iconUrl || undefined,
    };
  })
);

const onEquipmentsChange = (data: string[]): void => {
  equipmentsValue.value = data;
};

const onAmenitiesChange = (data: string[]): void => {
  amenitiesValue.value = data;
};

const cancel = () => {
  resetAndClose();
};

const select = () => {
  emits("cancel", {
    equipments:
      equipments.value?.filter(
        (equipment) =>
          equipmentsValue.value.findIndex((i) => i === equipment.id) > -1
      ) || [],
    amenities:
      amenities.value?.filter(
        (amenity) =>
          amenitiesValue.value.findIndex((i) => i === amenity.id) > -1
      ) || [],
  });
  resetAndClose();
};

const resetAndClose = () => {
  modal?.value?.$el.dismiss();
};

defineExpose({
  present,
});
</script>

<style lang="scss" scoped>
.header {
  ion-title {
    text-align: center;
    width: 90%;
    color: var(--color-white);
  }
}
.content {
}

.title {
  color: var(--color-white);
  font-family: Yantramanav;
  font-weight: 700;
  display: block;
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 16px;

  &:not(:first-child) {
    margin-top: 12px;
  }
}

.spinner {
  display: block;
  margin: 30vh auto;
}

.equipment-amenities-modal {
  --width: 54.5vw;
  --height: 42vh;
}

.checkbox-container {
  display: flex;
  height: calc(100% - 90px);
  padding: 0 14px;
  .checkbox-col {
    padding-top: 34px;
    width: 50%;
    .group-box {
      height: calc(100% - 20px);
      overflow-y: auto;
  
      &::part(scroll) {
        margin-right: -15px;
        padding-right: 15px;
      }
  
      &::part(scroll)::-webkit-scrollbar {
        display: none;
      }
  
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
.btn-container {
  margin-top: 32px;
  ion-button {
    width: 60%;
    margin: 0 auto;
    --background: #E1DBC5;
    color: #262626;
    font-weight: 500;
  }
}

@media (max-width: 767px) {
  .equipment-amenities-modal{
    --width: 100vw;
    --height: 100vh;
  }

  .checkbox-container{
    flex-direction: column;
  }
  
  .checkbox-col{
    height: 50%;
    width: 100% !important;
  }
}

.web-modal {
  --padding-bottom: 30px;
  --padding-start: 30px;
}
</style>
