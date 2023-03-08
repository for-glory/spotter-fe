<template>
  <ion-thumbnail slot="start" class="avatar">
    <img
      v-if="src"
      :src="src"
      class="avatar__image"
      :class="{
        'avatar__image--online': isOnline,
        'avatar__image--square': square,
      }"
    />
    <template v-else>
      {{ symbols }}
    </template>
    <div v-if="isOnline" class="avatar__online-indicator" />
  </ion-thumbnail>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { IonThumbnail } from "@ionic/vue";

defineProps<{
  src?: string | null;
  symbols?: string;
  isOnline?: boolean;
  square?: boolean;
}>();
</script>

<style lang="scss">
.avatar {
  position: relative;
  margin-top: 0;
  margin-bottom: 0;

  font-weight: 700;
  text-align: center;
  width: var(--size);
  border-radius: 50%;
  height: var(--size);
  color: var(--gray-700);
  line-height: var(--size);
  background: var(--gray-600);
  font-size: calc(var(--size) * (40 / 68));

  &__online-indicator {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--ion-color-success);
    border: 2px solid var(--gray-700);
    top: 76%;
    left: 76%;
  }
}

.avatar__image {
  &:not(.avatar__image--square) {
    border-radius: 50%;
  }
}
</style>
