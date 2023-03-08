<template>
  <ion-icon
    :src="
      isFollowed ? 'assets/icon/followed.svg' : 'assets/icon/unfollowed.svg'
    "
    class="follow"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { IonIcon } from "@ionic/vue";
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  isFollowed: boolean;
}>();

const emits = defineEmits<{
  (e: "handle-click", isFollowed: boolean): void;
}>();

const onClick = () => {
  emits("handle-click", props.isFollowed);
};
</script>

<style scoped>
.follow {
  width: 48px;
  height: 48px;
}
</style>
