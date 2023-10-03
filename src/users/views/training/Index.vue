<template>
  <base-layout :class="{ 'web-training': isWeb }" :hide-navigation-menu="isWeb">
    <template v-if="!isWeb" #header>
      <page-header back-btn :title="`My ${sessionTypeName}`" @back="back" />
    </template>
    <template #content>
      <div :class="['content', { 'user-content': role === RoleEnum.User }]">
        <div class="web-header" v-if="isWeb">
          My  {{ sessionTypeName }}
        </div>
        <div class="qr">
          <IonIcon class="qr__code" v-if="role == RoleEnum.User" src="assets/qrcode.svg" />
          <div class="qr__img" v-else ref="qrCodeEl"></div>
          <ion-text color="medium" class="qr__info">
            Please show this unique one-time QR code at check in to begin your
            session
          </ion-text>
        </div>

        <div class="training-preview">
          <div class="training-preview__head">
            <trainer-item
              v-if="webSessionType === EntitiesEnum.Training"
              class="trainer"
              :trainer="role === RoleEnum.User ? dummyTraings : trainer"
            />
            <search-result
              v-else-if="showSearchResult"
              show-rating
              :item="role === RoleEnum.User ? dummyFacility : facility"
            />
            <event-item v-else-if="event || webSessionType === EntitiesEnum.Event" :item="dummyEvent" hide-time hideEventTime />
          </div>
          <div class="training-preview__row">
            <strong class="training-preview__row__title">{{dateLabel}}</strong>
            <span class="training-preview__row__data">
              {{ trainingStartDate }}
            </span>
          </div>
          <div class="training-preview__row" v-if="showTime">
            <strong class="training-preview__row__title">Time</strong>
            <span class="training-preview__row__data">
              {{ trainingStartTime }}
            </span>
          </div>
          <div class="training-preview__row" v-else-if="planType">
            <strong class="training-preview__row__title">Plan</strong>
            <span class="training-preview__row__data">
              {{ planType }}
            </span>
          </div>
          <div class="training-preview__row" v-else-if="sessionType === EntitiesEnum.Event">
            <strong class="training-preview__row__title">Session quantity</strong>
            <span class="training-preview__row__data">
              1 Session
            </span>
          </div>
          <div class="training-preview__row">
            <strong class="training-preview__row__title">Total</strong>
            <span class="training-preview__row__data">
              ${{ trainingTotal || 20 }}
            </span>
          </div>
        </div>

        <ion-button v-if="isWeb"
          color="medium"
          expand="block"
          fill="outline"
          @click="cancel"
          :class="{ 'native-app': role === RoleEnum.User }"
          :disabled="trainingOnCanceling"
        >
          Cancel {{ cancelBtnTxt }}
        </ion-button>
      </div>
    </template>

    <template #footer v-if="showfooterBtn && !isWeb">
      <div :class="['footer', 'ion-padding-horizontal', { 'web-footer': isWeb }]">
        <ion-button
          color="medium"
          expand="block"
          fill="outline"
          @click="cancel"
          :class="{ 'native-app': role === RoleEnum.User }"
          :disabled="trainingOnCanceling"
        >
          Cancel {{ cancelBtnTxt }}
        </ion-button>
      </div>
    </template>
  </base-layout>

  <confirmation
    :is-visible="showConfirmationModal"
    :is-web="isWeb"
    title="Do you want to cancel training?"
    description="Training will be deleted from your upcoming events"
    button-text="Cancel session"
    cancel-button-text="No, keep session"
    @discard="onCancelTraining"
    @decline="hideModal"
  />
  <terms-of-use
    :is-confirmed="isConfirmed"
    :is-web="isWeb"
    @agree="onAgree"
    @decline="onDecline"
  />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { IonButton, IonIcon, IonText, toastController } from "@ionic/vue";
import TermsOfUse from "@/general/components/modals/terms/TermsOfUse.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import QRCodeStyling, { DrawType } from "qr-code-styling";
import { computed, ref, onMounted } from "vue";
import CryptoJs from "crypto-js";
import { useLazyQuery, useMutation } from "@vue/apollo-composable";
import {
  PaymentGatewayRefundDocument,
  Query,
  SettingsCodeEnum,
  TrainingDocument,
  TrainingStatesEnum,
  EventDocument,
  FacilityItemPassDocument,
  RoleEnum,
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import TrainerItem from "@/general/components/TrainerItem.vue";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import dayjs from "dayjs";
import useId from "@/hooks/useId";
import EventItem from "@/general/components/EventItem.vue";
import useRoles from "@/hooks/useRole";

const props = withDefaults(defineProps<{
  isWeb?:boolean,
  webSessionType?:string
}>(), {
  isWeb: false
})

const router = useRouter();
const route = useRoute();
const qrCodeEl = ref<HTMLElement>();
const { role } = useRoles();
const closeModal = ref(true);
const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();
const sessionType = route.query.type;
const compSessionType = sessionType || props?.webSessionType;

const dateLabel = computed(() => {
  if (role === RoleEnum.User) {
    if (compSessionType === EntitiesEnum.FacilityDropins || compSessionType === EntitiesEnum.Facilities) {
      return "Expiry date";
    }
  } 
  return "Date";
});

const showSearchResult = computed(() => {
  if (compSessionType === EntitiesEnum.Facility || (role === RoleEnum.User && compSessionType === EntitiesEnum.FacilityDropins)) {
    return true;
  } 
})

const {
  mutate: cancelTraining,
  onDone: trainingCanceled,
  loading: trainingOnCanceling,
} = useMutation(PaymentGatewayRefundDocument);

const onCancelTraining = () => {
  hideModal();
  cancelTraining({
    input: { order_id: trainingResult.value?.training.order.id },
  });
};

trainingCanceled(() => {
  showToast(
    `Your training with ${trainer.value?.first_name} ${trainer.value?.last_name} has been canceled`,
    "success-toast",
    "assets/icon/success.svg"
  );
  back();
});

const sessionTypeName = computed<string>(() => {
  switch (compSessionType) {
    case EntitiesEnum.Facility:
      return "Passes";

    case EntitiesEnum.Training:
      return "training";

    case EntitiesEnum.Event:
      return "event";

    default:
      return "Drop-ins";
  }
});
const planType = computed(() => {
  if (compSessionType === EntitiesEnum.Facility) {
    return "Premium";
  } else if (compSessionType === EntitiesEnum.FacilityDropins) {
    return "One Day Access";
  }
});
const showTime = computed(() => {
  if (role !== RoleEnum.User) {
    return true
  } else if (role === RoleEnum.User){
    if (compSessionType === EntitiesEnum.Training) {
      return true;
    }
  }
});

const showfooterBtn = computed(() => {
  if (role !== RoleEnum.User) {
    if (compSessionType === EntitiesEnum.Training) {
      return true;
    }
  } else if (role === RoleEnum.User) {
      return true;
  } 
});

const cancelBtnTxt = computed(() => {
  if (role !== RoleEnum.User) {
    return sessionTypeName;
  } else if (role === RoleEnum.User){
    if (compSessionType === EntitiesEnum.Event || compSessionType === EntitiesEnum.FacilityDropins) {
      return "session";
    } else if(compSessionType === EntitiesEnum.Training){
      return "training";
    } else if (compSessionType === EntitiesEnum.Facility){
      return "membership";
    }
  }
});

const isConfirmed = computed(() => {
  if (role !== RoleEnum.User) {
    return true;
  }else if (role === RoleEnum.User) {
    if (compSessionType === EntitiesEnum.Training) {
      return false;
    } else {
      return true;
    }
  }
});


const {
  result: facilityResult,
  load: getFacility,
  onResult: gotFacility,
} = useLazyQuery<Pick<Query, "facilityItemPass">>(FacilityItemPassDocument, {
  id: route.params.id,
});

const {
  result: trainingResult,
  load: getTraining,
  onResult: gotTraining,
} = useLazyQuery<Pick<Query, "training">>(TrainingDocument, {
  id: route.params.id,
});

const {
  result: eventResult,
  load: getEvent,
  onResult: gotEvent,
} = useLazyQuery<Pick<Query, "event">>(EventDocument, {
  id: route.params.id,
});

onMounted(() => {
  switch (compSessionType) {
    case EntitiesEnum.Facility:
      getFacility();
      break;

    case EntitiesEnum.Training:
      getTraining();
      break;

    case EntitiesEnum.Event:
      getEvent();
      break;

    default:
      break;
  }
});

const qrOptions = ref({
  width: 200,
  height: 200,
  type: "svg" as DrawType,
  data: "",
  dotsOptions: {
    color: "#FFFFFF",
  },
  backgroundOptions: {
    color: "transparent",
  },
});

const trainer = ref();
const facility = ref();

const dummyFacility = {
  media: [
    {
      pathUrl: "assets/backgrounds/Gym_1.png"
    }
  ],
  name: "Diamond Gym",
  score: "4.6",
  address: {
    street: "Light Street, 24"
  }
};

const dummyTraings = {
  avatarUrl: "assets/backgrounds/Gym_1.png",
  first_name: "Tamra",
  last_name: "Dae",
  score: 4.6,
  address: "“Summer Gym”, Wall Street, 24"
}

const dummyEvent = {
  media:[
    {
      pathUrl: "assets/backgrounds/food1.png",
    }
  ],
  title: "Food Festival",
  address: {
    street: "Light Street, 24"
  }
}

const onAgree = () => {
  console.log('on agree');
  closeModal.value = true
}

const onDecline = () => {
  console.log('call ondecline');
  
}

gotFacility((response) => {
  const facilityPass = response.data.facilityItemPass;
  if (!facilityPass) return;

  if (facilityPass.facilityItem.facility.id) {
    const encryptedEvent = CryptoJs.AES.encrypt(
      `facilityPass/${route.params.id}`,
      facilityPass.facilityItem.facility.id
    ).toString();

    qrOptions.value.data = encryptedEvent;
    facility.value = facilityPass.facilityItem.facility;
  }

  const qrCode = new QRCodeStyling(qrOptions.value);
  qrCode.append(qrCodeEl.value);
});

gotTraining((response) => {
  const training = response.data.training;
  if (!training) return;

  if (training.state !== TrainingStatesEnum.Accepted) {
    showToast(`Error! Training state is ${training.state}`, "warning-toast");
  }

  if (training.trainer.id) {
    const encryptedTraining = CryptoJs.AES.encrypt(
      `training/${route.params.id}`,
      training.trainer.id
    ).toString();

    qrOptions.value.data = encryptedTraining;

    const qrCode = new QRCodeStyling(qrOptions.value);
    qrCode.append(qrCodeEl.value);
    trainer.value = training.trainer;
  }
});

const event = ref();

gotEvent((response) => {
  event.value = response.data.event;
  if (!event.value) return;

  const { id } = useId();
  if (event.value.trainer?.id) {
    const encryptedEvent = CryptoJs.AES.encrypt(
      `event/${route.params.id}/${id}`,
      event.value.trainer.id
    ).toString();

    qrOptions.value.data = encryptedEvent;
    trainer.value = event.value.trainer;
  }

  if (event.value.facility?.id) {
    const encryptedEvent = CryptoJs.AES.encrypt(
      `event/${route.params.id}/${id}`,
      event.value.facility.id
    ).toString();

    qrOptions.value.data = encryptedEvent;
    facility.value = event.value.facility;
  }

  const qrCode = new QRCodeStyling(qrOptions.value);
  qrCode.append(qrCodeEl.value);
});

const trainingStartDate = computed(() => {
  switch (compSessionType) {
    case EntitiesEnum.Facility:
      return dayjs(facilityResult.value?.facilityItemPass.start_date).format(
        "DD/MM/YYYY"
      );

    case EntitiesEnum.Training:
      return dayjs(trainingResult.value?.training?.start_date).format(
        "DD/MM/YYYY"
      );

    case EntitiesEnum.Event:
      return dayjs(eventResult.value?.event.start_date).format("DD/MM/YYYY");

    default:
      return dayjs(new Date()).format("DD/MM/YYYY");
  }
});

const trainingStartTime = computed(() => {
  switch (compSessionType) {
    case EntitiesEnum.Facility:
      return dayjs(facilityResult.value?.facilityItemPass.start_date).format(
        "hh:mm A"
      );

    case EntitiesEnum.Training:
      return dayjs(trainingResult.value?.training?.start_date).format(
        "hh:mm A"
      );

    case EntitiesEnum.Event:
      return dayjs(eventResult.value?.event.start_date).format("hh:mm A");

    default:
      return "";
  }
});

const trainingTotal = computed(() => {
  switch (compSessionType) {
    case EntitiesEnum.Facility:
      return facilityResult.value?.facilityItemPass.order.front_total;

    case EntitiesEnum.Training: {
      const rate = trainingResult.value?.training.trainer?.settings?.find(
        (setting) => setting.setting?.code === SettingsCodeEnum.HourlyRate
      );
      return rate?.value ? (rate.value / 100).toFixed(2) : "0.00";
    }

    case EntitiesEnum.Event:
      return eventResult.value?.event.front_price;

    default:
      return "";
  }
});

const back = () => {
  router.go(-1);
};

const cancel = () => {
  showModal();
};

const showToast = async (
  message: string,
  cssClass: string,
  icon = "assets/icon/info.svg"
) => {
  const toast = await toastController.create({
    message,
    cssClass,
    duration: 2000,
    icon,
  });
  toast.present();
};
</script>

<style scoped lang="scss">
.content {
  padding: 24px 16px 20px;
}

.qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;

  &__img {
    width: 200px;
    margin: 0 auto;
    position: relative;

    &:before {
      content: "";
      display: block;
      padding-top: 100%;
    }

    &:deep(svg) {
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }

  &__code {
    font-size: 200px;
  }

  &__info {
    display: block;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    max-width: 250px;
    text-align: center;
    margin: 12px auto 0;
  }
}

.training-preview {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  border-radius: 8px;
  padding: 0 16px 24px;
  background: var(--gray-700);
  color: var(--ion-color-white);

  .search-result {
    padding-left: 0;
    padding-right: 0;
    margin-bottom: 0;
  }

  &__head {
    margin-bottom: 12px;
    border-bottom: 1px solid var(--gray-600);

    .item-wrap {
      margin-top: 0;
      margin-left: -16px;
      margin-right: -16px;
    }
  }

  &__row {
    margin-top: 12px;

    &__title {
      display: block;
      font-size: 12px;
      line-height: 1.5;
      font-weight: 500;
      color: var(--ion-color-secondary);
    }

    &__data {
      display: block;
    }
  }
}

.footer {
  padding-top: 24px;
  padding-bottom: calc(20px + var(--ion-safe-area-bottom));

  .button {
    margin: 0;
  }
}

.user-content {
  .qr__info {
    color: var(--fitnesswhite);
    text-align: center;
    font-family: Yantramanav;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }

  .training-preview__row {
    &__title , &__data{
      font-family: Yantramanav;
    }
  }
}

.user-footer {
  ion-button {

  }
}

.event {
  --padding-start: 0;
  --padding-end: 0;
}

.web-header {
  color: var(--gold);
  text-align: center;
  font-family: Yantramanav;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 20px;
}

.web-training {
  :deep {
    ion-content{
      --background: var(--gray-700);
    }
  }

  .content {
    padding: 0 10px 25px 10px;
  }
}

.web-footer {
  background: var(--gray-700) !important;
}
</style>
