<template>
  <ion-item-sliding>
    <ion-item @click="$emit('open')" side="end" lines="none" :class="['user-item', { 'user-request-item': (role === RoleEnum.User && type === RoomType.Request) }]">
      <avatar
        class="user-item__avatar"
        :is-online="isOnline"
        :src="avatarUrl"
        :symbols="symbols"
      />
      <div class="user-item__inner">
        <div class="w-100">
          <div class="user-item__head">
            <ion-label class="user-item__title">
              {{ roomName }}
            </ion-label>
            <ion-text class="user-item__time">{{ time }}</ion-text>
          </div>
          <ion-label class="last-message-container" v-if="lastMessage && typeof lastMessage === 'string'">
            <div
            :class="{
              'user-item__last-message--highlighted': type === RoomType.Request,
            }"
            class="user-item__last-message"
          >
            {{ lastMessage }}
          </div>
          <ion-text v-if="unread" class="user-item__unread">{{
            unread
          }}</ion-text>
          </ion-label>
          <!-- <div class="waiting-info d-flex align-items-center" v-if="role === RoleEnum.User">
            <ion-icon src="assets/icon/info.svg" />
            <p>Waiting approval</p>
          </div> -->
          <!-- class="user-item__last-message" -->
          <div
          v-else-if="lastMessage"
            class="user-item__last-message--highlighted"
          >
            <div class="last-msg-wrap">
              <ion-icon class="address-icon" src="assets/icon/location.svg" />
              <ion-text class="user-item__last-message">{{
                lastMessage?.address || "Training at client's location"
              }}</ion-text>
            </div>

            <div class="last-msg-wrap">
              <ion-icon class="time-icon" src="assets/icon/time.svg" />
              <ion-text class="user-item__last-message">{{
                lastMessage?.time || "Training on Jul 17, 8:30 PM"
              }}</ion-text>
            </div>
          </div>
        </div>
        <div>
        </div>
      </div>
    </ion-item>
    <ion-item-options class="options">
      <ion-item-option
        icon-only
        :class="{ 'option--first': type === RoomType.Request }"
        class="option"
        @click="$emit('delete')"
      >
        <ion-icon class="option__icon" src="assets/icon/delete.svg"></ion-icon>
      </ion-item-option>
      <div v-if="type === RoomType.Request" class="separator"></div>
      <ion-item-option
        v-if="type === RoomType.Request"
        icon-only
        class="option"
        @click="$emit('approve')"
      >
        <ion-icon
          color="light"
          class="option__icon option__icon-approve"
          src="assets/icon/success.svg"
        ></ion-icon>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script setup lang="ts">
import {
  IonItem,
  IonLabel,
  IonText,
  IonItemSliding,
  IonItemOption,
  IonItemOptions,
  IonIcon,
} from "@ionic/vue";
import Avatar from "@/general/components/blocks/Avatar.vue";
import { defineProps, defineEmits } from "vue";
import { RoomType } from "@/ts/enums/chat";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";

const props = defineProps<{
  roomName: string;
  avatarUrl: any;
  roomId: string;
  lastMessage: string | object;
  isOnline: boolean;
  time?: string;
  type: RoomType;
  symbols: string;
  unread?: number;
  currentTab?: string;
}>();

defineEmits<{
  (e: "open", roomId: number): void;
  (e: "delete", roomId: number): void;
  (e: "approve", roomId: number): void;
}>();

const { role } = useRoles();
</script>

<style scoped lang="scss">
.user-item {
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  --background: var(--gray-700);
  --padding-start: 16px;
  width: 100%;

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__inner {
    width: 100%;
    padding-inline-end: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__avatar {
    --size: 60px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    --border-radius: 50%;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    margin-right: 16px;
  }

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .mb-6 {
    margin-bottom: 6px;
  }

  &__unread {
    width: 18px;
    height: 18px;
    background: var(--gold);
    border-radius: 43px;
    color: var(--gray-700);
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
    display: flex;
    justify-content: center;
    font-family: "Yantramanav";
  }

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 12px;
    color: var(--fitnesswhite);
    font-family: "Yantramanav";
  }

  &__time {
    font-weight: 400;
    font-size: 14px;
    line-height: 150%;
    color: var(--gray-500);
    margin-left: auto;
    justify-self: flex-end;
    font-family: "Yantramanav";
  }

  &__last-message {
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 170px;
    font-family: "Yantramanav";
    color: var(--fitnesswhite);

    &--highlighted {
      color: var(--gold);
    }
  }
}

.option {
  background: var(--gray-600);
  border-radius: 0 8px 8px 0;

  &__icon {
    font-size: 24px;
  }
}

.options {
  background: var(--gray-600);
  border-radius: 8px;
}

.separator {
  width: 1px;
  height: 35%;
  margin: auto 5px;
  background: var(--gray-500);
}

.last-msg-wrap {
  display: flex;
  align-items: center;
  text-align: center;
}

.time-icon, .address-icon {
  font-size: 18px;
  margin-right: 5px;
}

// .address-icon {
//   font-size: 24px;
//   margin-left: 5px;
// }
.last-message-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-request-item {

  .user-item__title, 
  .user-item__last-message,
   .address-icon, 
   .time-icon {
      color: var(--gray-500);
    }
}
.waiting-info {
  margin-top: 3px;
  gap: 3px;
  ion-icon, p {
    color: var(--gray-500);
  }
  ion-icon {
    font-size: 16px;
  }
  p{
    font-size: 14px;
    margin: 0;
  }
}
</style>
