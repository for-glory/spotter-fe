<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Location" @back="onBack" />
    </template>
    <template #content>
      <div class="content">
        <div class="main">
          <div class="form-row">
            <choose-block
              title="State"
              class="form-row__control"
              @handle-click="chooseState"
              :value="selectedState?.name"
              :disabled="loading || settingsOnUpdate"
            />
            <choose-block
              title="City"
              class="form-row__control"
              @handle-click="chooseCity"
              :value="selectedCity?.name"
              :disabled="!selectedState || loading || settingsOnUpdate"
            />
            <choose-block
              title="Gyms"
              class="form-row__control"
              @handle-click="chooseGyms"
              :value="selectedFacility?.name || ''"
              :disabled="!selectedCity || loading || settingsOnUpdate"
            />
          </div>
        </div>
        <div class="buttons">
          <ion-button
            expand="block"
            @click="selectFacility"
            :disabled="!selectedFacility || loading || settingsOnUpdate"
          >
            <template v-if="!loading && !settingsOnUpdate"
              >Submit and finish</template
            >
            <ion-spinner v-else name="lines" class="spinner" />
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
  <choose-address-modal ref="chooseAddressModal" @select="addressSelected" />
  <choose-facility-modal ref="chooseFacilityModal" @select="facilitySelected" />
</template>

<script setup lang="ts">
import { IonButton, IonSpinner } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";
import ChooseAddressModal from "@/general/components/ChooseAddressModal.vue";
import ChooseFacilityModal from "@/facilities/components/ChooseFacilityModal.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import {
  City,
  Facility,
  State,
  AttachToFacilityDocument,
  UpdateUserSettingsDocument,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { ChooseAddresModalResult } from "@/interfaces/ChooseAddressModalOption";
import { SelectFacilityModalResult } from "@/interfaces/SelectFacilityModal";
import { useMutation } from "@vue/apollo-composable";
import useId from "@/hooks/useId";
import { ProfileSettings } from "@/ts/enums/user";
import { setSettings } from "@/hooks/useSettings";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const chooseAddressModal = ref<typeof ChooseAddressModal | null>(null);
const selectedState = ref<State | null>(null);
const selectedCity = ref<City | null>(null);
const selectedFacility = ref<Facility | null>(null);

const chooseState = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.State,
    title: "Select state",
    selected: selectedState.value?.id,
  });
};

const chooseCity = () => {
  chooseAddressModal.value?.present({
    type: EntitiesEnum.City,
    title: "Select city",
    selected: selectedCity.value?.id,
    state: selectedState.value,
  });
};

const addressSelected = async (selected: ChooseAddresModalResult) => {
  if (!selected) return;
  selectedState.value = selected.state;
  selectedCity.value = selected.city;
};

const {
  mutate: attachToFacility,
  onDone: attachedToFacility,
  loading,
} = useMutation(AttachToFacilityDocument);

const selectFacility = () => {
  const { registration_code } = JSON.parse(
    localStorage.getItem("organization") || "{}"
  );
  if (!registration_code) {
    router.push({
      name: EntitiesEnum.EnterCode,
    });
    return;
  }
  attachToFacility({
    input: {
      registration_code,
      facility_id: selectedFacility.value?.id,
    },
  });
};

attachedToFacility(() => {
  updateSettings();
});

const {
  mutate: updateUserSettings,
  onDone: settingsUpdated,
  loading: settingsOnUpdate,
} = useMutation(UpdateUserSettingsDocument);

const updateSettings = () => {
  setSettings([{ isFacilitySetUp: true }]);
  const { id } = useId();

  const front_settings = localStorage.getItem(ProfileSettings.UserSettings);

  updateUserSettings({
    id,
    front_settings,
  });
};

settingsUpdated(() => {
  localStorage.removeItem("organization");
  router.push({
    name: EntitiesEnum.Profile,
  });
});

const chooseFacilityModal = ref<typeof ChooseFacilityModal | null>(null);

const chooseGyms = () => {
  const { id: organization_id } = JSON.parse(
    localStorage.getItem("organization") || "{}"
  );
  if (!organization_id) return;
  chooseFacilityModal.value?.present({
    filters: {
      organization_id,
      city_id: selectedCity.value?.id,
      state_id: selectedState.value?.id,
    },
    selected: selectedFacility.value,
  });
};

const facilitySelected = (data: SelectFacilityModalResult) => {
  selectedFacility.value = data.facility;
};
</script>

<style scoped lang="scss">
.content {
  display: flex;
  min-height: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 24px calc(32px + var(--ion-safe-area-bottom));
}

.buttons {
  .button {
    margin: 0;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.form-row {
  &__control {
    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
