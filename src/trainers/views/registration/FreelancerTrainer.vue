<template>
  <base-layout hide-navigation-menu>
    <template #content>
      <authentication-header back-button @back="onBack" />
      <div class="content">
        <div class="head">
          <ion-text class="title" color="primary">
            Where do you conduct your business?
          </ion-text>
          <ion-text color="secondary">
            Choose if you work in the gym or as a <br />freelancer
          </ion-text>
        </div>
        <div class="buttons">
          <ion-button
            expand="block"
            @click="navigate(EntitiesEnum.CreateProfileAccount)"
          >
            I work out of a gym
          </ion-button>
          <ion-button expand="block" @click="navigate(EntitiesEnum.Quizz)">
            I am a freelancer
          </ion-button>
          <ion-button
            expand="block"
            class="secondary"
            @click="navigate(EntitiesEnum.CreateBothProfileAccount)"
          >
            Both
          </ion-button>
        </div>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonText, IonButton } from "@ionic/vue";
import AuthenticationHeader from "@/general/components/blocks/headers/AuthenticationHeader.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const navigate = (name: EntitiesEnum) => {
  router.push({ name });
};
</script>

<style scoped lang="scss">
.header {
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: calc(100% - 337px - var(--ion-safe-area-top));
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
}

.head {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 100%;
  text-align: center;
  margin: 0 auto 32px;
}

.title {
  padding: 0;
  display: block;
  font-size: 36px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
  max-width: 100%;
  font-family: var(--title-font-family);
}

.buttons {
  margin-top: 7.5rem;
  margin-top: 1rem;
  border-radius: 8px;
  width: 30%;

  @media (max-width: 992px) {
    width: 100%;
  }

  ion-button {
    margin-bottom: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    --border-radius: 12px;
    color: var(--dark-grey, #262626);
    text-align: center;
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    line-height: 130%;

    &:last-child {
      color: var(--ion-color-white, #ffffff);
    }
  }
}
</style>
