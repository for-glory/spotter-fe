<template>
  <static-menu />
  <ion-page class="aboutus-page" id="landing-page">
    <ion-grid :fixed="true">
      <landing-header />
    </ion-grid>

    <ion-grid :fixed="true">
      <div class="detail-text">
        This privacy notice for SpotterFitness Inc (doing business as Spotter)
        ("Spotter," "we," "us," or "our"), describes how and why we might
        collect, store, use, and/or share ("process") your information when you
        use our services ("Services"), such as when you:
      </div>
    </ion-grid>

    <landing-footer-static />
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonGrid } from "@ionic/vue";
import StaticMenu from "@/landing/components/landing/StaticMenu.vue";
import LandingHeader from "@/landing/components/landing/LandingHeader.vue";
import LandingFooterStatic from "@/landing/components/landing/LandingFooterStatic.vue";
</script>

<style scoped lang="scss">
.aboutus-page {
  overflow: auto;
  font-family: Lato;
}

.detail-text {
  color: #afafaf;
  font-size: 18px;
  font-weight: normal;
  line-height: 26px;
}

.detail-text ul {
  padding-left: 24px;
}

@media (max-width: 992px) {
  .detail-text {
    color: #afafaf;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
