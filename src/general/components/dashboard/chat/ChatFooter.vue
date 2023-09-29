<template>
  <div class="room-footer" v-if="role !== RoleEnum.Trainer">
    <div
      :class="{ 'room__footer__input--disabled': disabled }"
      class="room-footer__input"
    >
      <ion-icon
        @click="handleOpenLoadOptions"
        src="assets/icon/clip.svg"
        :class="{ 'file-input--disabled': disabled }"
        class="file-input"
      />
      <ion-textarea
        :rows="1"
        :auto-grow="true"
        v-model="messageText"
        :disabled="disabled"
        placeholder="Type message"
        class="room-footer__textarea"
      />
      <ion-text
        v-if="messageText"
        @click="handleSend"
        class="send-message__button"
      >
        Send
      </ion-text>
    </div>
  </div>
  <div v-else class="room-footer-trainer d-flex align-items-center">
    <div class="room-footer-trainer__input">
      <ion-textarea
        :rows="1"
        :auto-grow="true"
        v-model="messageText"
        :disabled="disabled"
        placeholder="Type a message..."
      />
    </div>
    <div class="room-footer-trainer__icons">
      <ion-icon
        @click="handleOpenLoadOptions"
        src="assets/icon/attach.svg"
        :disabled="disabled"
      />
      <ion-icon v-if="!messageText"
        src="assets/icon/emoji.svg"
        :disabled="disabled"
      />
      <ion-text
        v-else
        @click="handleSend"
        class="room-footer-trainer__send"
      >
        Send
      </ion-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonTextarea, IonText } from "@ionic/vue";
import { defineEmits, defineProps, ref } from "vue";
import { usePhotoLoader } from "@/hooks/usePhotoLoader";
import { ChatMessageTypeEnum, RoleEnum } from "@/generated/graphql";
import { dataURItoFile } from "@/utils/fileUtils";
import { uuidv4 } from "@firebase/util";
import useRoles from "@/hooks/useRole";

const props = defineProps<{
  disabled: boolean;
}>();

const { role } = useRoles();

const emits = defineEmits<{
  (
    e: "send",
    messageValue: string | undefined,
    messageContentType: ChatMessageTypeEnum
  ): void;
}>();

const messageText = ref("");

const sendPhoto = (photoValue: string) => {
  const file = dataURItoFile(photoValue, uuidv4());
  emits("send", file, ChatMessageTypeEnum.Attachment);
};

const { openLoadOptions } = usePhotoLoader(sendPhoto);

const handleOpenLoadOptions = () => {
  if (!props.disabled) {
    openLoadOptions(undefined, role === RoleEnum.User ? true : false);
  }
};

const handleSend = () => {
  if (messageText.value && !props.disabled) {
    emits("send", messageText.value, ChatMessageTypeEnum.Message);
    messageText.value = "";
  }
};
</script>

<style scoped lang="scss">
.room-footer {
  position: relative;
  // background: rgba(var(--ion-color-gray-900-rgb), 0.88);
  min-height: calc(68px + var(--ion-safe-area-bottom));
  padding: 10px 24px calc(10px + var(--ion-safe-area-bottom));

  &__input {
    position: relative;

    &--disabled:after {
      content: "";
      position: absolute;
      top: -5px;
      left: -3px;
      width: calc(100% + 5px);
      height: 60px;
      z-index: 25;
      background: rgba(24, 24, 24, 0.64);
    }
  }

  &__textarea {
    margin: 0;
    max-height: 132px;
    background: var(--gray-800);
    border: 0.8px solid var(--gray-600);
    border-radius: 8px;
    color: var(--ion-color-white);
    --padding-start: 58px;
    --padding-end: 58px;
    --padding-top: 12px;
    --padding-bottom: 13px;
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;

    &:deep(textarea) {
      max-height: 130px;
      overflow-y: auto;
      overflow-x: hidden;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }
  }
}

.file-input {
  position: absolute;
  top: 50%;
  left: 16px;
  font-size: 24px;
  margin-top: -0.5em;
  z-index: 15;
  padding-right: 9px;
  color: var(--ion-color-white);

  &:before {
    top: 50%;
    right: 0;
    content: "";
    height: 20px;
    margin-top: -10px;
    position: absolute;
    border-right: 1px solid var(--gray-600);
  }

  &--disabled {
    color: var(--gray-600);
  }
}

.send-message__button {
  position: absolute;
  top: 50%;
  right: 20px;
  margin-top: -11px;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  z-index: 25;
  color: var(--gold);
}
.room-footer-trainer {
  min-height: 72px;
  padding-left: 16px;
  width: 100%;
  border-top: 0.8px solid var(--gray-600);
  overflow: hidden;
  &__input,&__icons {
    height: 100%;
    padding-bottom: 16px;
    display: flex;
    align-items: center;
  }
  &__input {
    border-right: 0.8px solid var(--gray-600);
    flex: 2;
    padding-top: 16px;
    padding-right: 16px;
    overflow: hidden;
    ion-textarea {
      margin: 0;
      font-family: "Poppins";
      font-size: 13px;
      font-style: normal;
      font-weight: 400;
      --color: var(--fitnesswhite);
      max-height: 132px;
    }
  }
  &__icons {
    padding-left: 12px;
    gap: 12px;
    flex: 1;
    max-width: 120px;
    padding-top: 16px;
    ion-icon {
      font-size: 20px;
      color: var(--fitnesswhite);
      &[disabled = "true"] {
        color: var(--gray-600);
        pointer-events: none;
      }
    }
  }
  &__send {
    color: var(--gold);
    font-family: "Lato";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    margin-left: 6px;
  }
}
</style>
