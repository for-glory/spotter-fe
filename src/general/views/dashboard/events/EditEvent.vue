<template>
	<event-form
		edit
		ref="eventForm"
		:data="eventData"
		@submit="updateEvent"
		submit-button-text="Update"
		:loading="eventOnUpdating || eventLoading"
	/>
  <discard-changes
    :is-open="isConfirmedModalOpen"
    @close="discardModalClosed"
  />
</template>

<script setup lang="ts">
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter, useRoute } from "vue-router";
import { ref, computed } from "vue";
import { toastController } from "@ionic/vue";
import {
  UpdateEventDocument,
  UpdateEventInput,
  EventDocument,
} from "@/generated/graphql";
import { useMutation, useQuery } from "@vue/apollo-composable";
import dayjs from "dayjs";

const router = useRouter();
const route = useRoute();
const onBack = () => {
  isConfirmedModalOpen.value = true;
};
const eventId = ref<string>(route.params.id as string);

const { result: eventResult, loading: eventLoading } = useQuery(
  EventDocument,
  {
    id: eventId.value,
  },
  {
    fetchPolicy: "no-cache",
  }
);

const eventData = computed(() => {
  console.log(eventResult.value, 'ssddsdsåß');
  if (!eventResult.value) return;
  return {
    title: eventResult.value?.event.title,
		price: eventResult.value?.event.price,
		max_participants: eventResult.value?.event.max_participants,
		description: eventResult.value?.event.description,
    start_date: eventResult.value?.event.start_date,
    start_time: dayjs(eventResult.value?.event.start_date).format("HH:mm"),
		end_time: dayjs(eventResult.value?.event.end_date).format("HH:mm"),
    end_date: eventResult.value?.event.end_date,
    address: eventResult.value?.event.address,
    photos: eventResult.value?.event.media.map((media: any) => {
      return {
        id: media.id,
        url: media.pathUrl,
      };
    }),
    equipments: eventResult.value?.event.equipments,
    amenities: eventResult.value?.event.amenities,
  };
});

const isConfirmedModalOpen = ref(false);

const discardModalClosed = (approved: boolean) => {
  isConfirmedModalOpen.value = false;
  if (approved) {
    eventForm.value?.clearStore();
    router.go(-1);
  }
};

const {
  mutate: updateEventMutate,
  loading: eventOnUpdating,
  onDone: eventUpdated,
} = useMutation(UpdateEventDocument);

const updateEvent = (input: UpdateEventInput) => {
  updateEventMutate({ id: eventId.value, input });
};

const eventForm = ref<typeof EventForm | null>(null);

eventUpdated(() => {
  showSuccessToast();
  eventForm.value?.clearStore();
  router.go(-1);
});

const showSuccessToast = async () => {
  const toast = await toastController.create({
    message: "Succesfully updated the event",
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
