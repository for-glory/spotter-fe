<template>
  <div class="list-empty">
    <ion-icon src="assets/icon/heart-regular.svg" class="list-empty__icon" />
    <ion-title class="list-empty__title">No favourites here</ion-title>
    <ion-text class="list-empty__description">
      You haven't added favourites yet
    </ion-text>
    <ion-button class="list-empty__button" @click="onClick">
      Back to Dashboard
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonTitle, IonText, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";

const router = useRouter();

const onClick = () => {
  router.push({ name: EntitiesEnum.Dashboard });
};
</script>

<style scoped lang="scss">
.list-empty {
  display: flex;
  flex-direction: column;
  text-align: center;
  color: var(--gray-500);
  padding: 52vw 8px;

  &__title {
    font-family: "Yantramanav", serif;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 150%;
    margin-bottom: 8px;
  }

  &__description {
    display: block;
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
    margin-bottom: 48px;
  }

  &__icon {
    margin: auto auto 30px;
    font-size: 36px;
  }
}
</style>
