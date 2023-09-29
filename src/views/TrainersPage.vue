<template>
  <ion-toolbar class="header" v-if="loading || trainers?.length">
    <ion-title slot="start" class="title">
      <template v-if="!selected && role !== RoleEnum.User">Trainers Nearby</template>
      <template
        v-else-if="selectedTrainer?.trainer_type === TrainerTypeEnum.Freelancer"
      >
        Selected
      </template>
      <template v-else-if="role !== RoleEnum.User">
        {{ selectedFacility?.name }}
        <address-item class="radiobutton__address">
          {{ selectedFacility?.address?.street }}
        </address-item>
      </template>
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
      <template v-else-if="!selected && trainers.length">
        <trainer-item
          :key="trainer.id"
          :trainer="trainer"
          v-for="trainer in trainers"
          end-button="Book"
        />
      </template>
      <template v-else-if="selected">
        <trainer-item
          v-if="selectedTrainer.trainer_type === TrainerTypeEnum.Freelancer"
          :trainer="selectedTrainer"
        />
        <template v-else>
          <ion-spinner name="lines" v-if="trainersLoading" class="spinner" />
          <trainer-item
            :key="trainer.id"
            :trainer="trainer"
            v-for="trainer in facilityTrainers"
          />
        </template>
      </template>
      <empty-block
        v-else
        hide-button
        title="Sorry, no trainers found"
        icon="assets/icon/weights.svg"
        text="Currently there are no trainers in your area"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { watch, defineEmits, defineProps, computed } from "vue";
import { IonToolbar, IonButton, IonTitle, IonSpinner } from "@ionic/vue";
import TrainerItem from "@/general/components/TrainerItem.vue";
import {
  UsersQuery,
  UsersDocument,
  RoleEnum,
  TrainerTypeEnum,
Trainer,
} from "@/generated/graphql";
import { useMapPage } from "@/hooks/useMapPage";
import { MapFilters, MapMarkerItem } from "@/ts/types/map";
import EmptyBlock from "@/general/components/EmptyBlock.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import { useLazyQuery } from "@vue/apollo-composable";
import useRoles from "@/hooks/useRole";
import router from "@/router";
import { EntitiesEnum } from "@/const/entities";

const props = defineProps<{
  filters?: MapFilters;
  availabilityFilters?: any;
  selected?: string | null;
}>();

const emits = defineEmits<{
  (e: "location-items", items: MapMarkerItem[]): void;
  (e: "toggle-modal"): void;
  (e: "hide-modal"): void;
  (e: "deselect"): void;
}>();

type Trainers = NonNullable<UsersQuery["users"]>["data"];

const { role } = useRoles()

const near = computed(() =>
  props.filters
    ? {
        lat: props.filters.position.lat,
        lng: props.filters.position.lng,
        radius: props.filters.distance,
      }
    : undefined
);

const availability = computed(() =>
  props.availabilityFilters
    ? {
        date_from: props.availabilityFilters.date_from ?? undefined,
        date_to: props.availabilityFilters.date_to ?? undefined,
      }
    : undefined
);

const {
  formattedResult: trainers,
  markerItems,
  loading,
  error,
  refetch: refetchTrainers,
} = useMapPage<UsersQuery, Trainers[0]>(
  UsersDocument,
  (trainer) => ({
    id: trainer.id,
    trainer_type: trainer.trainer_type,
    lat:
      trainer.address?.lat ||
      (trainer.facilities ? trainer.facilities[0]?.address?.lat : 0),
    lng:
      trainer.address?.lng ||
      (trainer.facilities ? trainer.facilities[0]?.address?.lng : 0),
  }),
  (response) => response.value?.users?.data ?? [],
  {
    role: RoleEnum.Trainer,
    near: near.value,
    availability: availability.value,
  }
);

const selectedTrainer = computed(() =>
  trainers.value.find((trainers) => trainers.id === props.selected)
);

watch(
  () => props.filters,
  (newVal) => {
    if (!newVal) return;
    refetchTrainers({
      role: RoleEnum.Trainer,
      near: near.value,
      availability: availability.value,
    });
  }
);

watch(
  () => props.availabilityFilters,
  () => {
    refetchTrainers({
      role: RoleEnum.Trainer,
      near: near.value,
      availability: availability.value,
    });
  }
);

watch(
  () => props.selected,
  () => {
    if (selectedFacility.value) {
      if (!facilityTrainersResult.value) {
        getTrainersByFacility(UsersDocument, {
          page: 1,
          first: 100,
          role: RoleEnum.Trainer,
          facilities: selectedFacility.value
            ? [selectedFacility.value.id]
            : null,
        });
      } else {
        refetchTrainersByFacility({
          page: 1,
          first: 100,
          role: RoleEnum.Trainer,
          facilities: selectedFacility.value
            ? [selectedFacility.value.id]
            : null,
        });
      }
    }
  }
);

const selectedFacility = computed<any | undefined>(
  () =>
    (selectedTrainer.value?.facilities?.length &&
      selectedTrainer.value?.facilities[0]) ||
    undefined
);

const {
  load: getTrainersByFacility,
  refetch: refetchTrainersByFacility,
  loading: trainersLoading,
  result: facilityTrainersResult,
} = useLazyQuery(UsersDocument, {
  page: 1,
  first: 100,
  role: RoleEnum.Trainer,
  facilities: selectedFacility.value ? [selectedFacility.value.id] : null,
});

const facilityTrainers = computed(
  () => facilityTrainersResult.value?.users.data ?? []
);

watch(
  () => markerItems.value,
  () => emits("location-items", markerItems.value)
);

const toggleModal = () => {
  emits("toggle-modal");
};

const goToBooking = (trainer:Trainer) => {
  console.log("trainer", trainer);
  
  router.push({
    name: EntitiesEnum.BookTrainer,
    params: { id: trainer.id },
  })
}
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
    margin: -1px -8px 0 8px;
    --padding-top: 0;
    --padding-bottom: 0;
    --padding-start: 8px;
    --padding-end: 8px;
    align-self: flex-start;
    transition: opacity 0.35s ease;
  }
}

.title {
  padding: 0;
  display: block;
  color: var(--ion-color-white);
  font: 500 16px/1.5 var(--ion-font-family);

  .address {
    display: block;
    margin-top: 8px;
  }
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
