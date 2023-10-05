<template>
  <div class="web-chatroom d-flex">
    <div class="flex-1 hide-scrollbar">
      <ion-searchbar class="search"></ion-searchbar>
      <div>
        <div class="tabs ion-margin-bottom">
          <div :class="activeTab === RoomType.Chat ? 'tab-item tab-item__active' : 'tab-item'"
            @click="handleTab(RoomType.Chat)">
            {{ role === RoleEnum.User ? "Approved" : "Chats" }}
          </div>
          <div :class="activeTab === RoomType.Request ? 'tab-item tab-item__active' : 'tab-item'"
            @click="handleTab(RoomType.Request)">
            {{ role === RoleEnum.User ? "Pending" : "Requests" }}
          </div>
        </div>
        <template v-if="role === RoleEnum.Trainer">
          <div class="listRoom">
            <ion-spinner v-if="loading" name="lines" class="spinner" />
            <div class="rooms__container" v-else>
              <list-empty v-if="!data.requestChats.length && activeTab === RoomType.Request" :title="currenTab"
                :chats="true" />
              <list-empty v-else-if="!data.chats.length && activeTab === RoomType.Chat" :title="currenTab"
                :chats="true" />
              <!-- <template v-else> -->
              <!-- <transition-group name="list" tag="ion-item-sliding"> -->
              <template v-else v-for="room in activeTab === RoomType.Chat ? data.chats : data.requestChats"
                :key="room.key">
                <room :last-message="room.lastMessage" :room-id="room.roomId" :room-name="room.roomName"
                  :avatar-url="room.avatar" :time="room.lastTime" :is-online="isOnline(room.participantId)"
                  :type="room.type" @open="onOpen($event, room)" @delete="onDelete($event, room.roomId)"
                  :symbols="room.symbols" :unread="room.unread" class="room-item__container mb-8" />
              </template>
              <!-- </transition-group> -->
              <!-- </template> -->
            </div>
          </div>
        </template>
        <template v-else>
          <div class="listRoom">
            <ion-spinner v-if="loading" name="lines" class="spinner" />
            <div class="rooms__container" v-else>
              <list-empty v-if="!data.pendingChats.length && activeTab === RoomType.Request" :title="currenTab"
                :chats="true" />
              <list-empty v-else-if="!data.chats.length && activeTab === RoomType.Chat" :title="currenTab"
                :chats="true" />
              <!-- <template v-else> -->
              <!-- <transition-group name="list" tag="ion-item-sliding"> -->
              <template v-else v-for="room in activeTab === RoomType.Chat ? data.chats : data.pendingChats"
                :key="room.key">
                <room :last-message="room.lastMessage" :room-id="room.roomId" :room-name="room.roomName"
                  :avatar-url="room.avatar" :time="room.lastTime" :is-online="isOnline(room.participantId)"
                  :type="room.type" @open="onOpen($event, room)" @delete="onDelete($event, room.roomId)"
                  :symbols="room.symbols" :unread="room.unread" class="room-item__container mb-8" />
              </template>
              <!-- </transition-group> -->
              <!-- </template> -->
            </div>
          </div>
        </template>
      </div>
    </div>
    <div class="flex-2">
      <div class="box" v-if="selectedRoom.roomId">
        <ChatHeader :avatar="selectedRoom.avatar" :room-name="selectedRoom.roomName"
          :is-online="selectedRoom.participantId ? isOnline(selectedRoom.participantId) : false" />
        <!-- <div class="chat"> -->
        <personal class="chat" :room-id="selectedRoom.roomId"
          :room-type="role === RoleEnum.User ? RoomType.Chat : activeTab" :id="selectedRoom.userId" />
      </div>
      <div v-else class="d-flex align-items-center justify-content-center h-100">
        <div class="d-flex-col align-items-center m-auto">
          <ion-icon src="assets/icon/dashboard/email.svg" class="form-row fs-48"></ion-icon>
          <ion-label class="label fs-24 font-medium">Message Empty</ion-label>
          <ion-text class="label fs-16 font-light">You have no active message</ion-text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonSearchbar, IonSpinner, IonIcon, IonLabel, IonText } from "@ionic/vue";
import Personal from "@/general/views/dashboard/message/Personal.vue";
import Room from "@/general/components/blocks/chat/Room.vue";
import { useRoute } from "vue-router";
import { RoleEnum, DeleteChatDocument } from "@/generated/graphql";
import { computed, onMounted, reactive, ref, onBeforeMount } from "vue";
import ListEmpty from "@/general/components/blocks/chat/ListEmpty.vue";
import useRoles from "@/hooks/useRole";
import { RoomType } from "@/ts/enums/chat";
import { chatsRef, activeUsersRef, requestsRef } from "@/firebase/db";
import { onValue } from "firebase/database";
import useId from "@/hooks/useId";
import { mapChats, mapRequests } from "@/helpers/chats/chatroom";
import { useMutation } from "@vue/apollo-composable";
import ChatHeader from "@/general/components/dashboard/chat/ChatHeader.vue";
import { chatRoom } from "@/interfaces/chats/chatRoom";
import { Message } from "@/ts/types/chat";

const { id } = useId();

const route = useRoute();
const { role } = useRoles();

const tabs = [
  {
    name: RoomType.Chat,
    label: "Chats",
  },
  {
    name: RoomType.Request,
    label: "Requests",
  },
];

const loading = ref(false);
const selectedRoom = ref({
  avatar: "",
  roomName: "",
  roomId: "",
  participantId: 0.,
  type: "",
  userId: ""
});

const data = reactive<{ messages: Message[]; chats: chatRoom[]; pendingChats: chatRoom[]; requestChats: chatRoom[]; activeUsers: any[]; }>({
  chats: [],
  messages: [],
  pendingChats: [],
  activeUsers: [],
  requestChats: [],
});

const activeTab = ref<RoomType | string>("CHAT");
const chatListener = ref(false);
const requestListener = ref(false);

const { mutate } = useMutation(DeleteChatDocument);

const currenTab = computed(() =>
  activeTab.value === RoomType.Chat ? "chats" : "requests"
);

const handleTab = (tab: RoomType) => {
  activeTab.value = tab;
};

// const requests = computed(
//   () => activeTab.value === RoomType.Request
// );

// watch(
//   () => requests.value,
//   () => {
//     if(role !== RoleEnum.User){
//       fetchChats();
//     }
//   }
// );


const isOnline = (id: number) => {
  return !!data.activeUsers.find((user) => user.id === id);
};

const onOpen = (event: any, room: any) => {
  selectedRoom.value = room;
};

const onDelete = (e: any, roomId: string) => {
  mutate({
    id: roomId,
  })
    .then(() => {
      fetchChats();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getChats = (snapshot) => {
  return Object.values(snapshot).reduce((acc, chat) => {
    if (chat?.participants?.length) {
      chat.participants.forEach(async (user: { user_id: any; }) => {
        if (Number(user.user_id) === Number(id)) {
          acc.push({
            ...chat,
            message: Object.values(chat.messages).pop(),
            participant: chat.participants.filter(
              (i) => Number(i.user_id) === Number(id)
            )[0],
          });
        }
      });
    }
    acc.sort((a, b) => Number(b.message.id) - Number(a.message.id));
    return acc;
  }, []);
};

const fetchChats = () => {
  loading.value = true;
  if (!chatListener.value) {
    chatListener.value = true;
    onValue(chatsRef, (snapshot) => {
      if (data.chats.length) data.chats = [];
      if (snapshot.val()) {
        const chats = getChats(snapshot.val());
        chats.forEach(async (chat: any) => {
          const mappedValues = await mapChats(chat, id);
          if (!mappedValues.locked) {
            data.chats.push(mappedValues);
          }
          else {
            data.pendingChats.push(mappedValues);
          }
        });
      }
      loading.value = false;
    });
  }
};

const fetchRequest = () => {
  loading.value = true;
  if (!requestListener.value) {
    requestListener.value = true;
  }
  onValue(requestsRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      if (childSnapshot.key === id) {
        const mappedValues = mapRequests(childSnapshot.val(), id);
        data.requestChats.push(...mappedValues);
      }
    });
    loading.value = false;
  });
};

const fetchActiveUsers = () => {
  onValue(activeUsersRef, (snapshot) => {
    snapshot.forEach((childSnapshot) => {
      data.activeUsers = [...data.activeUsers, childSnapshot.val()];
    });
  });
};

onBeforeMount(() => {
  if (route.query.type === RoomType.Request.toLocaleLowerCase()) {
    activeTab.value = RoomType.Request;
  } else {
    activeTab.value = RoomType.Chat;
  }
});

onMounted(() => {
  fetchActiveUsers();
  fetchChats();
  fetchRequest();
});
</script>

<style scoped lang="scss">
.container {
  margin: -36px;
}

.inputbox {
  border-right: 1px solid var(--gold);
  width: 90%;
}

.chatinput {
  background-color: #222222;
  width: 100%;
  border: none;
  padding: 15px 0 30px 20px;
  color: #efefef;
}

.chatinput:visited {
  border: none;
}

.symbol {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.box {
  border-radius: 5px;
  // background: #262626;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.message {
  height: calc(100vh - 120px);

  ion-grid {
    padding: 0;
  }
}

.border {
  border-right: 1px solid var(--gold);
  padding-left: 15px;
  height: calc(100vh - 120px);
}

.chatRoom {
  padding: 25px 10px 36px 36px;
  border-radius: 5px;
}

.tabs {
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: var(--gold);
  margin-top: 20px;
  line-height: 2;
}

.typing {
  border-top: 1px solid var(--gold);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.tab-item {
  width: 34.5%;
  text-align: center;
  font-size: 16px;
  border-bottom: 1px solid #efefef;
  color: #efefef;
  opacity: 0.4;
  cursor: pointer;

  &__active {
    color: 2px solid #e1dbc5;
    border-bottom: 2px solid #e1dbc5;
    opacity: 1;
  }
}

.search {
  color: #efefef;
  font-family: Lato;
  font-size: 14px;
  margin-top: 15px;
}

.chat {
  max-height: calc(100vh - 314px);
  overflow: auto;
}

.chatBox {
  display: flex;
  padding-left: 20px;
  margin-top: 50px;
  text-align: left;
  justify-content: start;
  width: 70%;
  padding-bottom: 15px;

  .avatar {
    width: 16px;
    border-radius: 50%;
  }

  .user {
    padding-left: 10px;
    padding-right: 20px;
    font-family: Lato;
    color: var(--fitnesswhite);
    font-size: 15px;
  }

  .time {
    color: var(--grey-text);
    font-family: Poppins;
    font-size: 10px;
    font-style: italic;
  }
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}

.flex-1 {
  flex: 1;
  padding: 16px;
  position: relative;
  max-width: 375px;

  &::before {
    content: "";
    border-right: 0.5px solid var(--gray-60);
    height: 100vh;
    position: absolute;
    right: 0;
    top: 0;
  }
}

.flex-2 {
  flex: 2;
  padding: 0 30px;
}

.web-chatroom {
  height: 100%;
  overflow: hidden;

  .flex-1,
  .flex-2 {
    overflow: auto;
  }
}

.mb-8 {
  margin-bottom: 8px;
}

.fs-48 {
  font-size: 48px;
}</style>
