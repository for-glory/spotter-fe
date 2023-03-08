<template>
  <ion-item lines="none" class="exercise">
    <ion-thumbnail class="exercise__photo">
      <img :src="exercise?.previewUrl" class="exercise__img" />
    </ion-thumbnail>

    <div class="exercise__holder">
      <ion-label class="exercise__title">
        {{ sequenceNumber }}. {{ exercise?.title }}
      </ion-label>
    </div>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { IonThumbnail, IonLabel, IonItem } from "@ionic/vue";
import { ExerciseType } from "@/ts/types/store";

defineProps<{
  exercise: ExerciseType;
  sequenceNumber: number;
}>();
</script>

<style scoped lang="scss">
.exercise {
  position: relative;
  margin-bottom: 15px;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 12px;
  --background: var(--gray-700);
  --padding-start: var(--container-offset);
  --padding-end: var(--container-offset);

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;
  }

  &__header {
    display: flex;
  }

  &__title {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    margin-right: 12px;
    color: var(--ion-color-white);
  }
}
</style>
