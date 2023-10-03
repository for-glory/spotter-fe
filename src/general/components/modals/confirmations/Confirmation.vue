<template>
  <ion-modal ref="modal" :is-open="isVisible" :backdrop-dismiss="false">
    <div :class="['wrapper', { 'user-confirm-modal': role === RoleEnum.User, 'web-modal': isWeb }]">
      <ion-icon
        src="assets/icon/close.svg"
        @click="handleCancel"
        class="close-btn"
      ></ion-icon>
      <ion-img :class="['modal__img', { 'img-opacity': !isWeb }]" src="assets/dumbbells.png" />
      <div class="ion-padding-horizontal">
        <strong class="modal__title">
          {{ title }}
        </strong>
        <div class="modal__content">
          <ion-text color="secondary" class="modal__text">
            {{ description }}
          </ion-text>
        </div>
        <div class="modal__footer">
          <ion-button @click="handleCancel" class="modal__button cancel">
            {{ cancelButtonText }}
          </ion-button>
          <ion-button @click="handleDiscard" :class="['modal__button', 'secondary', { 'white': confirmBtnWhite }]">
            {{ buttonText }}
          </ion-button>
        </div>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { IonModal, IonText, IonButton, IonIcon, IonImg } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

withDefaults(
  defineProps<{
    title: string;
    description: string;
    buttonText: string;
    isVisible: boolean;
    cancelButtonText?: string;
    confirmBtnWhite?: boolean; 
    isWeb?:boolean
  }>(),
  {
    cancelButtonText: "Cancel",
    confirmBtnWhite: false,
    isWeb: false
  }
);

const emits = defineEmits<{
  (e: "decline", isConfirmed: boolean): void;
  (e: "discard", isConfirmed: boolean): void;
}>();

const { role } = useRoles();

const handleCancel = () => {
  emits("decline", false);
};

const handleDiscard = () => {
  emits("discard", true);
};
</script>

<style scoped lang="scss">
ion-modal {
  --height: fit-content;
  --border-radius: 16px;
  padding: 16px;
}

ion-modal::part(backdrop) {
  background: rgba(0, 0, 0, 0.9);
  opacity: 1;
}

.wrapper {
  position: relative;
  text-align: center;
  padding-bottom: 24px;
}

.modal {
  &__img {
    margin-bottom: 24px;
    position: relative;
  }

  &__title {
    display: block;
    font-family: "Yantramanav", serif;
    font-weight: 500;
    padding: 0;
    font-size: 20px;
    margin-bottom: 3px;
    --color: var(--ion-color-white);
  }

  &__content {
    overflow-y: scroll;
    padding: 12px 12px 0;
    margin-bottom: 18px;
  }

  &__text {
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
  }

  &__footer {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  &__button {
    width: calc(50% - 8px);
  }
}

.img-opacity {
  &::after {
      content: "";
      background: rgba(25, 25, 27, 0.80);
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 100%;
    }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  height: 24px;
  display: block;
  min-width: 24px;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 16px;
  --min-width: 16px;
  z-index: 5;
}
.cancel-training-modal {
  .modal__title {
    font-weight: 700;
    color: var(--gold);
  }
  .modal__text {
    font-family: "Yantramanav";
  }
  .modal__footer {
    .modal__button {
      font-family: "Yantramanav";
      --color: var(--gray-700);
      &.secondary{
        --border-color: var(--gold);
        --border-width: 0.8px;
        --color: var(--fitnesswhite);
      }
    }
  }
}

.user-confirm-modal {
  .modal__text, ion-button {
    font-family: Yantramanav;
  }

  ion-button {
    font-weight: 700;
  }
   .cancel {
     color: var(--main-color);
   }

   .secondary {
    color: var(--gold);
   }

   .white {
    color: var(--fitnesswhite);
   }

}

.web-modal {
  .modal__title, .modal__text, .modal__button {
    font-family: Lato;
  }
}
</style>
