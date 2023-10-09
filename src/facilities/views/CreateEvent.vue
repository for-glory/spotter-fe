<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Create Events" />
    </template>
    <template  #content>
      <div class="content">
        <event-form
          ref="eventForm"
          @submit="createEvent"
          @onSkip="goToWorkout"
			    skipText="Skip"
          saveButtonText="Create Event"
          submitButtonText="Create Event"
          :loading="eventOnCreation"
        />
      </div>
    </template>
  </base-layout>
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
  />
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonTitle,
} from "@ionic/vue";
import BaseAuthLayout from "@/general/components/base/BaseAuthLayout.vue";
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { toastController } from "@ionic/vue";
import { CreateEventDocument, CreateEventInput } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const router = useRouter();
const route = useRoute();
const goToDashboard = () => {
  // isConfirmedModalOpen.value = true;
  eventForm.value?.clearStore();
  router.push({ name: EntitiesEnum.DashboardOverview });
};

const isConfirmedModalOpen = ref(false);

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    eventForm.value?.clearStore();
    // router.push({ name: EntitiesEnum.Dashboard });
  }
};
const currentFacility = useFacilityStore();

const {
  mutate: createEventMutate,
  loading: eventOnCreation,
  onDone: eventCreated,
} = useMutation(CreateEventDocument);

const createEvent = (input: CreateEventInput) => {
  console.log({input});
  createEventMutate({ input: { ...input, facility_id: currentFacility.facility?.id } });
};

const goToWorkout = () => {
  eventForm.value?.clearStore();
  router.push({ name: EntitiesEnum.CreateWorkout });
};

const eventForm = ref<typeof EventForm | null>(null);

eventCreated(() => {
  showSuccessToast();
  eventForm.value?.clearStore();
  // router.go(-1);
  router.push({
    name: EntitiesEnum.FacilitiesEvents,
  });
});

const showSuccessToast = async () => {
  const toast = await toastController.create({
    message: "Succesfully created the event",
    duration: 2000,
    icon: "assets/icon/success.svg",
    cssClass: "success-toast",
  });
  return toast.present();
};
const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
const onBack = () => {
  isConfirmedModalOpen.value = true
  router.go(-1);
};
</script>

<style scoped lang="scss">
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
.content {
  padding: 24px 16px calc(20px + var(--ion-safe-area-bottom));
}

.top-buttons {
  display: flex;
  justify-content: end;
}
.dashboard-btn {
  margin-top: 10px;
}
</style>
