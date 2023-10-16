<template>
  <base-layout ref="layout">
    <template #header>
      <room-header
        back-btn
        :is-online="isOnline(data.chats?.participantId)"
        :title="data.chats?.roomName || 'Tamra Dae'"
        :avatar-src="data.chats?.avatar || ''"
        @back="onBack"
      />
    </template>
    <template #content>
      <div ref="messagesContainer" :class="['messages__container', { 'user-msg-container': role === RoleEnum.User }]">
        <div>
          <template v-for="(message, idx) in data.messages" :key="message.id">
            <message
              :content="message.content"
              :timestamp="message.timestamp"
              :date="message.date"
              :content-type="message.type"
              :current-user="message.isCurUserMessage"
              :show-date="showDate(idx)"
              :approvable="isApprovable(message.type, idx)"
              :training-id="message?.trainingId"
              @delete-message="onDeleteMessage"
              :message-id="message.id"
              :deleteable="message.isCurUserMessage"
              :opponent-user="data.chats"
            />
          </template>
        </div>
      </div>
    </template>
    <template #footer>
      <room-footer @send="onSend" :disabled="data.chats?.locked" />
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import Message from "@/general/components/blocks/chat/Message.vue";
import RoomHeader from "@/general/components/blocks/chat/RoomHeader.vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { onBeforeMount, reactive, ref } from "vue";
import RoomFooter from "@/general/components/blocks/chat/RoomFooter.vue";
import { Message as MessageType } from "@/ts/types/chat";
import useRoles from "@/hooks/useRole";
import {
  ChatMessageTypeEnum,
  RoleEnum,
  SendMessageDocument,
  DeleteMessageDocument,
  ReadMessageDocument,
} from "@/generated/graphql";
import {
  mapChats,
  mapMessages,
  mapRequestMessages,
} from "@/helpers/chats/chatroom";
import { chatRoom } from "@/interfaces/chats/chatRoom";
import { activeUsersRef, chatsRef, requestsRef } from "@/firebase/db";
import { onValue } from "firebase/database";
import useId from "@/hooks/useId";
import { useMutation } from "@vue/apollo-composable";
import { EntitiesEnum } from "@/const/entities";
import { RoomType } from "@/ts/enums/chat";

const route = useRoute();
const router = useRouter();
const { role } = useRoles();

const { id } = useId();

const activeUsers = ref<number[]>([]);

const messagesContainer = ref<HTMLDivElement | null>(null);
const layout = ref<typeof BaseLayout | null>(null);
const data = reactive<{ messages: MessageType[]; chats: chatRoom[] }>({
  chats: [],
  messages: [],
});

onBeforeRouteLeave((to, from, next) => {
  to.name === EntitiesEnum.ConfirmOrder
    ? next({ name: EntitiesEnum.Dashboard })
    : next();
});

const fetchChats = async () => {
  const ref =
    route.query.type === RoomType.Request.toLocaleLowerCase()
      ? requestsRef
      : chatsRef;

  await onValue(ref, (snapshot) => {
    snapshot.forEach((childSnapshot: any) => {
      if (
        route.query.type === RoomType.Request.toLocaleLowerCase() &&
        childSnapshot.key === id &&
        route.params.id
      ) {
        const message = Object.values(childSnapshot.val()).filter(
          (i) => Number(i.id) === Number(route.params.id)
        ).length
          ? Object.values(childSnapshot.val()).filter(
              (i) => Number(i.id) === Number(route.params.id)
            )[0]
          : {};

        data.chats = {
          avatar: message?.participants?.filter(
            (i: { user_id: any }) => Number(i.user_id) === Number(id)
          )[0]?.avatar,
          roomName: message.sender_name,
          participantId: message.participants.find(
            (participant: { user_id: number }) =>
              Number(participant.user_id) !== Number(id)
          )?.user_id,
        };

        const mappedValues = mapRequestMessages([message][0]);
        data.messages.push(...mappedValues);
      } else {
        const chat = childSnapshot.val();
        if (chat?.id == route.params.id) {
          chat.participants?.forEach(
            async (user: {
              user_id: number;
              avatar: string;
              chat_name: string;
            }) => {
              if (Number(user.user_id) === Number(id)) {
                const curChat = {
                  ...chat,
                  message: Object.values(chat.messages).pop(),
                  participant: chat.participants.filter(
                    (i) => Number(i.user_id) === Number(id)
                  )[0],
                };
                data.chats = mapChats(curChat, id);
              }
            }
          );

          data.messages = Object.assign({}, mapMessages(chat, id));

          if (
            !data.messages[Object.keys(data.messages)?.pop()]?.read ||
            (data.messages[Object.keys(data.messages)?.pop()] &&
              data.messages[Object.keys(data.messages)?.pop()]?.read?.length &&
              data.messages[Object.keys(data.messages)?.pop()]?.read[0] &&
              data.messages[Object.keys(data.messages)?.pop()]?.read[0] !==
                Number(id))
          ) {
            readMessage({
              id: data.messages[Object.keys(data.messages)?.pop()]?.id,
            });
          }
        }
      }
    });
  });
};

const fetchActiveUsers = () => {
  onValue(activeUsersRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      activeUsers.value = [...activeUsers.value, childSnapshot.val()];
    });
  });
};

const isOnline = (id: number) => {
  return !!activeUsers.value.find((user) => user === id);
};

onBeforeMount(() => {
  fetchActiveUsers();
  fetchChats();
  layout?.value?.scrollToBottom();
});

const showDate = (index: number) => {
  const currentMessage = data.messages[index];
  const prevMessage = data.messages[index - 1];

  return currentMessage.date !== prevMessage?.date;
};

const isApprovable = (type: ChatMessageTypeEnum, idx: number) => {
  return (
    role === RoleEnum.Trainer &&
    type === ChatMessageTypeEnum.OperationRequired &&
    ((data.messages[Number(idx) + 1] &&
      data.messages[Number(idx) + 1]?.type !== ChatMessageTypeEnum.Cancel &&
      data.messages[Number(idx) + 1]?.type !== ChatMessageTypeEnum.Confirm) ||
      !data.messages[Number(idx) + 1])
  );
};

const { mutate: sendMessage } = useMutation(SendMessageDocument);
const { mutate: deleteMessage } = useMutation(DeleteMessageDocument);
const { mutate: readMessage } = useMutation(ReadMessageDocument);

const onSend = (
  newMessage: string | File,
  messageContentType: ChatMessageTypeEnum
) => {
  const key = messageContentType.toLowerCase();
  sendMessage({
    chat_id: route.params.id,
    input: {
      type: messageContentType,
      [key]: newMessage,
    },
  }).then(res=>{
    if (messagesContainer.value) {
      layout?.value?.scrollToBottom();
      messagesContainer.value?.scrollTo(0,messagesContainer.value.scrollHeight);
    }
  });
};

const onDeleteMessage = (id: number) => {
  deleteMessage({ id });
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.messages__container {
  height: inherit;

  &::-webkit-scrollbar {
    display: none;
  }

  &:after {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: url("../../../../public/assets/icon/chat-circles.png") 50% 50% /
      cover repeat;
  }
}

.user-msg-container {
  &:after {
    background: url("../../../../public/assets/chat-background.svg") 95% 50% /
      cover repeat;
  }
}
</style>
