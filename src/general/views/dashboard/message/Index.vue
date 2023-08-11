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
                  All
                </div>
                <div :class="!allStatus ? 'all' : 'unread'" @click="handleUnRead">
                  Unread
                </div>
              </div>
              <template v-if="allStatus">
              </template>
              <template v-else>
                <div class="listRoom">
                  <chat-list
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
                  />
                </div>
              </template>
            </div>
          </ion-col>
          <ion-col size-md="8" size-lg="8" size="8" class="chatRoom">
            <div class="box">
              <div class="header">
                <img class="chatImage" src="assets/backgrounds/avatar1.png" />
                <span>Alice James</span>
              </div>
              <div class="chat">
                <chat-message
                  content="your idea for this application is nice!"
                  avatar="assets/backgrounds/avatar1.png"
                  name="Alice James"
                  time="11:12"
                  :opp="true"
                />
                <chat-message
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
                />
              </div>
              <div class="typing">
                <div class="inputbox">
                  <input
                    class="chatinput"
                    :value="text"
                    @onkeydown="(event) => (text = event.target.value)"
                  />
                </div>
                <div class="symbol" style="width: 10%">
                  <img src="assets/icon/add-file.svg" />
                  <img src="assets/icon/emoji.svg" />
                </div>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonGrid, IonCol, IonRow, IonSearchbar } from "@ionic/vue";
import ChatList from "@/general/components/dashboard/chat/list.vue";
import ChatMessage from "@/general/components/dashboard/chat/message.vue";
import { ref, computed } from "vue";

const allStatus = ref<boolean>(false);

const handleAll = () => {
  allStatus.value = true;
};
const handleUnRead = () => {
  allStatus.value = false;
};
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
  color: white;
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
  background: #222222;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
.chatImage {
  width: 42px;
  border-radius: 50%;
}
.header {
  padding: 15px;
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
}
.chatRoom {
  padding: 35px 24px;
}
.tabs {
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 16px;
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
  color: 2px solid var(--gold);
  border-bottom: 2px solid var(--gold);
  cursor: pointer;
}
.unread {
  text-align: center;
  width: 30%;
  border-bottom: 2px solid #797979;
  color: #797979;
  cursor: pointer;
}
.search {
  color: var(--fitnesswhite);
  font-family: Lato;
  font-size: 14px;
  margin-top: 27px;
}
.chat {
  max-height: calc(100vh - 314px);
  overflow: auto;
}
</style>
 