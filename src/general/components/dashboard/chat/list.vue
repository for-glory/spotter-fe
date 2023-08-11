<template>
  <div class="list">
    <ion-grid>
      <ion-row>
        <ion-col size="3" class="pos">
          <img v-if="avatar" :src="avatar" class="avatar" />
          <div :class="{'enable': status === true, 'disable': status === false}"></div>
        </ion-col>
        <ion-col size="7" class="chat">
          <div class="name">{{ name }}</div>
          <div class="content">{{ content }}</div>
        </ion-col>
        <ion-col size="2" class="info">
          <div class="time">{{ time }}</div>
          <div>
            <div class="count">{{ count }}</div>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import {
  IonCol,
  IonGrid,
  IonRow,
  IonImg,
  IonIcon,
  IonSearchbar,
} from "@ionic/vue";
import { defineProps, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    avatar?: string;
    time?: string;
    name?: string;
    content?: string;
    count?: string;
    class?: string;
    status?: boolean;
  }>(),
  {
    avatar: "",
    time: "",
    name: "",
    content: "",
    count: "",
    class: "",
  }
);
</script>

<style scoped lang="scss">
.pos {
  position: relative;
}
.enable {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  position: absolute;
  background: green;
  top: 55px;
  left: 55px;
}
.list {
  border-radius: 10px;
  background: #222222;
  margin: 10px;
}
.avatar {
  width: 64px;
  border-radius: 50%;
}

.count {
  color: #797979;
  background: var(--gold);
  text-align: center;
  border-radius: 50%;
  width: 15px;
  font-size: 12px;
  float: right;
}
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.info {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: right;
}
.name {
  font-size: 16px;
}
.time {
  text-align: right;
  font-size: 12px;
  color: #797979;
}
.content {
  color: #797979;
  font-size: 12px;
  text-align: left;
}
</style>
