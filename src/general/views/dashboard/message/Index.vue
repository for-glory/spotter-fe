<template>
  <div class="container">
    <div class="message">
      <ion-grid>
        <ion-row>
          <ion-col size-md="4" size-lg="4" size="4" class="border">
            <ion-searchbar class="search"></ion-searchbar>
            <div>
              <div class="tabs">
                <div :class="allStatus ? 'all' : 'unread'" @click="handleAll">
                  Chats
                </div>
                <div
                  :class="!allStatus ? 'all' : 'unread'"
                  @click="handleUnRead"
                >
                Requests
                </div>
              </div>
              <template v-if="allStatus">
                <div class="listRoom">
                  <ion-spinner v-if="loading" class="spinner" />
                  <div class="rooms__container" v-else>
                    <list-empty
                      v-if="!data.chats.length"
                      :title="currenTab"
                      :chats="false"
                    />
                    <template v-else>
                      <transition-group name="list" tag="ion-item-sliding">
                        <template v-for="room in data.chats" :key="room.key">
                          <room
                            :last-message="room.lastMessage"
                            :room-id="room.roomId"
                            :room-name="room.roomName"
                            :avatar-url="room.avatar"
                            :time="room.lastTime"
                            :is-online="isOnline(room.participantId)"
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
                  <!-- <chat-list
                    name="Alice James"
                    avatar="assets/backgrounds/avatar1.png"
                    content="Whukiuulrecises"
                    time="10 min"
                    count="1"
                    :status="true"
                  />
                  <chat-list
                    name="anfkfh James"
                    avatar="assets/backgrounds/avatar1.png"
                    content="What about other exercises"
                    time="now"
                    count="1"
                    class="enable"
                    :status="true"
                  />
                  <chat-list
                    name="Alika"
                    avatar="assets/backgrounds/avatar1.png"
                    content="What about other exercises"
                    time="20 min"
                    :status="false"
                  />
                  <chat-list
                    name="Alice James"
                    avatar="assets/backgrounds/avatar1.png"
                    content="What about other exercises"
                    time="30 min"
                    :status="true"
                  /> -->
                </div>
              </template>
              <template v-else>
              </template>
            </div>
          </ion-col>
          <ion-col size-md="8" size-lg="8" size="8" class="chatRoom">
            <div class="box" v-if="selectedRoom.id">
              <div class="header">
                <img class="chatImage" :src="selectedRoom.avatar" />
                <span class="username">{{ selectedRoom.roomName }}</span>
                <img class="ellipse" src="assets/Ellipse.svg" v-if="selectedRoom.participantId ? isOnline(selectedRoom.participantId) : false" />
              </div>
              <div class="chat">
                <personal :id="roomId"/>
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
              </div>
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
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonGrid, IonCol, IonRow, IonSearchbar, IonSpinner } from "@ionic/vue";
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

const allStatus = ref<boolean>(false);

const handleAll = () => {
  allStatus.value = true;
};
const handleUnRead = () => {
  allStatus.value = false;
};


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
});
const data = reactive({
  chats: [],
  activeUsers: [],
});

const activeTab = ref<RoomType | string>("");

const { mutate } = useMutation(DeleteChatDocument);

const currenTab = computed(() =>
  !isTrainer.value || activeTab.value === RoomType.Chat ? "chats" : "requests"
);

const isTrainer = computed(() => role === RoleEnum.Trainer);
const requests = computed(
  () => currenTab.value === RoomType.Request.toLocaleLowerCase()
);

watch(
  () => requests.value,
  () => {
    fetchChats();
  }
);


const isOnline = (id: number) => {
  return !!data.activeUsers.find((user) => user === id);
};

const onOpen = (event: CustomEvent, room: any) => {
  selectedRoom.value = room;
};

const onDelete = (e: CustomEvent, roomId: string) => {
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

  onValue(requests.value ? requestsRef : chatsRef, (snapshot) => {
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
  fetchChats();
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
  background: #262626;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.chatImage {
  width: 42px;
  height: 42px;
  border-radius: 50%;
}
.username {
  font-family: Lato;
  color: var(--fitnesswhite);
  font-size: 15px;
}
.header {
  padding: 20px;
  border-bottom: 1px solid var(--gold);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
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
.all {
  width: 30%;
  text-align: center;
  color: 2px solid #e1dbc5;
  border-bottom: 2px solid #e1dbc5;
  font-size: 16px;
  cursor: pointer;
}
.unread {
  font-size: 16px;
  text-align: center;
  width: 30%;
  border-bottom: 1px solid #efefef;
  color: #efefef;
  opacity: 0.4;
  cursor: pointer;
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
.ellipse {
  // color: #2ED47A;
  width: 6px;
  height: 6px;
  margin-left: 30px;
}
</style>
