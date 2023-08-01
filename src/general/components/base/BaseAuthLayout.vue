<template>
    <div class="auth-page">
      <div class="auth-page__header" v-if="!hideHeader">
        <landing-header
          hideAuthBtn
          fixed
        />
      </div>
      <ion-grid class="container">
        <ion-row>
          <ion-col size="12" size-md="7" class="container__content" :class="hideHeader?'padding-small':''">
            <slot name="left-section"></slot>
          </ion-col>
          <ion-col size="12" size-md="5">
            <div class="background-image-section">
              <ion-img
                class="background-image-section__img"
                :src="`assets/backgrounds/${backgroundImage}.png`"
              />
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { IonPage, IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon, IonButton } from '@ionic/vue';
  import LandingHeader from "@/landing/components/landing/LandingHeader.vue";
  import { useRoute, useRouter } from "vue-router";
  import { computed, ref, defineProps } from "vue";
  import { AuthenticationMode } from "@/ts/enums/authentification";
  import { EntitiesEnum } from "@/const/entities";

  const props = defineProps<{
    hideHeader?: boolean;
  }>();
  
  const route = useRoute();
  const router = useRouter();
  
  const currentMode = computed<AuthenticationMode>(() => route.meta.mode);
  const backgroundImage = computed(
    () =>{
      if (currentMode.value === AuthenticationMode.login) return "iPhone-14-1";
      else if (currentMode.value === AuthenticationMode.registration) return "iPhone-14-2";
      else if (currentMode.value === AuthenticationMode.SelectRole) return "iPhone-14-3";
      else if (currentMode.value === AuthenticationMode.CheckEmail) return "iPad-6";
      else if (currentMode.value === AuthenticationMode.ChooseFacilityType) return "iPhone-14-5";
      else if (currentMode.value === AuthenticationMode.CreateFacility) return "iPhone-14-7";
      else if (currentMode.value === AuthenticationMode.CreateEvent) return "iPhone-14-8";
      else if (currentMode.value === AuthenticationMode.CreateWorkout) return "iPhone-14-4";
      else return "iPhone-14-1";
    }
  );
  
  const onBack = () => {
    router.push({ name: EntitiesEnum.Login });
  };
  </script>
  <style scoped lang="scss">
  .auth-page {
    width: 100%;
    min-height: 100vh;
    position: relative;
  
    &__header {
      padding: 0 8%;
    }
  
    .container {
      width: 100%;
  
      &__content {
        padding: 120px 8% 0 8%;
        height: 100vh;
        overflow: auto;
      }

      .padding-small {
        padding: 20px !important;
      }
    }
  
    .logo {
      width: 200px;
    }
    .background-image-section {
      background-color: var(--main-color);
      background: var(--main-color);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
  
      &__img {
        max-width: 100%;
        height: 90vh;
        object-fit: contain;
      }
    }
  }
  </style>
  