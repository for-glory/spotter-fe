<template>
  <base-layout>
    <template #header>
      <page-header back-btn @back="onBack" title="Gym Manager Profile" :edit-btn="true" @edit-click="handleEditGymManager">
      </page-header>
    </template>
    <template #content>
      <div class="main-content d-flex-col justify-content-between">
        <div class="profile-field">
          <div class="contact-field">
            <img v-if="avatarUrl" :src="avatarUrl" id="avatar" />
            <div v-else class="avatar-text d-flex justify-content-center align-items-center">
              {{ name.charAt(0) }}
            </div>
            <ion-label class="name">
              {{ name }}
              <ion-icon @click="isManagerModal = true" slot="icon-only" src="assets/icon/arrow-down-light.svg"></ion-icon>
            </ion-label>
            <ion-text class="contact">{{ "Gym Manager" }}</ion-text>
            <ion-text class="contact">{{ managerStore.email }}</ion-text>
            <ion-text class="contact">{{ managerStore.phone_number }}</ion-text>
          </div>
          <div class="data-box">
            <div class="d-flex align-items-center justify-content-between">
              <div class="d-flex-col align-items-center data-box__item">
                <ion-text>{{ dayjs(managerStore.birth).format("D MMMM YY") }}</ion-text>
                <ion-text class="field-label">Birthday</ion-text>
              </div>
              <div class="vertical-line" />
              <div class="d-flex-col align-items-center data-box__item">
                <ion-text>{{ managerStore.tax_id }}</ion-text>
                <ion-text class="field-label">Tax ID</ion-text>
              </div>
              <div class="vertical-line" />
              <div class="d-flex-col align-items-center data-box__item">
                <ion-text>{{ managerStore.postal_code }}</ion-text>
                <ion-text class="field-label">Postal Code</ion-text>
              </div>
            </div>
            <div class="horizontal-line" />
            <div>
              <div class="d-flex-col align-items-center">
                <ion-text>{{ `${managerStore.address?.street} ${managerStore.address?.city?.state?.name}
                                  ${managerStore.address?.city?.country?.name}` }}</ion-text>
                <ion-text class="field-label">Address</ion-text>
              </div>
            </div>
          </div>
        </div>
        <!-- <week-calendar
          v-model="selectedDate"
          :bookings="bookings"
          @handle-view="onViewCalendar"
        />
        <div class="membership">
          <ion-title class="title">Membership Summary</ion-title>
          <ion-grid class="block">
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="New Signs-up" value="14"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Total" keyText="Active" value="60"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Event counts" value="23"/>
              </ion-col>
              <ion-col size="5">
                <summary-item title="Today's" keyText="Message counts" value="13"/>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="5">
                <summary-item title="Total" keyText="Expiring membership" value="24"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div> -->
        <ion-button @click="showModal" fill="outline" color="danger" id="delete">Delete Manager</ion-button>
      </div>
    </template>
  </base-layout>
  <confirmation :is-visible="showConfirmationModal" title="Do you want to delete account"
    description="Gym manager will be deleted" button-text="Delete" cancel-button-text="Cancel" @discard="onDeleteManager"
    @decline="hideModal" />
  <ion-modal ref="modal" :is-open="isManagerModal" class="choose-facility-modal" @willDismiss="isManagerModal = false"
    v-if="managerData?.length && managerId">
    <div class="modal-gym__content">
      <ion-radio-group v-model="managerId" @ionChange="isManagerModal = false">
        <ion-item lines="none" class="radiobutton" :key="manager?.id" :facility="manager" v-for="manager in managerData">
          <avatar square :src="manager.avatar" class="radiobutton__photo" :symbols="manager?.first_name.charAt(0)" />
          <div class="radiobutton__holder">
            <ion-label class="radiobutton__title">{{ manager?.first_name + ' ' + manager?.last_name }}</ion-label>
            <p>{{ manager.phone }}</p>
            <p>{{ manager.email }}</p>
          </div>
          <ion-radio :value="manager.id" slot="end"></ion-radio>
        </ion-item>
      </ion-radio-group>
      <ion-button @click="handleAddGymManager" class="add-facility-button secondary" expand="block">
        Add new gym manager
      </ion-button>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonModal,
  IonRadioGroup,
  IonText,
  IonItem,
  IonRadio,
modalController
} from "@ionic/vue";
import {
  DeleteManagerDocument, GetManagersByFacilityDocument,
} from "@/generated/graphql";
import { computed, ref, watch } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter, useRoute } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { useManagerStore } from "@/facilities/store/manager";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useUserStore } from "@/general/stores/user";
import dayjs from "dayjs";
import Avatar from "@/general/components/blocks/Avatar.vue";

const router = useRouter();
const route = useRoute();
const managerStore = useManagerStore();
const userStore = useUserStore();
const managerId = ref();


const name = computed(() => {
  if (managerStore?.first_name || managerStore?.last_name) {
    return managerStore.first_name + ' ' + managerStore.last_name;
  }
  return "N/A";
});
const avatarUrl = computed(() => managerStore.avatarUrl);
const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();
const { mutate } = useMutation(DeleteManagerDocument);

const managerData = ref<any>();
const isManagerModal = ref(false);

if (route.params.id) {
  managerId.value = route.params.id;
}

watch(() => managerId.value, () => {
  const selectedManager = managerData.value.find((manager: any) => manager.id === managerId.value);
  if (selectedManager) {
    managerStore.setName(selectedManager?.first_name, selectedManager?.last_name);
    managerStore.setAddress(selectedManager?.address?.lat, selectedManager?.address?.lng, selectedManager?.address?.street, selectedManager.address.id);
    managerStore.setAvatarUrl(selectedManager?.avatarUrl);
    managerStore.setEmail(selectedManager?.email);
    managerStore.setPhoneNumber(selectedManager?.phone);
    managerStore.setEmploymentType(selectedManager?.employment_type);
    managerStore.setPostalCode(selectedManager?.postal);
    managerStore.setTaxID(selectedManager?.tax_id);
    managerStore.setBirthDate(selectedManager?.birth);
  }

});

const {
  result: managersResult,
  loading: loadingManagersData,
  refetch,
  onResult: gotManagers,
} = useQuery<any>(GetManagersByFacilityDocument, {
  role: "MANAGER",
  facilities: userStore.owned_facilities.map((facility: any) => facility.id),
});

gotManagers(({ data }) => {
  console.log({ data });
  managerData.value = data.managers.data;
});

const onDeleteManager = () => {
  console.log("delete manager");
  hideModal();
  console.log(managerId.value);
  mutate({
    id: managerId.value,
  })
    .then(() => {
      onBack();
    })
    .catch((err) => {
      console.log(err);
    });
};
const onBack = () => {
  router.go(-1);
};
const handleEditGymManager = () => {
  router.push({ name: EntitiesEnum.EditManager, params: { id: managerId.value } });
};
const handleAddGymManager = async () => {
  await modalController.dismiss();
  router.push({name: EntitiesEnum.AddManager});
}
</script>

<style scoped lang="scss">
.main-content {
  padding: 16px 20px;
  width: 100%;
  height: 100%;
}

.vertical-line {
  border: solid;
  border-width: 1px;
  border-radius: 2px;
  min-height: 100%;
  padding: 23px 0;
  border-color: var(--main-color);
}

.profile-field {
  display: flex;
  flex-direction: column;
  gap: 22px;

  .calendar-title {
    font: 20px/1 var(--ion-font-family);
    color: #ffffff6a;
    padding: 0;
  }
}

.data-field {
  flex: auto;
}

.contact-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .name {
    font: 500 24px/1 var(--ion-font-family);
    color: var(--fitnesswhite);
  }

  .contact {
    font: 16px/1 var(--ion-font-family);
    color: var(--gray-400);
  }

  ion-img {
    width: 86px;
  }
}

img#avatar {
  border-radius: 100%;
  width: 86px;
  height: 86px;
}

.horizontal-line {
  height: 1px;
  background: var(--main-color);
  margin: 8px;
}

.gym-info {
  background-color: var(--gray-700);
  padding-top: 15px;
  padding-bottom: 15px;
  padding-right: 28px;
  padding-left: 28px;
  border-radius: 8px;
}

.field-label {
  font: 300 14px/1 var(--ion-font-family);
  color: var(--gray-400);
  padding-top: 4px;
}

.d-flex-col {
  display: flex;
  flex-direction: column;
}

ion-text#main {
  font: 500 18px/1 Yantramanav;
  color: #EFEFEF;
}

ion-button#delete {
  width: 100%;
  margin-top: 24px;
}

.membership {
  margin-top: 16px;

  .count {
    font-size: 1.625rem;
    color: var(--gold);
    padding-left: 0.6rem;
    font-weight: bold;
  }

  .period {
    font-size: 1rem;
    color: grey;
    padding-bottom: 0.6rem;
  }

  .time {
    font-size: 0.875rem;
    color: var(--gold);
  }

  .content {
    font-size: 1rem;
    color: #797979;
  }

  ion-row {
    justify-content: space-between;
    gap: 24px;
  }
}

.block {
  width: 100%;
  background-color: #262626;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem 1rem 1rem 1rem;

  ion-row {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}

.title {
  padding: 8px 0px;
  font-size: 1.6rem;
  line-height: 1.3;
  font: 400 16px/1 Lato;
  color: var(--fitnesswhite);
}

.data-box {
  background-color: var(--gray-700);
  padding: 16px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: center;

  ion-text {
    font-size: 16px;
    color: var(--fitnesswhite);
    font-weight: 500;
  }

  .field-label {
    font: 300 14px/1 var(--ion-font-family);
    color: var(--gray-400);
    padding-top: 4px;
  }
}

.horizontal-line {
  border: solid;
  border-width: 1px;
  border-radius: 1px;
  min-width: 70%;
  border-color: var(--main-color);
}

.avatar-text {
  height: 100px;
  width: 100px;
  background: var(--gray-700);
  border-radius: 50%;
  color: var(--fitnesswhite);
  font-family: Lato;
  padding: 12px;
  font-size: 26px;
  font-style: normal;
  font-weight: 900;
}

.choose-facility-modal {
  --height: auto;
  align-items: flex-end;
  --backdrop-opacity: 0.6;
  --ion-backdrop-color: var(--ion-color-black);

  &::part(content) {
    overflow-y: auto;
    overflow-x: hidden;
    scroll-behavior: smooth;
    border-radius: 20px 20px 0 0;
    -webkit-overflow-scrolling: touch;
    padding: 16px 24px calc(16px + var(--ion-safe-area-bottom));
    max-height: calc(100vh - 136px - var(--ion-safe-area-top) - var(--ion-safe-area-bottom));
  }
}

.add-facility-button {
  margin: 0 8px;
}

.radiobutton {
  position: relative;
  margin-bottom: 15px;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 15px;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --border-width: 0.8px;
  --border-style: solid;
  --border-color: var(--gray-700);

  &.item-radio-checked {
    --color: var(--ion-color-white);
    --border-color: var(--ion-color-primary);
  }

  ion-radio {
    width: 18px;
    height: 18px;
    border-width: 1.8px;
    margin: 3px 3px 3px 20px;
    --color: transparent;
    --mark-width: 12px;
    --mark-height: 9px;

    &::part(mark) {
      background-position: 50% 50%;
      background-repeat: no-repeat;
      width: calc(100% + var(--border-width));
      height: calc(100% + var(--border-width));
      background-size: var(--mark-width) var(--mark-height);
      background-image: url(/public/assets/icon/check-mark.svg);
    }
  }

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;

    &--rounded {
      --border-radius: 50%;
    }
  }

  &__holder {
    flex: 1 1 auto;
    max-width: 100%;

    p {
      margin: 0;

      &:first-child {
        margin-bottom: 3px;
      }
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 3px;
    color: var(--ion-color-white);
  }
}</style>
