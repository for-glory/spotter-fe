<template>
  <base-layout hideNavigationMenu>
    <template #header>
      <page-header back-btn @back="onBack" title="Create Events" />
    </template>
    <template #content>
      <div class="content">
        <event-form
          ref="eventForm"
          save-button-text="Save and Exit"
          next-button-text="Next"
          next-button
          @submit="createEvent"
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
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { toastController } from "@ionic/vue";
import { CreateEventDocument, CreateEventInput } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";

const router = useRouter();
const route = useRoute();
const exitType = ref<string>('next');
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

const {
  mutate: createEventMutate,
  loading: eventOnCreation,
  onDone: eventCreated,
} = useMutation(CreateEventDocument);

const createEvent = (input: CreateEventInput, type: string) => {
  console.log({ input });
  exitType.value = type;
  createEventMutate({ input: { ...input, facility_id: route.params.facility_id } });
};

const eventForm = ref<typeof EventForm | null>(null);

eventCreated(() => {
  showSuccessToast();
  eventForm.value?.clearStore();
  if(exitType.value === 'next') {
    router.push({ name: EntitiesEnum.CreateDailys, params: { step: 'upload' } });
  } else {
    router.push({
      name: EntitiesEnum.CreateFacilitySuccess,
    });
  }
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
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
}

.top-buttons {
  display: flex;
  justify-content: end;
}
.dashboard-btn {
  margin-top: 10px;
}
</style>
