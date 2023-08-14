<template>
  <div class="list">
    <div class="image">
      <img v-if="avatar" :src="avatar" class="avatar" />
      <div :class="status ? 'enable' : 'disable'"></div>
    </div>
    <div class="listItem">
      <div class="user">
        <div class="name">{{ name }}</div>
        <div class="time">{{ time }}</div>
      </div>
      <div class="msg">
        <div class="content">{{ content }}</div>
        <div class="count">{{ count }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonCol, IonGrid, IonRow } from "@ionic/vue";
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
  background: #00ff50;
  bottom: 10px;
  left: calc(100% - 10px);
}
.list {
  border-radius: 10px;
  background: #262626;
  margin: 10px;
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.avatar {
  width: 64px;
  border-radius: 50%;
}
.listItem {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 15px;
  width: 100%;
}
.image {
  width: 64px;
  position: relative;
}
.user {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.msg {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.count {
  color: #262626;
  font-family: Yantramanav;
  background: #e1dbc5;
  text-align: center;
  border-radius: 50%;
  min-width: 15px;
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
  font-family: Yantramanav;
  color: #efefef;
}
.time {
  text-align: right;
  font-size: 14px;
  color: #797979;
}
.content {
  color: #efefef;
  font-size: 14px;
  text-align: left;
  font-family: Yantramanav;
  font-weight: 100;
}
</style>
