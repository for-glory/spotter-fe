<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Post Dailys" />
    </template>
    <template #content>
      <div class="content">
        <workout-form 
          ref="workoutForm"
          exit-button-text="Post Dailys"
          @open-picker="openPicker"
          @submit="createDailys"
        />
      </div>
    </template>
  </base-layout>
  <discard-changes :is-open="isConfirmationOpen" @close="discardModalClosed" />
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
import {
  toastController,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { EntitiesEnum } from "@/const/entities";
import { 
  FilePreloadDocument,
  CreateDailyDocument,
  RoleEnum
} from "@/generated/graphql";
import { useDailysStore } from "@/general/stores/useDailysStore";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { Emitter, EventType } from "mitt";
import WorkoutForm from "@/general/components/forms/WorkoutForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const store = useDailysStore();
const currentFacility = useFacilityStore();

const { role } = useRoles();
const isFacilityOwner = role === (RoleEnum.FacilityOwner || RoleEnum.OrganizationOwner);

const isConfirmationOpen = ref<boolean>(false);
const workoutForm = ref<typeof WorkoutForm | null>(null);
const percentLoaded = ref(0);

const {
  mutate: createDaily,
  loading: dailysOnCreation,
  onDone: dailysCreated,
} = useMutation(CreateDailyDocument);

const params = computed(() => ({
  preview: store.workoutPath,
  video: store.path,
  body_parts: store.workoutMuscleTypesIds,
  type_id: store.workoutType?.id,
  title: store.workoutTitle,
  description: store.description,
  duration: Number(store.workoutDuration),
  price: getSumForPayment(store.workoutPrice as number),
}));

const createDailys = () => {
  let dailyParam;
  if(isFacilityOwner) {
    dailyParam = { ...params.value, facility_id: currentFacility.facility?.id };
  } else {
    dailyParam = { ...params.value };
  }
  createDaily(dailyParam)
    .then(async () => {
      const toast = await toastController.create({
        message: "Created successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      router.push({ name: EntitiesEnum.WorkoutList });
    })
    .catch(async (error) => {
      const toast = await toastController.create({
        message: "Something went wrong. Please try again.",
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();

      throw new Error(error);
    });
};

const discardModalClosed = (approved: boolean) => {
  isConfirmationOpen.value = false;
  if (approved) {
    store.clearState();
    router.go(-1);
  }
};

const onBack = () => {
  if (store.workoutTitle ||
    store.workoutPrice ||
    store.workoutMuscleTypesIds?.length ||
    store.workoutType
  ) {
    isConfirmationOpen.value = true;
  } else {
    store.clearState();
    router.go(-1);
  }
};
</script>

<style lang="scss" scoped>

.action-wrap {
  margin-top: 20px;
}
.logo {
  width: 220px;
  min-width: 60px;
}

.title {
  padding: 0;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
  margin-top: 20px;
  text-align: center;
}
.top-buttons {
  display: flex;
  justify-content: space-between;
}
.dashboard-btn {
  margin-top: 10px;
}
.content {
  padding: 0 40px 26px;
}
.sub-title {
  margin: 0;
  padding: 0 0 16px;
}

.holder-button {
  ion-button {
    width: 100%;
  }
}
</style>
