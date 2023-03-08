<template>
  <ion-toolbar class="header" v-if="loading || facilities?.length">
    <ion-title slot="start" class="title">
      <template v-if="!selected">Gyms Nearby</template>
      <template v-else>Selected</template>
    </ion-title>
    <ion-button
      slot="end"
      fill="clear"
      color="primary"
      v-if="!selected"
      @click="toggleModal"
      class="header__btn hide-on-fullscreen"
    >
      View All
    </ion-button>
    <ion-button
      v-else
      slot="end"
      fill="clear"
      color="primary"
      class="header__btn"
      @click="emits('deselect')"
    >
      Show all
    </ion-button>
  </ion-toolbar>
  <div class="content ion-padding-horizontal ion-padding-bottom">
    <ion-spinner name="lines" v-if="loading" class="spinner" />
    <template v-else>
      <p v-if="error" class="ion-text-center">Something went wrong...</p>
      <template v-else-if="filteredFacilities.length">
        <facility-item
          :key="facility.id"
          :facility="facility"
          v-for="facility in filteredFacilities"
          @click="onClick($event, facility.id)"
        />
      </template>
      <empty-block
        v-else
        hide-button
        title="Sorry, no gyms found"
        icon="assets/icon/weights.svg"
        text="Currently there are no gyms in your area"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, watch, defineProps, computed } from "vue";
import { IonToolbar, IonButton, IonTitle, IonSpinner } from "@ionic/vue";
import FacilityItem from "@/general/components/FacilityItem.vue";
import { FacilitiesQuery, FacilitiesDocument } from "@/generated/graphql";
import { useMapPage } from "@/hooks/useMapPage";
import { MapFilters, MapMarkerItem } from "@/ts/types/map";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const props = defineProps<{
  filters?: MapFilters;
  selected?: string | null;
}>();

const emits = defineEmits<{
  (e: "location-items", items: MapMarkerItem[]): void;
  (e: "toggle-modal"): void;
  (e: "hide-modal"): void;
  (e: "deselect"): void;
}>();

type Facilities = NonNullable<FacilitiesQuery["facilities"]>["data"];

const router = useRouter();

const {
  formattedResult: facilities,
  markerItems,
  loading,
  error,
  refetch: refetchFacilities,
} = useMapPage<FacilitiesQuery, Facilities[0]>(
  FacilitiesDocument,
  (facility) => ({
    id: facility.id,
    lat: facility.address?.lat,
    lng: facility.address?.lng,
  }),
  (response) => response.value?.facilities?.data ?? [],
  props.filters
    ? {
        near: {
          lat: props.filters.position.lat,
          lng: props.filters.position.lng,
          radius: props.filters.distance,
        },
      }
    : undefined
);

const filteredFacilities = computed(() =>
  !props.selected
    ? facilities.value
    : facilities.value.filter((facility) => facility.id === props.selected)
);

watch(
  () => props.filters,
  (newVal) => {
    if (!newVal) return;
    refetchFacilities({
      near: {
        lat: newVal.position.lat,
        lng: newVal.position.lng,
        radius: newVal.distance,
      },
    });
  }
);

const toggleModal = () => {
  emits("toggle-modal");
};

const onClick = (e: CustomEvent, facilityId: string) => {
  emits("hide-modal");
  router.push({
    name: EntitiesEnum.Facility,
    params: {
      id: facilityId,
    },
  });
};

watch(
  () => markerItems.value,
  () => emits("location-items", markerItems.value)
);
</script>

<style lang="scss" scoped>
.header {
  --min-height: 28px;
  --padding-top: 4px;
  --padding-bottom: 0;
  margin-bottom: 16px;
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &__btn {
    height: 24px;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    margin: 0 -8px 0 8px;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 8px;
    --padding-end: 8px;
    transition: opacity 0.35s ease;
  }
}

.title {
  padding: 0;
  display: block;
  color: var(--ion-color-white);
  font: 500 16px/1 var(--ion-font-family);
}

.content {
  padding-bottom: 74px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(50% - 60px) auto 0;
}

.empty-block {
  margin-top: calc(4vh + 8px);
}
</style>
