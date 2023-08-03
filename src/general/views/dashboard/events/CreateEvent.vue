<template>
	<div class="content">
		<event-form
			ref="eventForm"
			has-skip-button
			@submit="createEvent"
			@onSkip="handleCancel"
			skipText="Cancel"
			:loading="eventOnCreation"
		/>
	</div>
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
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { toastController } from "@ionic/vue";
import { CreateEventDocument, CreateEventInput } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";

const router = useRouter();
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

const createEvent = (input: CreateEventInput) => {
  createEventMutate({ input });
};

const handleCancel = () => {
  eventForm.value?.clearStore();
  router.push({ name: EntitiesEnum.DashboardEvent });
};

const eventForm = ref<typeof EventForm | null>(null);

eventCreated(() => {
  showSuccessToast();
  eventForm.value?.clearStore();
  // router.go(-1);
  router.push({
      name: EntitiesEnum.DashboardEvent,
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