<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" />
    </template>
    <template #content>
      <div class="page">
        <div class="page__head">
          <ion-title class="page__title" color="primary">
            Let’s add more information
          </ion-title>
          <ion-text color="secondary">
            To give you a better experience we need to know more about you
          </ion-text>
        </div>
        <div class="form-row">
          <ion-label class="label">
            Is a gym/facility your main place of business?
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
        <div class="form-row">
          <ion-label class="label">
            Set your hourly rate for trainings at home (USD $)
          </ion-label>
          <base-input
            type="number"
            v-model:value="remoteHourlyRate"
            @change="remoteHourlyRateChange"
            placeholder="Enter your rate per hour"
          />
        </div>
        <div class="form-row">
          <ion-label class="label">
            Please set your travel or distance radius (1-15 miles)
          </ion-label>
          <wheel-picker :options="startTimeOptions" name="radiusDistance">
            <template #button>
              <choose-block
                title="Select radius"
                @handle-click="openPicker('radiusDistance')"
                :value="travelRadius ? `${travelRadius} miles` : ''"
              />
            </template>
          </wheel-picker>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="buttons">
        <ion-button
          expand="block"
          @click="saveAddress"
          :disabled="
            !chosenGym ||
            !hourlyRate?.length ||
            !remoteHourlyRate?.length ||
            loading
          "
        >
          Next
        </ion-button>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonText,
  IonTitle,
  IonLabel,
  PickerColumnOption,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import WheelPicker from "@/general/components/blocks/WheelPicker.vue";
import { Emitter, EventType } from "mitt";
import { inject, computed } from "vue";
import { distance } from "@/const/distance";
import { EntitiesEnum } from "@/const/entities";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import { useMutation } from "@vue/apollo-composable";
import {
  SettingsCodeEnum,
  TrainerTypeEnum,
  UpdateTrainerTypeDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { setSettings } from "@/hooks/useSettings";
import { ProfileSettings } from "@/ts/enums/user";
import { openHours } from "@/helpers/getDefaultOpenHours";

const router = useRouter();

const onBack = () => {
  store.clearState();
  router.go(-1);
};

const store = useSelectedAddressStore();

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

const remoteHourlyRate = computed(() =>
  store.remoteHourlyRate ? String(store.remoteHourlyRate / 100) : ""
);
const remoteHourlyRateChange = (value: string) => {
  store.setRemoteHourlyRate(Number(value) * 100);
};

const travelRadius = computed(() => store.travelRadius);
const travelRadiusChange = (value: number | null) => {
  store.setTravelRadius(value);
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
    trainer_type: TrainerTypeEnum.Both,
    facility_id: chosenGym.value.id,
    opening_hours: JSON.stringify(openHours()),
    settings: [
      {
        code: SettingsCodeEnum.HourlyRate,
        value: Number(hourlyRate.value) * 100,
      },
      {
        code: SettingsCodeEnum.RemoteHourlyRate,
        value: Number(remoteHourlyRate.value) * 100,
      },
      {
        code: SettingsCodeEnum.IsMobile,
        value: true,
      },
      // {
      //   code: SettingsCodeEnum.TrainerRemoteDistance,
      //   value: travelRadius.value,
      // },
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

const emitter: Emitter<Record<EventType, unknown>> | undefined =
  inject("emitter"); // Inject `emitter`

const openPicker = (name: string): void => {
  emitter?.emit("open-picker", name);
};

const distances = distance();

const radiusPickerColums = [
  {
    name: "radius",
    options: distances,
  },
  {
    name: "unit",
    options: [
      {
        text: "MIL",
        value: "miles",
      },
    ],
  },
];

const startTimeOptions = {
  columns: radiusPickerColums,
  buttons: [
    {
      text: "Cancel",
      role: "cancel",
    },
    {
      text: "Select radius",
      handler: (value: PickerColumnOption) => {
        travelRadiusChange(value.radius?.value);
      },
    },
  ],
};
</script>

<style scoped lang="scss">
.page {
  padding: 32px 24px 16px;
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;

  .form-row {
    padding: 0 2rem;
    width: 30%;
    align-self: center;

    @media (max-width: 992px) {
      width: 100%;
    }
  }

  &__head {
    font-size: 14px;
    font-weight: 300;
    line-height: 1.5;
    text-align: center;
    margin-bottom: 32px;

    ion-text {
      flex: 1;
      margin: 0 auto;

      width: 100%;
      @media (max-width: 992px) {
        max-width: 260px;
      }
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
