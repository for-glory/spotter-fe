<template>
  <base-layout hide-navigation-menu :header-fixed="false" :content-full-height="false" v-if="!isWebView">
    <template #header>
      <page-header back-btn @back="onBack" title="Choose place" class="page-header" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" class="spinner" />
      <div :class="['radiobutton__group', { 'user-choose-place': role === RoleEnum.User }]" v-else>
        <ion-radio-group v-model="chosenPlace">
          <div class="radiobutton__container" v-if="trainerType !== TrainerTypeEnum.Freelancer">
            <ion-label class="radiobutton__label">
              Training will be in trainer’s gym
            </ion-label>
            <ion-item class="radiobutton">
              {{ DescriptionOfPlaces.trainerGym }}
              <ion-radio class="radiobutton__radio" slot="end" :value="PlaceType.TrainerGym" />
            </ion-item>
          </div>
          <div class="radiobutton__container">
            <ion-label class="radiobutton__label">
              You’ll be charged for trainer visiting gym with you
            </ion-label>
            <ion-item class="radiobutton">
              {{ DescriptionOfPlaces.userGym }}
              <ion-radio class="radiobutton__radio" slot="end" :value="PlaceType.UserGym" />
            </ion-item>
            <choose title="Choose gym location" :value="role === RoleEnum.User ? selectedGym?.name : store.facility?.name"
              @handle-click="onChooseGym" class="choose-gym" />
          </div>

          <div class="radiobutton__container">
            <ion-label class="radiobutton__label">
              All details will be defined with trainer in chat
            </ion-label>
            <ion-item class="radiobutton">
              {{ DescriptionOfPlaces.userHome }}
              <ion-radio class="radiobutton__radio" slot="end" :value="PlaceType.UserHome" />
            </ion-item>
          </div>
        </ion-radio-group>
        <ion-button @click="confirmOrder" :disabled="!store.place?.text" class="confirm-btn">
          Confirm
        </ion-button>
      </div>
    </template>
  </base-layout>
  <template v-else>
    <ion-spinner v-if="loading" class="spinner" />
    <div :class="['radiobutton__group', { 'user-choose-place': role === RoleEnum.User, 'pt-6': isWebView }]" v-else>
      <ion-radio-group v-model="chosenPlace">
        <div class="radiobutton__container" v-if="trainerType !== TrainerTypeEnum.Freelancer">
          <ion-label class="radiobutton__label">
            Training will be in trainer’s gym
          </ion-label>
          <ion-item class="radiobutton" :fill="isWebView ? 'outline' : undefined" :lines="isWebView ? 'none' : 'inset'">
            {{ DescriptionOfPlaces.trainerGym }}
            <ion-radio class="radiobutton__radio" slot="end" :value="PlaceType.TrainerGym" />
          </ion-item>
        </div>
        <div class="radiobutton__container">
          <ion-label class="radiobutton__label">
            You’ll be charged for trainer visiting gym with you
          </ion-label>
          <ion-item class="radiobutton" :fill="isWebView ? 'outline' : undefined" :lines="isWebView ? 'none' : 'inset'">
            {{ DescriptionOfPlaces.userGym }}
            <ion-radio class="radiobutton__radio" slot="end" :value="PlaceType.UserGym" />
          </ion-item>
          <choose title="Choose gym location" :value="role === RoleEnum.User ? selectedGym?.name : store.facility?.name"
            :is-web-item="isWebView" :item-outline="isWebView" @handle-click="onChooseGym" class="choose-gym" />
        </div>

        <div class="radiobutton__container">
          <ion-label class="radiobutton__label">
            All details will be defined with trainer in chat
          </ion-label>
          <ion-item class="radiobutton" :fill="isWebView ? 'outline' : undefined" :lines="isWebView ? 'none' : 'inset'">
            {{ DescriptionOfPlaces.userHome }}
            <ion-radio class="radiobutton__radio" slot="end" :value="PlaceType.UserHome" />
          </ion-item>
        </div>
      </ion-radio-group>
    </div>
  </template>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import {
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonSpinner,
  modalController,
  IonButton
} from "@ionic/vue";
import { PlaceType } from "@/ts/enums/user";
import Choose from "@/general/components/blocks/Choose.vue";
import { onMounted, ref, watch } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { paymentGatewaysStore } from "@/users/store/paymentGatewaysStore";
import {
  Query,
  UserDocument,
  TrainerTypeEnum,
  SettingsCodeEnum,
  RoleEnum,
} from "@/generated/graphql";
import { computed } from "@vue/reactivity";
import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import useRoles from "@/hooks/useRole";
import { useSelectedAddressStore } from "@/trainers/store/selected-address";
import { Capacitor } from "@capacitor/core";
import ChooseGymAccount from "@/trainers/views/registration/ChooseGymAccount.vue";

const DescriptionOfPlaces = {
  trainerGym: "Training in trainer’s gym",
  userGym: "Training in my gym",
  userHome: "Travel to my location",
};

const props = withDefaults(
  defineProps<{
    isWebView?: boolean;
  }>(), {
  isWebView: false
}
);

const router = useRouter();
const route = useRoute();
const { role } = useRoles();
const store = paymentGatewaysStore();
const selectedAddress = useSelectedAddressStore();
const selectedGym = computed(() => selectedAddress?.assignedFacility);

const chosenPlace = ref(store.place?.value);

const { result, loading } = useQuery<Pick<Query, "user">>(UserDocument, {
  id: route.params.id,
});

const hourlyRate = computed(() => {
  const rate = result.value?.user?.settings?.find(
    (setting) => setting.setting?.code === SettingsCodeEnum.HourlyRate
  );
  return rate ? getSumForPayment(rate.value, true) : "0.00";
});

const remoteHourlyRate = computed(() => {
  const rate = result.value?.user?.settings?.find(
    (setting) => setting.setting?.code === SettingsCodeEnum.RemoteHourlyRate
  );
  return rate ? getSumForPayment(rate.value, true) : "0.00";
});

const trainerType = computed(() => result.value?.user?.trainer_type);

const confirmOrder = () => {
  router.push({
    name: EntitiesEnum.ConfirmOrder,
    params: { id: route.params.id },
    query: { type: 'addToCart' }
  });
};

watch(
  () => chosenPlace.value,
  (newVal) => {
    switch (newVal) {
      case PlaceType.TrainerGym:
        if (
          trainerType.value !== TrainerTypeEnum.Freelancer &&
          trainerType.value !== TrainerTypeEnum.WorkingInGym
        ) {
          store.setValue("price", hourlyRate.value);
        }
        store.setValue("place", {
          value: newVal,
          text: DescriptionOfPlaces.trainerGym,
        });
        break;
      case PlaceType.UserGym:
        if (
          trainerType.value !== TrainerTypeEnum.Freelancer &&
          trainerType.value !== TrainerTypeEnum.WorkingInGym
        ) {
          store.setValue("price", remoteHourlyRate.value);
        }
        store.setValue("place", {
          value: newVal,
          text: DescriptionOfPlaces.userGym,
        });
        break;
      case PlaceType.UserHome:
        if (
          trainerType.value !== TrainerTypeEnum.Freelancer &&
          trainerType.value !== TrainerTypeEnum.WorkingInGym
        ) {
          store.setValue("price", remoteHourlyRate.value);
        }
        store.setValue("facility", null);
        store.setValue("place", {
          value: newVal,
          text: DescriptionOfPlaces.userHome,
        });
        break;
      default:
        break;
    }
  }
);

const onChooseGym = async () => {
  if (role === RoleEnum.User) {
    if (Capacitor.isNativePlatform()) {
      router.push({ name: EntitiesEnum.ChooseGymAccount });
    }
    else {
      const modal = await modalController.create({
        component: ChooseGymAccount,
        cssClass: 'tr-choose-gym-modal',
        componentProps: {
          fromModal: true
        }
      });
      modal.present();
    }
    return;
  }
  router.push({ name: EntitiesEnum.ChooseGym });
};

onMounted(() => {
  if (store.place) {
    chosenPlace.value = store.place.value;
  }
});

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.radiobutton {
  --background: var(--gray-700);
  --border-radius: 8px;
  --inner-padding-end: 16px;
  font-weight: 300;
  font-size: 14px;
  color: var(--ion-color-white);
  margin-top: 8px;

  &::part(native) {
    border-radius: 8px;
  }

  &__container {
    margin-bottom: 24px;
  }

  &__label {
    font-weight: 400;
    font-size: 14px;
    color: var(--gray-500);
  }

  &__group {
    padding: 24px;
  }

  &__radio {
    &::part(mark) {
      background-size: 12px 9px;
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-image: url(/public/assets/icon/check-mark.svg);
    }

    &.radio-checked {
      &::part(mark) {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.choose-gym {
  margin-top: 16px;
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.user-choose-place {

  .radiobutton__label,
  .radiobutton {
    font-family: Yantramanav;
  }
}

.pt-6 {
  padding-top: 6px;
}
.confirm-btn {
  margin-top: 16px;
  width: 100%;
}
</style>
