<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn @back="onBack" title="Create event" />
    </template>
    <template #content>
      <div class="content">
        <event-form
          ref="eventForm"
          @submit="createEvent"
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
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { toastController } from "@ionic/vue";
import { CreateEventDocument, CreateEventInput } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";

const router = useRouter();
const onBack = () => {
  isConfirmedModalOpen.value = true;
};

const isConfirmedModalOpen = ref(false);

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    eventForm.value?.clearStore();
    router.go(-1);
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

const eventForm = ref<typeof EventForm | null>(null);

eventCreated(() => {
  showSuccessToast();
  eventForm.value?.clearStore();
  router.go(-1);
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
</script>

<style scoped lang="scss">
.content {
  padding: 24px 24px calc(20px + var(--ion-safe-area-bottom));
}
</style>
