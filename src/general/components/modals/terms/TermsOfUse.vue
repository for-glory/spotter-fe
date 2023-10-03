<template>
  <ion-modal
    ref="modal"
    :is-open="!isConfirmed && isOpen"
    :backdrop-dismiss="false"
  >
    <div class="wrapper">
      <ion-icon
        src="assets/icon/close.svg"
        @click="handleDecline"
        class="close-btn"
      ></ion-icon>

      <ion-title class="modal__title">Terms of use</ion-title>
      <div class="modal__content">
        <p :class="['modal__text', 'warning', { 'native-app': role === RoleEnum.User}]">
          <ion-text class="modal__text warning color-gold" color="success">
            Please review our terms. In case you decline them - the training
            will be skipped
          </ion-text>
        </p>
        <ion-text color="secondary" :class="['modal__text',  {'native-app': role === RoleEnum.User}]">
          What we expect from you, which establishes certain rules for using our
          services Content in Google services, which describes the intellectual
          property rights to the content you find in our services — whether that
          content belongs to you, Google, or others In case of problems or
          disagreements, which describes other legal rights you have, and what
          to expect in case someone violates these terms Understanding these
          terms is important because What we expect from you, which establishes
          certain rules for using our services Content in Google services, which
          describes the intellectual property rights to the content you find in
          our services — whether that content belongs to you, Google, or others
          In case of problems or disagreements, which describes other legal
          rights you have, and what to expect in case someone violates these
          terms Understanding these terms is important because
        </ion-text>
      </div>
      <div class="modal__footer">
        <ion-button @click="handleDecline" :class="['modal__button', 'secondary', {'native-app': role === RoleEnum.User}]">
          Decline
        </ion-button>
        <ion-button @click="handleAgree" :class="['modal__button', { 'user-confirm-btn': role === RoleEnum.User }]">
          Agree
        </ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import { IonModal, IonTitle, IonText, IonButton, IonIcon } from "@ionic/vue";
import { defineProps, defineEmits, ref } from "vue";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql"
const props = defineProps<{
  isConfirmed: boolean;
}>();

const isOpen = ref(!props.isConfirmed);

const emits = defineEmits<{
  (e: "decline", isConfirmed: boolean): void;
  (e: "agree", isConfirmed: boolean): void;
}>();

const { role } = useRoles()
const handleDecline = () => {
  isOpen.value = false;
  emits("decline", props.isConfirmed);
};

const handleAgree = () => {
  emits("agree", props.isConfirmed);
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
  padding: 24px 16px;
}

.modal {
  &__title {
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    --color: var(--ion-color-white);
  }

  &__content {
    height: 264px;
    overflow-y: scroll;
    padding: 12px 12px 0;
    margin-bottom: 12px;
  }

  &__text {
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;

    &.warning {
      margin-top: 0;
      margin-bottom: 12px;
    }
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

.close-btn {
  position: absolute;
  top: 18px;
  right: 20px;
  height: 16px;
  display: block;
  min-width: 16px;
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

.user-confirm-btn {
  color: var(--gray-700);
  font-family: Yantramanav;
  font-size: 16px;
  font-weight: 500;
}
</style>
