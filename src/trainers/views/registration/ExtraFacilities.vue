<template>
  <base-layout :header-fixed="false">
    <template #header>
      <ion-header class="ion-no-border">
        <page-header @back="onBack" back-btn />
      </ion-header>
    </template>
    <template #content>
      <ion-title class="main-title">Let’s add more information</ion-title>
      <ion-text class="subtitle">
        To give you a better experience we need to know more about you
      </ion-text>
      <div class="extra-facility">
        <div>
          <base-toggle
            :value="hasFacility"
            @change="onHasFacilityChecked"
            label="Choose the gym if you work in it"
            content="I'm working in the gym"
            class="toggle-section"
          />
          <choose-block
            title="Choose gym location"
            :value="facility?.name || ''"
            @handle-click="onChooseGym"
            class="choose-gym"
          />
          <transition>
            <ion-note v-if="errorMessage">
              {{ errorMessage }}
            </ion-note>
          </transition>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="actions-wrapper">
        <ion-button
          @click="onPreview"
          expand="block"
          fill="outline"
          class="outline-btn"
          >Preview</ion-button
        >
        <ion-button @click="onConfirm" expand="block" class="confirm-btn"
          >Let's start!</ion-button
        >
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useMutation } from "@vue/apollo-composable";
import { IonHeader, IonText, IonTitle, IonButton, IonNote } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import {
  Facility,
  SettingsCodeEnum,
  UpdateUserDocument,
} from "@/generated/graphql";
import { openHours } from "@/helpers/getDefaultOpenHours";

const router = useRouter();
const store = useStore();

const hasFacility = ref<boolean>(true);
const errorMessage = ref<string>("");

watch(
  () => hasFacility.value,
  (newVal: boolean) => {
    if (!newVal) store.dispatch("facility/setFacilityData", null);
  }
);

const { id } = JSON.parse(localStorage.getItem("user") || "{}");

const extraPersonal = computed(() => store.getters["register/extraPersonal"]);
const facility = computed<Facility>(() => store.getters["facility/facility"]);

const { mutate } = useMutation(UpdateUserDocument);

const onHasFacilityChecked = (checked: boolean) => {
  hasFacility.value = checked;
};

const onChooseGym = () => {
  router.push({ name: EntitiesEnum.ChooseGym });
};

const onPreview = () => {
  router.push({ name: EntitiesEnum.ProfilePreview });
};

const onConfirm = () => {
  if (hasFacility.value && !facility.value) {
    return (errorMessage.value = "Please choose gym location");
  } else {
    mutate({
      id,
      first_name: extraPersonal.value.firstName,
      last_name: extraPersonal.value.lastName,
      facility_id: facility.value?.id,
      opening_hours: JSON.stringify(openHours()),
      settings: [
        {
          code: SettingsCodeEnum.HourlyRate,
          value: Number(extraPersonal.value.hourlyRate),
        },
        {
          code: SettingsCodeEnum.DisplayGyms,
          value: hasFacility.value,
        },
      ],
    })
      .then(() => router.push({ name: EntitiesEnum.TrainerSchedule }))
      .catch((error) => {
        throw new Error(error);
      });
  }
};

const onBack = () => {
  router.push({ name: EntitiesEnum.TrainersExtraPersonal });
};
</script>

<style scoped lang="scss">
.toggle-section {
  margin-bottom: 14px;
}

.main-title {
  margin-top: 48px;
}
.subtitle {
  margin: 0 43px 30px;
}

.extra-facility {
  padding: 0 24px;
}
.actions-wrapper {
  display: flex;
  padding: 0 24px;
  justify-content: space-between;
  margin-bottom: 32px;
}

.outline-btn {
  --border-width: 0.8px;
  width: 131px;
}

.confirm-btn {
  width: 188px;
}

ion-note {
  margin-bottom: 2px;
  font-size: 12px;
  padding: 0 16px;
  --color: var(--ion-color-danger);
}
</style>
