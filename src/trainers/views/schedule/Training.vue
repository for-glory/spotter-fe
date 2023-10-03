<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Session" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-text class="content__title">Training details</ion-text>
        <template v-if="isList">
          <ion-spinner name="lines" class="spinner" v-if="trainingsLoading" />
          <empty-block
            hide-button
            icon="assets/icon/empty.svg"
            v-else-if="!training.length"
            :title="`Sorry, no trainer details found`"
            :text="`Currently you have no booked trainer`"
          />
          <template v-else>
            <div v-for="data in training" :key="data.id">
              <training-detail
                v-if="data"
                :event="data"
                :type="EntitiesEnum.Training"
                @click="openProfile(data?.user?.id ?? '')"
                :training-address="data?.user?.address?.street ?? ''"
              />
              <ion-button class="secondary" expand="block" @click="openQR">
                Open QR-code reader
              </ion-button>

              <div class="list-holder-button">
                <ion-button
                  class="font-bold"
                  expand="block"
                  @click="openChat(data?.user?.id ?? '')"
                  :disabled="chatLoading"
                >
                  Chat with client
                </ion-button>
                <ion-button
                  class="primary-outline ion-margin-top font-bold"
                  fill="outline"
                  expand="block"
                  @click="onCancelOrder(data?.order?.id)"
                  :disabled="trainingOnCanceling"
                >
                  Cancel training
                </ion-button>
              </div>
            </div>
          </template>
        </template>
        <template v-else>
          <training-detail
            v-if="training"
            :event="training"
            :type="EntitiesEnum.Training"
            @click="openProfile(training?.user.id ?? '')"
            :training-address="training?.user.address?.street ?? ''"
          />
          <ion-button class="secondary" expand="block" @click="openQR">
            Open QR-code reader
          </ion-button>
        </template>
      </div>
    </template>
    <template #footer v-if="!isList">
      <div class="holder-button">
        <ion-button
          class="font-bold"
          expand="block"
          @click="openChat(training?.user.id ?? '')"
          :disabled="chatLoading"
        >
          Chat with client
        </ion-button>
        <ion-button
          class="primary-outline ion-margin-top font-bold"
          fill="outline"
          expand="block"
          @click="onCancelOrder(training?.order?.id)"
          :disabled="trainingOnCanceling"
        >
          Cancel training
        </ion-button>
      </div>
    </template>
  </base-layout>

  <confirmation
    class="cancel-training-modal"
    :is-visible="showConfirmationModal"
    title="Do you want to cancel training?"
    description="Training will be deleted from your schedule"
    button-text="Cancel training"
    cancel-button-text="Cancel"
    @discard="onCancelTraining"
    @decline="hideModal"
  />
</template>

<script setup lang="ts">
import { IonText, IonButton, toastController } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import TrainingDetail from "@/general/components/Training.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { computed, ref } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  CreateChatDocument,
  PaymentGatewayRefundDocument,
  Query,
  QueryTrainerTrainingsOrderByColumn,
  SortOrder,
  TrainerTrainingsDocument,
  TrainingDocument,
  TrainingStatesEnum,
} from "@/generated/graphql";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import { TrainerProfileViewEnum } from "@/const/TrainerSelectOption";
import dayjs from "dayjs";
import EmptyBlock from "@/general/components/EmptyBlock.vue";

const router = useRouter();

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();

const onBack = () => {
  router.go(-1);
};
const selectedCancelOrderId = ref<number | string>("");

const onCancelOrder = (id: number | string) => {
  selectedCancelOrderId.value = id;
  showModal();
}

const {
  mutate: cancelTraining,
  onDone: trainingCanceled,
  loading: trainingOnCanceling,
} = useMutation(PaymentGatewayRefundDocument);

const onCancelTraining = () => {
  hideModal();
  cancelTraining({ input: { order_id: selectedCancelOrderId.value } });
};

trainingCanceled(() => {
  showSuccessToast();
  router.go(-1);
});

const showSuccessToast = async () => {
  const toast = await toastController.create({
    message: "Your training with Nick Fox has been canceled",
    duration: 2000,
    icon: "assets/icon/success.svg",
    cssClass: "common-toast success-toast",
  });
  return toast.present();
};

const route = useRoute();

const isList = computed(() => {
  return !!route.params?.date;
});

const { result } = useQuery<Pick<Query, "training">>(TrainingDocument, {
  id: route.params.id,
});
const { result: trainingsResult, loading: trainingsLoading } = useQuery(
  TrainerTrainingsDocument,
  {
    page: 0,
    first: 4,
    filters: {
      start_date: route.params?.date
        ? dayjs(Number(route.params.date)).format("YYYY-MM-DD HH:mm:ss")
        : dayjs().format("YYYY-MM-DD HH:mm:ss"),
      end_date: route.params?.date
        ? dayjs(Number(route.params.date)).format("YYYY-MM-DD HH:mm:ss")
        : dayjs().format("YYYY-MM-DD HH:mm:ss"),
      states: [TrainingStatesEnum.Accepted, TrainingStatesEnum.Started],
    },
    orderBy: [
      {
        column: QueryTrainerTrainingsOrderByColumn.StartDate,
        order: SortOrder.Asc,
      },
    ],
  },
  {
    fetchPolicy: "no-cache",
  }
);

const training = computed(() => {
  if (route.params?.date) {
    return trainingsResult?.value?.trainerTrainings?.data;
  } else {
    return result.value?.training;
  }
});

const openProfile = (id: number | string) => {
  router.push({
    name: EntitiesEnum.TrainerUserProfile,
    params: { id, type: TrainerProfileViewEnum.BookingUser },
  });
};

const openQR = () => {
  router.push({
    name: EntitiesEnum.ProfileScan,
  });
};

const { mutate: createChatMutation, loading: chatLoading } =
  useMutation(CreateChatDocument);

const openChat = (id: number | string) => {
  createChatMutation({ participant_id: id }).then((res) => {
    router.push({
      name: EntitiesEnum.ChatPersonal,
      params: { id: res?.data?.createChat?.id },
    });
  });
};
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 24px;
}
.content__title {
  color: var(--fitnesswhite);
  font-family: "Lato";
  font-size: 16px;
  font-weight: 500;
}
.holder-content {
  .secondary {
    margin-left: 8px;
    margin-right: 8px;
  }
}

.holder-button {
  padding-inline: 24px;
  padding-bottom: calc(20px + var(--ion-safe-area-top));

  .secondary {
    margin-top: 16px;
  }
}
.list-holder-button {
  // padding-inline: 24px;
  margin: 16px 8px 0px;
  padding-bottom: calc(20px + var(--ion-safe-area-top));

  .secondary {
    margin-top: 16px;
  }
}
</style>
