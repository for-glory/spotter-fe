<template>
  <ion-page>
    <div class="auth-page">
      <ion-grid class="container">
        <ion-row>
          <ion-col size="12" size-md="7" class="container__content">
            <router-link
              to="/"
            >
              <ion-img class="logo" src="assets/icon/new-logo.png" />
            </router-link>
            <router-view />
          </ion-col>
          <ion-col size="12" size-md="5" class="background-image-section">
            <div
              class="background-image-section__img"
            >
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </ion-page>
</template>

<script lang="ts" setup>
import { IonPage, IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon, IonButton } from '@ionic/vue';
import { useRoute, useRouter } from "vue-router";
import { computed, ref } from "vue";
import { AuthenticationMode } from "@/ts/enums/authentification";
import { EntitiesEnum } from "@/const/routes";

const route = useRoute();
const router = useRouter();

const backgroundImage = ref<string>('iPhone 14');
const currentMode = computed<AuthenticationMode>(() => route.meta.mode);
const isBackButtonVisible = computed(
  () =>
    currentMode.value !== AuthenticationMode.login &&
    currentMode.value !== AuthenticationMode.registration
);

const onBack = () => {
  router.push({ name: EntitiesEnum.Login });
};
</script>
<style scoped lang="scss">
.auth-page {
  width: 100%;

  .container {
    width: 100%;
    min-height: 100vh;

    &__content {
      padding: 10px 8%;
    }
  }

  .logo {
    width: 200px;
  }
  .background-image-section {
    background-color: var(--main-color);
    background: var(--main-color);
    min-height: 100vh;

    &__img {
      background-image: url(/public/assets/backgrounds/iPhone-14.png);
      height: 100%;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }
}
</style>
