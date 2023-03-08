<template>
  <base-layout>
    <template #header>
      <page-header back-btn :title="`My ${sessionTypeName}`" @back="back" />
    </template>
    <template #content>
      <div class="content">
        <div class="qr">
          <div class="qr__img" ref="qrCodeEl"></div>
          <ion-text color="medium" class="qr__info">
            Please show this unique one-time QR code at check in to begin your
            session
          </ion-text>
        </div>

        <div class="training-preview">
          <div class="training-preview__head">
            <trainer-item
              v-if="sessionType === EntitiesEnum.Training"
              class="trainer"
              :trainer="trainer"
            />
            <search-result
              v-else-if="sessionType === EntitiesEnum.Facility"
              show-rating
              :item="facility"
            />
            <event-item v-else-if="event" :item="event" hide-time />
          </div>
          <div class="training-preview__row">
            <strong class="training-preview__row__title">Date</strong>
            <span class="training-preview__row__data">
              {{ trainingStartDate }}
            </span>
          </div>
          <div class="training-preview__row">
            <strong class="training-preview__row__title">Time</strong>
            <span class="training-preview__row__data">
              {{ trainingStartTime }}
            </span>
          </div>
          <div class="training-preview__row">
            <strong class="training-preview__row__title">Total</strong>
            <span class="training-preview__row__data">
              ${{ trainingTotal }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #footer v-if="sessionType === EntitiesEnum.Training">
      <div class="footer ion-padding-horizontal">
        <ion-button
          color="medium"
          expand="block"
          fill="outline"
          @click="cancel"
          :disabled="trainingOnCanceling"
        >
          Cancel {{ sessionTypeName }}
        </ion-button>
      </div>
    </template>
  </base-layout>

  <confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to cancel training?"
    description="Training will be deleted from your upcoming events"
    button-text="Cancel session"
    cancel-button-text="No, keep session"
    @discard="onCancelTraining"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { IonButton, IonText, toastController } from "@ionic/vue";
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
} from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import TrainerItem from "@/general/components/TrainerItem.vue";
import SearchResult from "@/users/views/facilities/SearchResult.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import dayjs from "dayjs";
import useId from "@/hooks/useId";
import EventItem from "@/general/components/EventItem.vue";

const router = useRouter();
const route = useRoute();
const qrCodeEl = ref<HTMLElement>();

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();

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

const sessionType = route.query.type;
const sessionTypeName = computed<string>(() => {
  switch (sessionType) {
    case EntitiesEnum.Facility:
      return "GYM pass";

    case EntitiesEnum.Training:
      return "training";

    case EntitiesEnum.Event:
      return "event";

    default:
      return "";
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
  switch (sessionType) {
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
  switch (sessionType) {
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
      return "";
  }
});

const trainingStartTime = computed(() => {
  switch (sessionType) {
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
  switch (sessionType) {
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

.event {
  --padding-start: 0;
  --padding-end: 0;
}
</style>
