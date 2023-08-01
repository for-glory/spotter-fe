<template>
  <static-menu />
  <ion-page class="terms-page" id="landing-page">
    <ion-grid :fixed="true">
      <landing-header />
    </ion-grid>

    <ion-grid :fixed="true">
      <h1 class="ion-text-center boxed-title">TERMS OF USE</h1>
      <div class="content-box">
        <div class="sub-heading-text">
          This privacy notice for SpotterFitness Inc (doing business as Spotter)
          ("Spotter," "we," "us," or "our"), describes how and why we might
          collect, store, use, and/or share ("process") your information when
          you use our services ("Services"), such as when you:
        </div>
        <div class="detail-text">
          <ul class="">
            <li>
              Visit our website at https://spotterfitness.com, or any website of
              ours that links to this privacy notice
            </li>
            <li>
              Download and use our mobile application (SpotterFitness App), or
              any other application of ours that links to this privacy notice
            </li>
            <li>
              Engage with us in other related ways, including any sales,
              marketing, or events
            </li>
          </ul>
        </div>
        <div class="sub-heading-text">Questions or Concerns</div>
        <div class="detail-text">
          Reading this privacy notice will help you understand your privacy
          rights and choices. If you do not agree with our policies and
          practices, please do not use our Services. If you still have any
          questions or concerns, please contact us at ray@spotterfitness.com.
        </div>
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
.terms-page {
  overflow: auto;
  font-family: Lato;
}

.boxed-title {
  color: #efefef;
  font-size: 96px;
  font-weight: bold;
  padding: 72px 0;
  margin: 0;
  background-color: #e1dbc51a;
}

.content-box {
  padding: 48px 72px;
}
.sub-heading-text {
  color: #efefef;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 24px;
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
  .boxed-title {
    color: #efefef;
    font-size: 36px;
    padding: 16px 0;
  }

  .content-box {
    padding: 8px 16px;
  }

  .sub-heading-text {
    color: #efefef;
    font-size: 18px;
    margin-bottom: 18px;
  }

  .detail-text {
    color: #afafaf;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
