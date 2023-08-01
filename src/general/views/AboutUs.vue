<template>
  <static-menu />
  <ion-page class="aboutus-page" id="landing-page">
    <ion-grid :fixed="true">
      <landing-header />
    </ion-grid>

    <ion-grid :fixed="true">
      <div class="about-block">
        <h1 class="ion-text-center">About us</h1>
        <div class="detail-text ion-text-center ion-padding">
          WE ARE A MOTLEY CREW OF DREAMERS, DOERS, AND CREATORS. <br />WE CAME
          TOGETHER WITH A COMMON GOAL - TO MAKE THE WORLD BETTER AND STRONGER.
        </div>
      </div>

      <div class="goal-block">
        <h2 class="ion-text-center">Goal</h2>
        <div class="detail-text ion-text-center ion-padding">
          WE BELIEVE FITNESS IS A WAY TO CONNECT WITH OTHERS AND WITH OURSELVES
          THE INCREASINGLY DIGITAL WORLD. TO THAT END, WE CREATED SPOTTER, A
          NETWORK OF FACILITIES, PROFESSIONALS, AND ENTHUSIASTS OF ALL LEVELS
          BACKGROUNDS ALIKE.
        </div>
      </div>

      <div class="founder-block">
        <h2 class="ion-text-center meet-founder">Meet our founders</h2>

        <ion-grid>
          <ion-row>
            <ion-col size="12" size-lg="4">
              <div class="ion-text-center">
                <img src="assets/ellipse-1090-icon.svg" alt="" class="icon" />
                <div class="founder-name">RAY ESPINAL</div>
                <div class="founder-title">CEO, & CO-FOUNDER</div>
                <img src="assets/linkedin.svg" alt="" class="linkedin" />
              </div>
            </ion-col>
            <ion-col size="12" size-lg="4">
              <div class="ion-text-center">
                <img src="assets/ellipse-1090-icon2.svg" alt="" class="icon" />
                <div class="founder-name">MARGARET BRUBAKER, ESQ</div>
                <div class="founder-title">PRESIDENT & CO-FOUNDER</div>
                <img src="assets/linkedin.svg" alt="" class="linkedin" />
              </div>
            </ion-col>
            <ion-col size="12" size-lg="4">
              <div class="ion-text-center">
                <img src="assets/ellipse-1090-icon3.svg" alt="" class="icon" />
                <div class="founder-name">TAMRA DAE</div>
                <div class="founder-title">CHIEF STRATEGY OFFICER</div>
                <img src="assets/linkedin.svg" alt="" class="linkedin" />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
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

h1 {
  color: #efefef;
  font-size: 64px;
  font-weight: bold;
}

h2 {
  color: #efefef;
  font-size: 40px;
  font-weight: bold;
}
.about-block {
  padding: 16px 186px;
}
.goal-block {
  padding: 16px 186px 32px;
}
.detail-text {
  color: #afafaf;
  font-size: 16px;
  font-weight: normal;
  line-height: 26px;
}
.meet-founder {
  padding: 0 0 48px 0;
  margin: 0;
}
.founder-block {
  padding: 64px 0;
}
.founder-name {
  color: #efefef;
  font-size: 32px;
  font-weight: bold;
  padding: 32px 0 24px;
}
.founder-title {
  color: #e1dbc5;
  font-size: 24px;
  font-weight: bold;
}
.linkedin {
  padding-top: 24px;
}

@media (max-width: 992px) {
  h1 {
    color: #efefef;
    font-size: 48px;
    font-weight: bold;
    margin-top: 0;
  }

  h2 {
    color: #efefef;
    font-size: 36px;
    font-weight: bold;
    margin-top: 32px;
    margin-bottom: 16px;
  }
  .detail-text {
    color: #afafaf;
    font-size: 16px;
    font-weight: bold;
    line-height: 26px;
  }
  .about-block {
    padding: 0 32px;
  }
  .goal-block {
    padding: 0 32px;
  }
  .founder-block {
    padding: 0 0 16px 0;
  }

  .icon {
    padding-top: 32px;
  }
  .meet-founder {
    padding: 32px 0 16px;
    margin: 0;
  }

  .founder-name {
    color: #efefef;
    font-size: 24px;
    font-weight: bold;
    padding: 32px 0 24px;
  }
  .founder-title {
    color: #e1dbc5;
    font-size: 16px;
    font-weight: bold;
  }
  .linkedin {
    padding-top: 24px;
  }
}
</style>
