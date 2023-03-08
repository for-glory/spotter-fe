<template>
  <base-layout>
    <template #header>
      <page-header back-btn title="Session" @back="onBack" />
    </template>
    <template #content>
      <div class="holder-content ion-padding-horizontal">
        <ion-text class="content__title">Training details</ion-text>
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
      </div>
    </template>
    <template #footer>
      <div class="holder-button">
        <ion-button
          class="button--submit"
          expand="block"
          @click="openChat"
          :disabled="chatLoading"
        >
          Chat with client
        </ion-button>
        <ion-button
          class="secondary"
          expand="block"
          @click="showModal"
          :disabled="trainingOnCanceling"
        >
          Cancel training
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
import { IonText, IonButton, toastController } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import TrainingDetail from "@/general/components/Training";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { computed } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  CreateChatDocument,
  PaymentGatewayRefundDocument,
  Query,
  TrainingDocument,
} from "@/generated/graphql";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";

const router = useRouter();

const { showConfirmationModal, showModal, hideModal } = useConfirmationModal();

const onBack = () => {
  router.go(-1);
};

const {
  mutate: cancelTraining,
  onDone: trainingCanceled,
  loading: trainingOnCanceling,
} = useMutation(PaymentGatewayRefundDocument);

const onCancelTraining = () => {
  hideModal();
  cancelTraining({ input: { order_id: result.value?.training.order.id } });
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
    cssClass: "success-toast",
  });
  return toast.present();
};

const route = useRoute();
const { result } = useQuery<Pick<Query, "training">>(TrainingDocument, {
  id: route.params.id,
});

const training = computed(() => {
  return result.value?.training;
});

const openProfile = (id: number | string) => {
  router.push({
    name: EntitiesEnum.TrainerUserProfile,
    params: { id },
  });
};

const openQR = () => {
  router.push({
    name: EntitiesEnum.ProfileScan,
  });
};

const { mutate: createChatMutation, loading: chatLoading } =
  useMutation(CreateChatDocument);

const openChat = () => {
  createChatMutation({ participant_id: result.value?.training.user.id }).then(
    (res) => {
      router.push({
        name: EntitiesEnum.ChatPersonal,
        params: { id: res?.data?.createChat?.id },
      });
    }
  );
};
</script>

<style scoped lang="scss">
.header {
  margin-bottom: 24px;
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
</style>
