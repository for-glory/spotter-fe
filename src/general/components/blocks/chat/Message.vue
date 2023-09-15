<template>
  <div
    class="message__row"
    :class="{
      'message__row--current-user': currentUser,
      'row_align-center': contentType !== ChatMessageTypeEnum.Message,
      'message__row__trainer': role === RoleEnum.Trainer
    }"
  >
    <div v-if="showDate" class="message__date">{{ date }}</div>
    <div class="message__container">
      <div class="user-detail-wrapper" v-if="contentType === ChatMessageTypeEnum.Message && role === RoleEnum.Trainer" :class="currentUser ? 'user-detail-wrapper--current-user' : ''">
        <img src="https://picsum.photos/200/300">
        <ion-label class="label">{{ currentUser ? 'You' : 'Alice James' }}</ion-label>
      </div>
      <img
        v-if="contentType === ChatMessageTypeEnum.Attachment"
        :src="`${uri}/${content}`"
        :class="{ 'message__img--current-user': currentUser }"
        class="message__img"
      />
      <div
        v-else
        v-touch:hold="presentAlert"
        :class="{
          'message__content--approved':
            contentType === ChatMessageTypeEnum.Confirm,
          'message__content--pending': contentType === ChatMessageTypeEnum.Info,
          'message__content--rejected':
            contentType === ChatMessageTypeEnum.Cancel,
          'message__content--current-user': currentUser,
          'message__content--approvable': approvable,
        }"
        class="message__content"
      >
        <div class="message__content-main justify-content-between">
          <div class="d-flex">
              <div v-if="isSystemMessage" class="system-icon__container">
              <ion-icon
                :src="`assets/icon/chat/${contentType}.svg`"
                class="system-icon"
              />
            </div>
            {{ content }}
          </div>
          <div class="d-flex" v-if="role === RoleEnum.Trainer && isSystemMessage && contentType === ChatMessageTypeEnum.Info">
              <div class="system-icon__container">
              <ion-icon
                :src="`assets/icon/location.svg`"
                class="system-icon"
              />
            </div>
           Home, Wall Street, 24
          </div>
        </div>
        <ion-popover trigger="click-trigger" trigger-action="click">
          <ion-content class="ion-padding">Delete</ion-content>
        </ion-popover>
        <div
          v-if="contentType === ChatMessageTypeEnum.Info && approvable"
          class="message__content-additional"
        >
          <template v-if="role !== RoleEnum.Trainer">
            <ion-text class="message__content-additional--primary" color="primary"
            >You have to approve or decline the order. Client is waiting...
          </ion-text>
          <br />
          </template>
          <ion-text class="message__content-additional--light" color="light">
            <ion-icon class="system-icon" src="assets/icon/info.svg" />
            You have 2 hours to approve or decline session
          </ion-text>
          <ion-progress-bar
            :value="0.8"
            class="approve-progress"
            color="light"
            v-if="role !== RoleEnum.Trainer"
          ></ion-progress-bar>
        </div>
      </div>
      <div class="message__timestamp">
        {{ timestamp }}
      </div>
    </div>
    <div v-if="approvable" class="approve-form__buttons">
      <ion-button
        class="approve-form__button"
        @click="onHandleApproveOrder"
        :disabled="loading"
      >
        <template v-if="!loading">Approve order</template>
        <ion-spinner v-else name="lines" />
      </ion-button>
      <ion-button
        class="approve-form__button secondary"
        @click="onHandleDeclineOrder"
        :disabled="loading"
      >
        <template v-if="!loading">Decline order</template>
        <ion-spinner v-else name="lines" />
      </ion-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults, defineEmits, ref } from "vue";
import {
  IonIcon,
  IonProgressBar,
  IonText,
  IonButton,
  IonContent,
  IonPopover,
  alertController,
  IonSpinner,
IonLabel,
} from "@ionic/vue";
import { useMutation } from "@vue/apollo-composable";
import {
  ChangeTrainingStateDocument,
  ChatMessageTypeEnum,
  RoleEnum,
  TrainingStatesEnum,
} from "@/generated/graphql";
import { toastController } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { RoomType } from "@/ts/enums/chat";
import useRoles from "@/hooks/useRole";

const props = withDefaults(
  defineProps<{
    contentType?: ChatMessageTypeEnum;
    content: string;
    timestamp: string;
    date: string;
    currentUser: boolean;
    showDate: boolean;
    approvable: boolean;
    trainingId?: number | null;
    messageId: number;
    deleteable: boolean;
  }>(),
  {
    contentType: ChatMessageTypeEnum.Message,
    trainingId: null,
  }
);

const uri = ref(process.env.VUE_APP_FB_STORAGE);

const router = useRouter();

const { role } = useRoles();

const emits = defineEmits<{
  (e: "delete-message", id: number): void;
}>();

const isSystemMessage = computed(() =>
  [
    ChatMessageTypeEnum.Cancel,
    ChatMessageTypeEnum.Info,
    ChatMessageTypeEnum.Confirm,
  ].includes(props.contentType)
);

const { mutate, loading } = useMutation(ChangeTrainingStateDocument);

const onDeleteMessage = () => {
  emits("delete-message", props.messageId);
};

const presentAlert = async () => {
  if (props.deleteable) {
    const alert = await alertController.create({
      header: props.content,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Delete",
          role: "confirm",
          handler: () => {
            onDeleteMessage();
          },
        },
      ],
    });

    await alert.present();
  }
};

const getErrorMessage = ({ graphQLErrors }) => {
  if (graphQLErrors.length) {
    const errsExt = graphQLErrors[0];
    if (errsExt?.debugMessage) {
      return errsExt?.debugMessage;
    }
    if (errsExt?.extensions?.validation) {
      return errsExt?.extensions?.validation["input.state"][0];
    }
  }

  return "Something went wrong. Please try again.";
};

const onHandleApproveOrder = () => {
  mutate({
    input: { id: props.trainingId, state: TrainingStatesEnum.Accepted },
  })
    .then(async () => {
      const toast = await toastController.create({
        message: "Order successfully approved",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      router.push({
        name: EntitiesEnum.ChatList,
        query: { type: RoomType.Request.toLocaleLowerCase() },
      });
    })
    .catch(async (err) => {
      const error = getErrorMessage(err);

      const toast = await toastController.create({
        message: error,
        duration: 2000,
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();
    });
};

const onHandleDeclineOrder = () => {
  mutate({
    input: { id: props.trainingId, state: TrainingStatesEnum.Rejected },
  })
    .then(async () => {
      const toast = await toastController.create({
        message: "Order successfully declined",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
      router.push({
        name: EntitiesEnum.ChatList,
        query: { type: RoomType.Request.toLocaleLowerCase() },
      });
    })
    .catch(async (err) => {
      const error = getErrorMessage(err);
      const toast = await toastController.create({
        message: error,
        duration: 5000,
        icon: "assets/icon/info.svg",
        cssClass: "danger-toast",
      });
      toast.present();
    });
};
</script>

<style scoped lang="scss">
.user-detail-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  &--current-user {
    justify-content: flex-end;
  }
  img {
    width: 16px;
    height: 16px;
    object-fit: cover;
    border-radius: 50%;
  }
  .label{
    font-family: "Lato";
    font-size: 15px;
    font-weight: 500;
    color: var(--fitnesswhite);
    margin: 0;
  }
}
.message {
  &__row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 16px;

    &--current-user {
      align-items: flex-end;
      justify-items: flex-end;
    }
  }

  &__date {
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    margin: 12px auto 24px;
    font-family: "Yantramanav";
    color: var(--gray-500);
  }

  &__content {
    display: flex;
    gap: 6px;
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 12px;
    border-radius: 2px 8px 8px 8px;
    max-width: 75vw;
    white-space: normal;
    background: var(--gray-700);
    font-weight: 400;
    font-size: 14px;
    color: var(--fitnesswhite);
    line-height: 1.5;
    font-family: "Yantramanav";

    &-main {
      display: flex;
      gap: 8px;
    }

    &-additional {
      &--primary {
        display: block;
      }

      &--light {
        display: flex;
        gap: 3px;
        margin-bottom: 3px;
      }
    }

    &--current-user {
      border-radius: 8px 8px 2px 8px;
      background: var(--gold);
      color: var(--gray-700);
    }

    &--approved {
      color: var(--ion-color-success-tint);
    }

    &--rejected {
      color: var(--ion-color-danger-tint);
    }

    &--pending {
      color: var(--gold);
    }

    &--approvable {
      max-width: 90vw;
    }
  }

  &__timestamp {
    color: var(--gray-500);
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    text-align: end;
    margin-top: 4px;
  }

  &__img {
    border-radius: 2px 8px 8px 8px;
    max-width: 60vw;

    &--current-user {
      border-radius: 8px 8px 2px 8px;
    }
  }
}

.system-icon {
  font-size: 20px;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;

  &__container {
    width: 22px;
    padding-right: 14px;
  }
}

.approve-form {
  &__buttons {
    display: flex;
    margin: 24px -10px 0;
    width: calc(100% + 20px);
    justify-content: space-between;
  }

  &__button {
    margin: 0 10px;
    width: calc(100% - 20px);
  }
}

.message__row__trainer {
  &.row_align-center {
    align-items: center;
    .approve-form__buttons {
      width: auto;
    }
  }
  .message__content {
    gap: 0;
    &-additional{
      border-top: 0.5px solid var(--gray-600);
      padding-top: 12px;
      margin-top: 6px;
      border-bottom: 1.4px solid var(--gray-500);
    }
    background: #E1DBC4;
    border-radius: 1px 8px 8px 8px;
    padding: 16px;
    color: var(--main-color);
    font-family: "Lato";
    font-size: 16px;
    &--current-user {
      background: transparent;
      color: var(--fitnesswhite);
      border: 1px solid #E4E9EE;
      border-radius: 8px 0px 8px 8px;
    }
  }
  .message__timestamp {
      font-family: "Yantramanav";
    }
  .message__content-additional--light {
    color: var(--gray-500);
  }
}
</style>
