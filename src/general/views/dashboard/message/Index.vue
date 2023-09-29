<template>
    <div class="web-chatroom d-flex">
      <div class="flex-1 hide-scrollbar">
        <ion-searchbar class="search"></ion-searchbar>
            <div>
              <div class="tabs ion-margin-bottom">
                <div
                  :class="activeTab === RoomType.Chat ? 'tab-item tab-item__active' : 'tab-item'"
                  @click="handleTab(RoomType.Chat)">
                  {{ role === RoleEnum.User ? "Approved" : "Chats" }}
                </div>
                <div
                  :class="activeTab === RoomType.Request ? 'tab-item tab-item__active' : 'tab-item'"
                  @click="handleTab(RoomType.Request)"
                >
                {{ role === RoleEnum.User ? "Pending" : "Requests" }}
                </div>
              </div>
              <template v-if="activeTab === RoomType.Chat">
                <div class="listRoom">
                  <ion-spinner
                    v-if="loading"
                    name="lines"
                    class="spinner"
                  />
                  <div class="rooms__container" v-else>
                    <list-empty
                      v-if="!data.chats.length"
                      :title="currenTab"
                      :chats="true"
                    />
                    <template v-else>
                      <transition-group name="list" tag="ion-item-sliding">
                        <template v-for="room in data.chats" :key="room.key">
                          <room
                            v-if="room.type == RoomType.Chat"
                            :last-message="room.lastMessage"
                            :room-id="room.roomId"
                            :room-name="room.roomName"
                            :avatar-url="room.avatar"
                            :time="room.lastTime"
                            :is-online="isOnline(parseInt(room.participantId))"
                            :type="room.type"
                            @open="onOpen($event, room)"
                            @delete="onDelete($event, room.roomId)"
                            :symbols="room.symbols"
                            :unread="room.unread"
                            class="room-item__container mb-8"
                          />
                        </template>
                      </transition-group>
                    </template>
                  </div>
                </div>
              </template>
              <template v-if="activeTab === RoomType.Request">
                <div class="listRoom">
                  <ion-spinner
                    v-if="loading"
                    name="lines"
                    class="spinner"
                  />
                  <div class="rooms__container" v-else>
                    <list-empty
                      v-if="!data.chats.length"
                      :title="currenTab"
                      :chats="true"
                    />
                    <template v-else>
                      <transition-group name="list" tag="ion-item-sliding">
                        <template v-for="room in data.chats" :key="room.key">
                          <room
                            v-if="room.type == RoomType.Request"
                            :last-message="room.lastMessage"
                            :room-id="room.roomId"
                            :room-name="room.roomName"
                            :avatar-url="room.avatar"
                            :time="room.lastTime"
                            :is-online="isOnline(parseInt(room.participantId))"
                            :type="room.type"
                            @open="onOpen($event, room)"
                            @delete="onDelete($event, room.roomId)"
                            :symbols="room.symbols"
                            :unread="room.unread"
                            class="room-item__container"
                          />
                        </template>
                      </transition-group>
                    </template>
                  </div>
                </div>
              </template>
            </div>
      </div>
      <div class="flex-2">
        <div class="box" v-if="selectedRoom.id">
              <ChatHeader :avatar="selectedRoom.avatar"
                          :room-name="selectedRoom.roomName"
                          :is-online="selectedRoom.participantId ? isOnline(selectedRoom.participantId) : false" />
              <!-- <div class="chat"> -->
                <personal class="chat" :room-type="selectedRoom?.type" :id="roomId"/>
                <!-- <chat-message
                  content="your what do youe ant is nice!"
                  avatar="assets/backgrounds/avatar1.png"
                  name="You"
                  time="11:14"
                  :opp="false"
                />
                <chat-message
                  content="yefffaeafecation is efce!"
                  avatar="assets/backgrounds/avatar1.png"
                  name="Alice James"
                  time="11:15"
                  :opp="true"
                />
                <chat-message
                  content="let's play together!"
                  avatar="assets/backgrounds/avatar1.png"
                  name="Alice James"
                  time="11:15"
                  :opp="true"
                />
                <chat-message
                  content="ffehave dinner!"
                  avatar="assets/backgrounds/avatar1.png"
                  name="You"
                  time="11:16"
                  :opp="false"
                /> -->
                <!-- <div class="chatBox">
                  <div class="info">
                    <img class="avatar" src="assets/backgrounds/avatar1.png" />
                    <span class="user">Alice James</span>
                    <time class="time">Typing a message...</time>
                  </div>
                </div> -->
              <!-- </div> -->
              <!-- <div class="typing">
                <div class="inputbox">
                  <input
                    class="chatinput"
                    placeholder="Type a message..."
                    :value="message"
                    @onkeydown="(event) => (text = event.target.value)"
                  />
                </div>
                <div class="symbol" style="width: 10%">
                  <img src="assets/icon/add-file.svg" />
                  <img src="assets/icon/emoji.svg" />
                </div>
              </div> -->
            </div>
            <div v-else-if="role !== RoleEnum.User" class="d-flex align-items-center justify-content-center h-100">
              <div class="d-flex-col align-items-center m-auto">
                <ion-icon src="assets/icon/dashboard/email.svg" class="form-row fs-48"></ion-icon>
                <ion-label class="label fs-24 font-medium">Message Empty</ion-label>
                <ion-text class="label fs-16 font-light">You have no active message</ion-text>
              </div>
            </div>
            <div class="box" v-else> 
              <ChatHeader />
              <personal class="chat" :show-messages="false" :room-type="selectedRoom?.type" :id="roomId" />
            </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { IonGrid, IonCol, IonRow, IonSearchbar, IonSpinner, IonIcon, IonLabel, IonText } from "@ionic/vue";
import ChatList from "@/general/components/dashboard/chat/list.vue";
import ChatFooter from "@/general/components/dashboard/chat/list.vue";
import Message from "@/general/components/dashboard/chat/message.vue";
import Personal from "@/general/views/dashboard/message/Personal.vue"
import Room from "@/general/components/blocks/chat/Room.vue";
import { useRouter, useRoute } from "vue-router";
import { RoleEnum, DeleteChatDocument } from "@/generated/graphql";
import { EntitiesEnum } from "@/const/entities";
import { computed, onMounted, reactive, ref, onBeforeMount, watch } from "vue";
import ListEmpty from "@/general/components/blocks/chat/ListEmpty.vue";
import useRoles from "@/hooks/useRole";
import PageTabs from "@/general/components/PageTabs.vue";
import { RoomType } from "@/ts/enums/chat";
import { chatsRef, activeUsersRef, requestsRef } from "@/firebase/db";
import { onValue } from "firebase/database";
import useId from "@/hooks/useId";
import { mapChats, mapRequests } from "@/helpers/chats/chatroom";
import { useMutation } from "@vue/apollo-composable";
import ChatHeader from "@/general/components/dashboard/chat/ChatHeader.vue";

const { id } = useId();

const router = useRouter();
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
const roomId = ref('');
const selectedRoom = ref({
  avatar: "",
  roomName: "",
  id: "",
  participantId: 0
});
const data = reactive({
  chats: [
  {
      id: 1,
      lastMessage: "hi",
      roomName: "John Deo",
      lastTime: "now",
      roomId: "1",
      isOnline: true,
      time: "now",
      type: RoomType.Chat,
      symbols: 'test',
      unread: 2,
      participantId: "1",
      avatar: "https://picsum.photos/200/300"
    },
    {
      id: 2,
      lastMessage: "What about other exercises?",
      roomName: "Daniel Will",
      lastTime: "20 min",
      roomId: "1",
      isOnline: false,
      time: "now",
      type: RoomType.Chat,
      symbols: 'test',
      unread: 0,
      avatar: "https://picsum.photos/200/300",
      participantId: "1",
    },
    {
      id: 2,
      lastMessage: {
        address: "Home, Wall Street, 24"
      },
      roomName: "Daniel Will",
      lastTime: "20 min",
      roomId: "1",
      isOnline: false,
      time: "now",
      type: RoomType.Request,
      symbols: 'test',
      unread: 0,
      avatar: "https://picsum.photos/200/300",
      participantId: "2",
    }
  ],
  activeUsers: [
  {
      id: 1,
      lastMessage: "hi",
      roomName: "John Deo",
      lastTime: "now",
      roomId: "1",
      isOnline: true,
      time: "now",
      type: RoomType.Request,
      symbols: 'test',
      unread: 2,
    },
  ],
});

const activeTab = ref<RoomType | string>("CHAT");

const { mutate } = useMutation(DeleteChatDocument);

const currenTab = computed(() =>
  activeTab.value === RoomType.Chat ? "chats" : "requests"
);

const handleTab = (tab: RoomType) => {
  activeTab.value = tab;
}

const requests = computed(
  () => currenTab.value === RoomType.Request.toLocaleLowerCase()
);

watch(
  () => requests.value,
  () => {
    // fetchChats();
  }
);


const isOnline = (id: number) => {
  return !!data.activeUsers.find((user) => user.id === id);
};

const onOpen = (event: any, room: any) => {
  console.log('call open=====');
  
  selectedRoom.value = room;
  console.log(selectedRoom.value);
  
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
      chat.participants.forEach(async (user: { user_id: any }) => {
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
  console.log("---", requests.value)

  onValue(requests.value ? requestsRef : chatsRef, (snapshot) => {
    console.log("---", snapshot)
    if (data.chats.length) data.chats = [];
    if (requests.value) {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.key === id) {
          const mappedValues = mapRequests(childSnapshot.val(), id);
          data.chats.push(...mappedValues);
        }
      });
    } else {
      const chats = getChats(snapshot.val());

      chats.forEach(async (chat: any) => {
        const mappedValues = await mapChats(chat, id);
        if (!mappedValues.locked) {
          data.chats.push(mappedValues);
        }
      });
    }
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
  // fetchChats();
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
  .flex-1, .flex-2 {
    overflow: auto;
  }
}
.mb-8 {
  margin-bottom: 8px;
}
.fs-48 {
  font-size: 48px;
}
</style>
