<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Edit Dailys" />
    </template>
    <template #content>
      <div class="content">
        <workout-form 
          ref="workoutForm"
          exit-button-text="Finish"
          @submit="updateDailys"
        />
      </div>
    </template>
  </base-layout>
  <discard-changes :is-open="isConfirmationOpen" @close="discardModalClosed" />
</template>

<script setup lang="ts">
import { computed, watch, onMounted, ref, inject } from "vue";
import {
	IonTitle,
  IonButton,
  IonLabel,
  PickerColumnOption,
  PickerOptions,
	IonGrid,
	IonRow,
	IonCol,
  toastController,
} from "@ionic/vue";
import { useRouter, useRoute } from "vue-router";
import { minutesDuration } from "@/const/minutes-durations";
import { useField } from "vee-validate";
import { EntitiesEnum } from "@/const/entities";
import { useWorkoutsStore } from "@/trainers/store/workouts";
import { requiredFieldSchema } from "@/validations/authValidations";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { v4 as uuidv4 } from "uuid";
import { UpdateGymWorkoutDocument } from "@/generated/graphql";
import { useMutation } from "@vue/apollo-composable";
import { dataURItoFile } from "@/utils/fileUtils";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { Emitter, EventType } from "mitt";
import WorkoutForm from "@/general/components/forms/WorkoutForm.vue";
import ExerciseForm from "@/general/components/forms/ExerciseForm.vue";
import DiscardChanges from "@/general/components/modals/confirmations/DiscardChanges.vue";
import { useDailysStore } from "@/general/stores/useDailysStore";

const percentLoaded = ref(0);

const router = useRouter();
const route = useRoute();

const store = useDailysStore();
const isConfirmationOpen = ref<boolean>(false);

const workoutForm = ref<typeof WorkoutForm | null>(null);

const { mutate: updateWorkout, loading: updatingWorkout } = useMutation(
  UpdateGymWorkoutDocument
);

const updateDailys = () => {
  console.log("update dailys");
  updateWorkout({
    id: route.params.id,
    input: {
      title: store.workoutTitle,
      description: store.description,
      price: store.workoutPrice,
      level: store.workoutType,
      media: store.media,
      body_parts: store.workoutMuscleTypesIds,
    }
  })
    .then(async () => {
      const toast = await toastController.create({
        message: "Updated successfully",
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

const resetWorkout = () => {
  store.clearState();
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
