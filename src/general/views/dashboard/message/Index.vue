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
                <div
                  :class="!allStatus ? 'all' : 'unread'"
                  @click="handleUnRead"
                >
                  Unread
                </div>
              </div>
              <template v-if="allStatus"> </template>
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
                <span class="username">Alice James</span>
                <img class="ellipse" src="assets/Ellipse.svg" />
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
                <div class="chatBox">
                  <div class="info">
                    <img class="avatar" src="assets/backgrounds/avatar1.png" />
                    <span class="user">Alice James</span>
                    <time class="time">Typing a message...</time>
                  </div>
                </div>
              </div>
              <div class="typing">
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
