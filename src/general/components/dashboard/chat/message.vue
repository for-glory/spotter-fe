<template>
  <div :class="opp ? 'chatBox' : 'chatBox2'">
    <div class="info">
      <img class="avatar" :src="avatar" />
      <span class="user">{{ name }}</span>
      <time class="time">{{ time }}</time>
    </div>
    <div class="border">
      <div class="text">{{ content }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults, defineEmits, ref } from "vue";

const props = withDefaults(
  defineProps<{
    avatar?: string;
    time?: string;
    name?: string;
    content?: string;
    opp?: boolean;
  }>(),
  {
    avatar: "",
    time: "",
    name: "",
    content: "",
  }
);
</script>

<style scoped lang="scss">
.chatBox {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  margin-top: 50px;
  margin-bottom: 50px;
  text-align: left;
  justify-content: start;
  width: 70%;

  .avatar {
    width: 16px;
    border-radius: 50%;
  }
  .border {
    border: 1px solid var(--gold);
    padding: 20px;
    margin-top: 10px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    background: var(--gold);
  }
  .text {
    font-family: Lato;
    font-size: 13px;
    color: #262626;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: start;
  }
}
.chatBox2 {
  display: flex;
  width: 70%;
  flex-direction: column;
  justify-content: end;
  padding-right: 20px;
  margin-bottom: 50px;
  display: flex;
  float: right;
  text-align: right;
  .avatar {
    width: 16px;
    border-radius: 50%;
  }
  .border {
    border: 1px solid var(--gold);
    padding: 20px;
    margin-top: 10px;
    background: none;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    border-top-left-radius: 10px;
  }
  .text {
    text-align: left;
    font-family: Lato;
    font-size: 13px;
    color: #797979;
  }
  .info {
    display: flex;
    align-items: center;
    justify-content: end;
  }
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
}
</style>
