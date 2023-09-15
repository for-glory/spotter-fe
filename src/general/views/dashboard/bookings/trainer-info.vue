<template>
    <div class="holder-content ion-padding-horizontal">
        <ion-text class="content__title">Training details</ion-text>
        <training-detail v-if="training" :event="(training as any)" :type="EntitiesEnum.Training"
            @click="openProfile(training?.user.id ?? '')" :training-address="training?.user.address?.street ?? ''" />
        <ion-button class="secondary" expand="block" @click="openQR">
            Open QR-code reader
        </ion-button>
    </div>
    <div class="holder-button">
        <ion-button class="font-bold" expand="block" @click="openChat" :disabled="chatLoading">
            Chat with client
        </ion-button>
        <ion-button class="primary-outline ion-margin-top font-bold" fill="outline" expand="block" @click="showModal"
            :disabled="trainingOnCanceling">
            Cancel training
        </ion-button>
    </div>

    <confirmation class="cancel-training-modal" :is-visible="showConfirmationModal" title="Do you want to cancel training?"
        description="Training will be deleted from your schedule" button-text="Cancel training" cancel-button-text="Cancel"
        @discard="onCancelTraining" @decline="hideModal" />
</template>
  
<script setup lang="ts">
import { IonText, IonButton, toastController } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { computed } from "vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import TrainingDetail from "@/general/components/Training.vue";
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
        cssClass: "common-toast success-toast web-toast",
        position: 'top'
    });
    return toast.present();
};

const route = useRoute();
const { result } = useQuery<Pick<Query, "training">>(TrainingDocument, {
    id: route.params.id,
});

const training = computed(() => {
    // return result.value?.training;
    return {
        user: {
            id: '2',
            title: 'Nick Fox',
            address: {
                street: 'Summer Gym, Wall Street, 24',
            },
            start_date: new Date(),
            userId: '2',
            first_name: 'Nick',
            last_name: 'Fox',
        }
    };
});

const openProfile = (id: number | string) => {
    router.push({
        name: EntitiesEnum.DashboardUserProfile,
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
    createChatMutation({ participant_id: result.value?.training.user.id || 5321 }).then(
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

.cancel-training-modal {
    :deep {
        .modal__title {
            font-family: "Lato";
            font-size: 30px;
            color: var(--ion-color-white);
            font-weight: 500;
        }
        .close-btn {
            font-size: 36px;
            height: 36px;
        }
        .modal__img {
            &::after {
                background: transparent;
            }
        }
        .modal__content {
            padding-top: 15px;
            overflow: hidden;
            margin-bottom: 36px;
        }

        .modal__footer {
            gap: 25px;
            padding: 0 8px;

            .modal__button {
                min-height: 66px;
                font-family: "Lato" !important;
                font-size: 20px;
                --border-radius: 12px;

                &.secondary {

                    --color: var(--gold) !important;
                }
            }
        }
    }
}</style>
  