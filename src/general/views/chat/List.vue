<template>
  <base-layout :hide-navigation-menu="!isTrainer">
    <template #header>
      <page-header
        :back-btn="!isTrainer"
        :title="title"
        class="page-header"
        @back="onBack"
      />
    </template>
    <template #content>
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
                @open="onOpen($event, room.roomId)"
                @delete="onDelete($event, room.roomId)"
                :symbols="room.symbols"
                :unread="room.unread"
                class="room-item__container"
              />
            </template>
          </transition-group>
        </template>
      </div>
    </template>
  </base-layout>
  <page-tabs
    v-if="isTrainer"
    :tabs="tabs"
    class="page-tabs"
    @change="tabsChanged"
    :value="activeTab"
  />
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
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
import { IonSpinner } from "@ionic/vue";

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
const data = reactive({
  chats: [],
  activeUsers: [],
});

const activeTab = ref<RoomType | string>("");

const { mutate } = useMutation(DeleteChatDocument);

const title = computed(() =>
  !isTrainer.value || activeTab.value === RoomType.Chat
    ? "Chat History"
    : "Requests"
);

const currenTab = computed(() =>
  !isTrainer.value || activeTab.value === RoomType.Chat ? "chats" : "requests"
);

const isTrainer = computed(() => role === RoleEnum.Trainer);
const requests = computed(
  () => route.query.type === RoomType.Request.toLocaleLowerCase()
);

watch(
  () => requests.value,
  () => {
    fetchChats();
  }
);

const tabsChanged = (ev: RoomType) => {
  if (ev) activeTab.value = ev;
  if (ev === RoomType.Request) {
    router.push({
      name: EntitiesEnum.ChatList,
      query: { type: RoomType.Request.toLocaleLowerCase() },
    });
  } else {
    router.push({
      name: EntitiesEnum.ChatList,
    });
  }
};

const onBack = () => {
  router.go(-1);
};

const onOpen = (event: CustomEvent, roomId: string) => {
  router.push({
    name: EntitiesEnum.ChatPersonal,
    params: { id: roomId },
    query: {
      type: route.query.type ? route.query.type : "",
    },
  });
};

const isOnline = (id: number) => {
  return !!data.activeUsers.find((user) => user === id);
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
.page-header {
  margin-bottom: 24px;
}

.rooms__container {
  padding: 0 16px;
}

.room-item__container {
  width: 100%;
  margin-bottom: 8px;
}

.page-tabs {
  left: 0;
  right: 0;
  display: flex;
  z-index: 21000;
  position: fixed;
  align-items: center;
  pointer-events: none;
  flex-direction: column;
  justify-content: center;
  bottom: calc(84px + var(--ion-safe-area-bottom));
  --btn-min-width: 120px;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.8s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.list-leave-active {
  position: absolute;
}

.spinner {
  display: block;
  margin: 30vh auto;
}
</style>
