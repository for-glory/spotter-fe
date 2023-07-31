<template>
  <base-auth-layout hide-header>
    <template  #left-section>
      <div class="content">
        <div class="d-flex justify-content-between align-items-center">
          <router-link
            to="/"
          >
            <ion-img
              src="assets/icon/logo-complete.png"
              class="logo"
              alt="logo"
            />
          </router-link>
          <ion-button
            class="login-btn"
            type="button"
            fill="clear"
            @click="onLogout"
          >
            Log out
          </ion-button>
        </div>
        <div class="top-buttons">
          <ion-button class="dashboard-btn" @click="goToDashboard" fill="clear">
            Go to Dashboard
            <ion-icon src="assets/icon/arrow-next.svg" />
          </ion-button>
        </div>
        <ion-title class="title" color="primary">
          Create your first event
        </ion-title>
        <event-form
          ref="eventForm"
          has-skip-button
          @submit="createEvent"
          @onSkip="goToWorkout"
          :loading="eventOnCreation"
        />
      </div>
    </template>
  </base-auth-layout>
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
  router.push({ name: EntitiesEnum.Dashboard });
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
      name: EntitiesEnum.CreateWorkout,
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
