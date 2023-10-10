<template>
	<div class="content h-100 d-flex-col">
    <div class="d-flex align-items-center page-header">
      <ion-button class="common-back-btn" fill="clear" @click="$router.back()">
        <ion-icon src="assets/icon/arrow-back.svg" />
      </ion-button>
      <ion-title class="banner__title">Create event</ion-title>
    </div>
		<event-form
			ref="eventForm"
			has-skip-button
			@submit="createEvent"
			@onSkip="handleCancel"
			:loading="eventOnCreation"
      :save-btn="false"
      primaryBtnText="Save"
      skip-button
      skip-button-color="medium"
      skip-button-text="Cancel"
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
import EventForm from "@/general/components/forms/EventForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useRouter,useRoute } from "vue-router";
import { ref } from "vue";
import { toastController } from "@ionic/vue";
import { CreateEventDocument, CreateEventInput, RoleEnum } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const route = useRoute();
const currentFacility = useFacilityStore();
const { role } = useRoles()
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
  if (role === RoleEnum.FacilityOwner)
    createEventMutate({ input: { ...input, facility_id: currentFacility.facility.id } });
  else if(role === RoleEnum.Trainer)
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
.page-header {
    padding-top: 21px;
    margin-bottom: 26px;
    ion-title {
        font-size: 24px;
        padding-left: 7px;
        color: var(--gold);
        line-height: 31.2px;
    }
    ion-icon {
        color: var(--gray-500);
        font-size: 20px;
    }
}
</style>
