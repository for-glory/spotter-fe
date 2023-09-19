<template>
  <ion-page ref="page">
    <base-layout>
      <template #header>
        <page-header back-btn @back="onBack" title="Location and Rate" />
      </template>
      <template #content>
        <div class="page">
          <choose-block
            title="Choose your gym location"
            class="form-row__control tr-class"
            @handle-click="chooseGymLocation"
            :value="
              selectedAddress
                ? `${selectedAddress?.thoroughfare} ${selectedAddress?.subThoroughfare}`
                : ''
            "
             :isLightItem="role === RoleEnum.Trainer ? true : false"
          />
          <!-- <choose-block
            title="State"
            class="page__control"
            @handle-click="chooseState"
            :value="selectedState?.name"
            :disabled="useMyPhoneLocation"
          />
          <choose-block
            title="City"
            class="page__control"
            @handle-click="chooseCity"
            :value="selectedCity?.name"
            :disabled="!selectedState || useMyPhoneLocation"
          />
          <choose-block
            title="Address"
            class="page__control"
            @handle-click="chooseAddress"
            :disabled="!selectedState || !selectedCity || useMyPhoneLocation"
            :value="
              selectedAddress
                ? `${selectedAddress.address.thoroughfare} ${selectedAddress.address.subThoroughfare}`
                : ''
            "
          />
          <ion-item class="page__holder-textarea" :disabled="!selectedCity">
            <ion-textarea
              v-model="description"
              class="page__textarea"
              placeholder="Additional information"
              maxlength="150"
              rows="3"
            />
          </ion-item> -->
        </div>
      </template>
      <template #footer>
        <div class="holder-button">
          <ion-button
            @click="onBack"
            :disabled="!selectedCity"
            class="button--submit"
            expand="block"
          >
            Save
          </ion-button>
        </div>
      </template>
    </base-layout>
  </ion-page>
  <choose-location-modal ref="chooseLocationModal" @select="addressSelected" />
</template>

<script setup lang="ts">
import {
  IonPage,
  IonButton,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { ref, computed } from "vue";
import ChooseLocationModal from "@/facilities/components/ChooseLocationModal.vue";
import { State, IState, City, ICity } from "country-state-city";
import { useNewFacilityStore } from "@/facilities/store/new-facility";
import { useNewEventStore } from "@/general/stores/new-event";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const router = useRouter();
const route = useRoute();

const countryCode = "US";
const states = ref<IState[]>(State.getStatesOfCountry(countryCode));
const cities = ref<ICity[]>();

const chooseLocationModal = ref<typeof ChooseLocationModal | null>(null);
const description = ref("");
console.log(route.params.type);
const store = route.params.type === 'event' ? useNewEventStore() : useNewFacilityStore();
const selectedState = computed(() => store.address.state);
const selectedCity = computed(() => store.address.city);
const selectedAddress = computed(() => store.address.address);

const { role } = useRoles()

const onBack = () => {
  store.setAddress(selectedState, selectedCity, selectedAddress);
  router.go(-1);
};

const chooseGymLocation = () => {
  chooseLocationModal.value?.present({
    title: "Address",
  });
}

</script>

<style scoped lang="scss">
.header {
  margin-bottom: 15px;
}

.page {
  padding: 0 24px;

  &__label {
    display: block;
    margin-bottom: 6px;
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5;
    color: var(--ion-color-medium);
  }

  &__input {
    margin-bottom: 23px;
    --placeholder-color: var(--ion-color-medium);
    --color: var(--ion-color-white);
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
  }

  &__holder-textarea {
    --background-focused: transparent;
    --padding-start: 0;
    --inner-padding-end: 0;
    margin-bottom: 23px;
    --border-color: var(--gray-600);
    --background: var(--gray-700);
    --border-width: 1px;
    --border-radius: 8px;
    --full-highlight-height: 0;
    --highlight-color-focused: var(--gray-500);

    &::part(native) {
      border-width: 1px;
    }

    &.item-has-focus {
      &::part(native) {
        border-color: var(--gray-500);
      }
    }
  }

  &__textarea {
    display: block;
    height: 100%;
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
    --placeholder-color: var(--ion-color-white);
    --color: var(--ion-color-white);
    --padding-start: 15px !important;
    --padding-top: 5px;
    --padding-bottom: 20px;
    margin-top: 0;
  }

  &__control {
    margin-bottom: 24px;
    --background: var(--gray-700);
    --border-radius: 8px;
    --color: var(--ion-color-white);
    font-weight: 300;
    font-size: 14px;
    line-height: 1.5;
  }

  .choose-place__icon {
    height: 22px;
    width: 22px;
    margin-right: 3px;
  }

  &__control-icon {
    font-size: 16px;
    line-height: 1.5;
    margin-right: 4px;
    margin-left: 10px;
    color: var(--gray-400);
  }
}

.holder-button {
  padding: 20px 24px calc(32px + var(--ion-safe-area-bottom));
  display: block;

  .button {
    margin: 0;
  }
}
</style>
