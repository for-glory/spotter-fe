<template>
  <div  :class="{'chatBox': opp === true, 'chatBox2': opp === false}">
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
    padding: 25px;
    margin-top: 10px;
    border-radius: 10px;
    background: var(--gold);
  }
  .text {
    font-family: Lato;
    font-size: 13px;
    color: #262626;
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
    padding: 25px;
    margin-top: 10px;
    border-radius: 10px;
    background: none;
  }
  .text {
    text-align: left;
    font-family: Lato;
    font-size: 13px;
    color: #797979;
  }
}
.user {
  padding: 10px;
}
.time {
  color: var(--grey-text);
}
</style>
