<template>
  <div class="header__container">
    <div
      :style="{
        backgroundImage: `url(assets/backgrounds/${backgroundImage}.png)`,
      }"
      class="header"
    >
      <ion-buttons class="header__buttons">
        <ion-back-button
          v-if="backButton"
          class="header-btn"
          @click="$emit('back')"
          icon="assets/icon/arrow-back.svg"
        >
        </ion-back-button>
        <ion-back-button
          v-if="closeButton"
          class="header-btn"
          @click="$emit('back')"
          icon="assets/icon/close.svg"
        >
        </ion-back-button>
      </ion-buttons>

      <ion-img
        v-if="!hiddenLogo"
        src="assets/icon/logo-complete.png"
        class="logo"
        alt="Spotter"
      />

      <div class="header__circles" />
      <slot name="title"> </slot>
      <slot name="description">
        <ion-title class="logo-description">
          <template v-if="isLogin">
            Log in or Sign Up to <br />
            Get Started
          </template>
          <template v-else-if="isRegistration">
            Sign up and Create <br />
            Your Profile
          </template>
        </ion-title>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonTitle, IonIcon, IonButtons, IonBackButton } from "@ionic/vue";
import { computed, toRefs, defineProps, withDefaults, defineEmits } from "vue";
import { AuthenticationMode } from "@/ts/enums/authentification";

const props = withDefaults(
  defineProps<{
    mode?: AuthenticationMode;
    backButton?: boolean;
    closeButton?: boolean;
    backgroundImage?: string;
    hiddenLogo?: boolean;
  }>(),
  {
    hiddenLogo: false,
    backButton: false,
    closeButton: false,
    backgroundImage: "tamra",
  }
);

defineEmits<{
  (e: "back"): void;
}>();

const { mode } = toRefs(props);

const isLogin = computed(() => mode?.value === AuthenticationMode.login);
const isRegistration = computed(
  () => mode?.value === AuthenticationMode.registration
);
</script>

<style scoped lang="scss">
.header__container {
  width: 100%;
  height: calc(337px + var(--ion-safe-area-top));
}

.header__circles {
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  content: "";
  position: absolute;
  height: calc(337px + var(--ion-safe-area-top));
  //z-index: 15;
  background: url("../../../../../public/assets/icon/quickly-blob.png") 50% 50% /
    cover no-repeat;
}

.header {
  width: 100%;
  height: 100%;
  z-index: 10;
  position: relative;
  background: 50% 50% / cover no-repeat;
  padding: calc(52px + var(--ion-safe-area-top)) 0 40px;

  &:after {
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: "";
    z-index: -10;
    position: absolute;
    pointer-events: none;
    backdrop-filter: blur(2px);
    background: rgba(var(--ion-color-black-rgb), 0.4);
  }

  &:before {
    left: 0;
    content: "";
    height: 34px;
    bottom: -2px;
    width: 100vw;
    position: absolute;
    pointer-events: none;
    z-index: 25;
    background-color: var(--gray-800);
    clip-path: polygon(0 92%, 100% 0, 100% 100%, 0 100%);
  }

  &__buttons {
    left: 0;
    right: 0;
    height: 48px;
    display: flex;
    padding: 0 12px;
    position: absolute;
    align-items: center;
    top: var(--ion-safe-area-top);
    justify-content: space-between;
  }
}

.logo {
  width: 220px;
  height: auto;
  display: block;
  min-width: 60px;
  min-height: 60px;
  margin: 5rem auto 8px;
}

.logo-description {
  font-size: 28px;
  line-height: 1.3;
  text-align: center;
  color: var(--ion-color-white);
}

.logo-title {
  font-size: 24px;
  text-align: center;
  margin-bottom: 21px;
  --color: var(--gold);
}

.header-btn {
  height: 32px;
  display: block;
  min-width: 32px;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
}
</style>
