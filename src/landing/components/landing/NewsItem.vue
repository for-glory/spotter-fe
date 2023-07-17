<template>
  <ion-card class="news-card">
    <div class="news-card__img" :style="{backgroundImage: 'url(' + imgUrl + ')'}"></div>
    <div class="news-card__content">
      <div class="title">
        <ion-text>{{ title }}</ion-text>
      </div>
  
      <div class="detail">
        <ion-text>{{ detail }}</ion-text>
      </div>
      <div class="d-flex justify-content-center">
        <ion-button fill="clear">Read More</ion-button>
      </div>
    </div>
  </ion-card>
</template>

<script lang="ts">
export default {
  name: "NewsItem",
};
</script>

<script setup lang="ts">
import { IonCard, IonText, IonCardHeader, IonCardTitle, IonButton } from '@ionic/vue';
import { defineProps, withDefaults } from "vue";

withDefaults(
  defineProps<{
    imgUrl: string;
    title: string;
    detail: string;
    disabled: boolean;
  }>(),
  {
    disabled: false,
  }
);
</script>

<style lang="scss" scoped>
.news-card {
	font-family: Lato;
  border-radius: 16px;
  border: 3px solid var(--grey-text);
  color: var(--ion-color-white);

  &__img {
    width: 100%;
    height: 174px;
    background-position: center;
    background-size: cover;
  }
  &__content {
    border-top: 3px solid var(--grey-text);
    text-align: center;
    padding: 20px;

    .title {
      padding-bottom: 26px;
      font-family: Lato;
      font-size: 16px;
      font-style: normal;
      font-weight: 700;
      line-height: 150%;
    }
    .detail {
      padding-bottom: 36px;
      text-align: center;
      font-family: Lato;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
  }
}
</style>