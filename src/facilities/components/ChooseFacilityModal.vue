<template>
  <ion-modal ref="modal">
    <search-form
      back-btn
      hidden-cancel
      visible-result
      @back="cancel"
      ref="searchForm"
      customNavigation
      :filters="searchFilters"
      @handle-item-click="onItemClick"
      :type="FacilitiesTrainersTabs.Facilities"
      placeholder="Enter name or address of gym..."
      no-found-msg="No results found. Check selected state/city."
    />
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal } from "@ionic/vue";
import { defineExpose, defineEmits, ref } from "vue";
import {
  SelectFacilityModalOptions,
  SelectFacilityModalResult,
} from "@/interfaces/SelectFacilityModal";
import { FacilitiesTrainersTabs } from "@/ts/enums/user";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import { Facility } from "@/generated/graphql";

const modal = ref<typeof IonModal | null>(null);
const searchForm = ref<typeof SearchForm | null>(null);
const selected = ref<Facility | null | undefined>(null);
const searchFilters = ref<any | null>(null);

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "select", selected?: SelectFacilityModalResult): void;
}>();

const cancel = () => {
  emits("cancel");
  resetAndClose();
};

const present = (props: SelectFacilityModalOptions) => {
  searchFilters.value = props.filters;
  modal?.value?.$el.present();
  selected.value = props.selected;
  searchForm.value?.$el.search();
};

const resetAndClose = () => {
  modal?.value?.$el.dismiss();
};

defineExpose({
  present,
});

const onItemClick = (facility: Facility) => {
  emits("select", { facility });
  resetAndClose();
};
</script>

<style scoped lang="scss">
.content {
  height: calc(100% - 48px - 65px - var(--ion-safe-area-top));
  --padding-bottom: calc(80px + var(--ion-safe-area-bottom));
}

.spinner {
  display: block;
  margin: 30vh auto;
}
</style>
