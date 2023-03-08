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
          <ion-button
            expand="block"
            @click="navigate(EntitiesEnum.LocationRate)"
          >
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
  justify-content: space-between;
  min-height: calc(100% - 337px - var(--ion-safe-area-top));
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
}

.head {
  font-size: 14px;
  font-weight: 300;
  line-height: 1.5;
  max-width: 260px;
  text-align: center;
  margin: 0 auto 32px;
}

.title {
  padding: 0;
  display: block;
  font-size: 28px;
  line-height: 1.3;
  font-weight: 400;
  margin-bottom: 20px;
  font-family: var(--title-font-family);
}

.buttons {
  .button {
    margin: 0;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
