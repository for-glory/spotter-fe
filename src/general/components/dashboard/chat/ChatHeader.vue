<template>
  <div class="header-wrapper">
    <div class="header">
      <img class="chatImage" v-if="avatar" :src="avatar" />
      <span class="username">{{ roomName }}</span>
      <img class="ellipse" src="assets/Ellipse.svg" v-if="isOnline" />
    </div>
    <div class="header-info" v-if="role === RoleEnum.User">
      <div class="timestamp">Jul 17, 2022</div>
      <IonButton fill="clear" color="medium" class="more-btn" shape="round"> 
        <IonIcon src="assets/icon/more.svg" />
      </IonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ChatHeaderPops {
  avatar?: string,
  roomName?: string,
  isOnline?: boolean
}

import { RoleEnum } from '@/generated/graphql';
import useRoles from '@/hooks/useRole';
import { IonButton, IonIcon } from '@ionic/vue';

defineProps<ChatHeaderPops>()

const { role } = useRoles()
</script>
<style lang="scss" scoped>
.header-wrapper {
  padding: 20px 20px 0;
  .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    padding-bottom: 5px;
    min-height: 70px;
    border-bottom: 1px solid var(--gray-60);
  }
}

.header-info {
  display: flex;
  align-items: center;
  padding: 4px 10px;
  .timestamp {
    flex: 2;
    text-align: center;
  }
}

.more-btn {
  --border-radius: 50%;
    margin: 0;
    width: 43px;
    height: 38px;

    &::part(native){
      padding: 0;
    }
}

.timestamp {
  color: var(--gray-500);
  text-align: center;
  font-family: Yantramanav;
  font-size: 12px;
  font-weight: 500;
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

.ellipse {
  width: 6px;
  height: 6px;
  margin-left: 30px;
}
</style>