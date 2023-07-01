<template>
  <ion-modal ref="modal">
    <page-header @back="cancel" back-btn :title="title">
      <template #custom-btn>
        <ion-button @click="select" class="header-btn">
          <ion-icon src="assets/icon/accept.svg" />
        </ion-button>
      </template>
    </page-header>
    <ion-content class="ion-padding-horizontal content">
      <ion-spinner
        name="lines"
        class="spinner"
        v-if="equipmentLoading || amenitiesLoading"
      />
      <template v-else>
        <ion-text class="title"> Equipment </ion-text>
        <checkbox-group
          @change="onEquipmentsChange"
          :options="equipments || []"
          :selected="equipmentsValue"
        />
        <ion-text class="title"> Amenities </ion-text>
        <checkbox-group
          @change="onAmenitiesChange"
          :options="amenities || []"
          :selected="amenitiesValue"
        />
      </template>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { computed, ref, defineExpose, defineEmits } from "vue";
import { IonText, IonSpinner, IonModal, IonContent } from "@ionic/vue";
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

const modal = ref<typeof IonModal | null>(null);

const emits = defineEmits<{
  (e: "cancel", result: EquipmentAndAmenitiesModalResult): void;
}>();

const title = ref<string>("Amenities");

const amenitiesValue = ref<string[]>([]);
const equipmentsValue = ref<string[]>([]);

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
.content {
  height: calc(100% - 48px - var(--ion-safe-area-top));
  --padding-top: 24px;
  --padding-bottom: calc(24px + var(--ion-safe-area-bottom));
}

.title {
  display: block;
  font-size: 16px;
  font-weight: 500;
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

.header-btn {
  margin: 0;
  height: 32px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  backdrop-filter: blur(4px);
  border-radius: 50%;
  --border-radius: 50% !important;
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
  --background: rgba(var(--ion-color-black-rgb), 0.12);

  ion-icon {
    font-size: 1em;
  }
}
</style>
