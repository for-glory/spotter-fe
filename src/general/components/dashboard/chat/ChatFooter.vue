<template>
  <div class="room-footer">
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
</template>

<script setup lang="ts">
import { IonIcon, IonTextarea, IonText } from "@ionic/vue";
import { defineEmits, defineProps, ref } from "vue";
import { usePhotoLoader } from "@/hooks/usePhotoLoader";
import { ChatMessageTypeEnum } from "@/generated/graphql";
import { dataURItoFile } from "@/utils/fileUtils";
import { uuidv4 } from "@firebase/util";

const props = defineProps<{
  disabled: boolean;
}>();

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
    openLoadOptions();
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
  background: rgba(var(--ion-color-gray-900-rgb), 0.88);
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
</style>
