<template>
  <ion-menu content-id="landing-page">
    <ion-header>
      <ion-toolbar class="ion-padding">
        <router-link to="/">
          <ion-img
            src="assets/icon/logo-complete.png"
            class="logo"
            alt="logo"
          />
        </router-link>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="landing-menu">
        <router-link to="/about-us" class="landing-menu__item">
          About us
        </router-link>
        <router-link to="/contact-us" class="landing-menu__item">
          Contact us
        </router-link>
        <router-link to="/terms-of-use" class="landing-menu__item">
          Terms of use
        </router-link>
        <router-link to="/how-it-works" class="landing-menu__item">
          How it works
        </router-link>
      </div>
    </ion-content>
  </ion-menu>
</template>

<style scoped lang="scss">
.landing-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__item {
    color: var(--ion-color-white);
    text-align: center;
    font-size: 16px;
    font-style: normal;
    line-height: normal;
  }
}
</style>
