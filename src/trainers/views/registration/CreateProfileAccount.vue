<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="page">
        <div class="page__head">
          <ion-title class="page__title" color="primary"
            >Business Setup</ion-title
          >
          <ion-text color="secondary">
            Please give us more details regarding your business setup
          </ion-text>
        </div>
        <div class="form-row">
          <ion-label class="label">
            What is the name of the gym/facility you conduct business out of?
          </ion-label>
          <choose-block
            title="Choose gym"
            :value="chosenGym?.name"
            @handle-click="openChooseGym"
          />
        </div>
        <div class="form-row">
          <ion-label class="label">
            Set your hourly rate for trainings in the gym (USD $)
          </ion-label>
          <base-input
            type="number"
            v-model:value="hourlyRate"
            @change="hourlyRateChange"
            placeholder="Enter your rate per hour"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <div class="buttons">
        <ion-button
          expand="block"
          @click="saveAddress"
          :disabled="!chosenGym || !hourlyRate?.length || loading"
        >
          Next
        </ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonButton, IonText, IonTitle, IonLabel } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { computed } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { useMutation } from "@vue/apollo-composable";
import {
  TrainerTypeEnum,
  SettingsCodeEnum,
  UpdateTrainerTypeDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { setSettings } from "@/hooks/useSettings";
import { ProfileSettings } from "@/ts/enums/user";
import { openHours } from "@/helpers/getDefaultOpenHours";

const router = useRouter();
const store = useSelectedAddressStore();

const onBack = () => {
  store.clearState();
  router.go(-1);
};

const chosenGym = computed(() => store.assignedFacility);
const openChooseGym = () => {
  router.push({
    name: EntitiesEnum.ChooseGymAccount,
  });
};

const hourlyRate = computed(() =>
  store.hourlyRate ? String(store.hourlyRate / 100) : ""
);
const hourlyRateChange = (value: string) => {
  store.setHourlyRate(Number(value) * 100);
};

const {
  loading,
  mutate: updateTrainerType,
  onDone: afterTrainerTypeUpdated,
} = useMutation(UpdateTrainerTypeDocument);

const saveAddress = () => {
  if (!chosenGym.value) return;
  const { id } = useId();
  updateTrainerType({
    id,
    trainer_type: TrainerTypeEnum.WorkingInGym,
    facility_id: chosenGym.value.id,
    opening_hours: JSON.stringify(openHours()),
    settings: [
      {
        code: SettingsCodeEnum.HourlyRate,
        value: Number(hourlyRate.value) * 100,
      },
    ],
  });
};

const { mutate: updateUserSettings, onDone: settingsUpdated } = useMutation(
  UpdateUserSettingsDocument
);

afterTrainerTypeUpdated(() => {
  setSettings([{ isAddressSelected: true }]);

  const { id } = useId();
  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
});

settingsUpdated(() => {
  store.clearState();
  router.push({ name: EntitiesEnum.TrainersExtraPersonal });
});
</script>

<style scoped lang="scss">
.page {
  display: grid;
  justify-content: center;
  padding: 32px 24px 16px;
  width: 100%;

  &__head {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 56px;

    ion-text {
      display: block;
      margin: 0 auto;
    }
  }

  &__title {
    padding: 0;
    font-size: 28px;
    font-weight: 400;
    line-height: 1.3;
    margin-bottom: 20px;
  }
}

.buttons {
  margin-top: 1rem;
  width: 30%;
  margin: 0 auto;
  padding: 0 24px calc(32px + var(--ion-safe-area-bottom));

  @media (max-width: 992px) {
    width: 100%;
  }

  .button {
    margin: 0 auto;
    text-align: center;
    font-family: Lato;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;
  }
}
</style>
