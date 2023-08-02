<template>
  <static-menu />
  <ion-page class="howitworks-page" id="landing-page">
    <ion-grid :fixed="true">
      <landing-header />
    </ion-grid>

    <ion-grid :fixed="true">
      <div class="howitworks-block">
        <h1 class="ion-text-center">How it works</h1>
      </div>

      <div class="grid-container">
        <div class="grid-one">
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="12" size-lg="6">
                <div class="ion-text-center">
                  <img src="assets/step1.png" alt="" class="icon" />
                </div>
              </ion-col>
              <ion-col size="12" size-lg="6">
                <div class="step-block">
                  <div class="step-teaser">STEP 1/4</div>
                  <div class="step-title">Create your profile</div>
                  <div class="step-intro">
                    Register on the platform by filling a personal bio data
                    form. Telling us about yourself. Create your profile in
                    seconds.
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div class="grid-two">
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="12" size-lg="6">
                <div class="step-block">
                  <div class="step-teaser">STEP 2/4</div>
                  <div class="step-title">Match with trainer</div>
                  <div class="step-intro">
                    With the help of the data collected from you, we will help
                    match you with trainers that wherever you are
                  </div>
                </div>
              </ion-col>
              <ion-col size="12" size-lg="6">
                <div class="ion-text-center">
                  <img src="assets/step2.png" alt="" class="icon" />
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div class="grid-three">
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="12" size-lg="6">
                <div class="ion-text-center">
                  <img src="assets/step3.png" alt="" class="icon" />
                </div>
              </ion-col>
              <ion-col size="12" size-lg="6">
                <div class="step-block">
                  <div class="step-teaser">STEP 3/4</div>
                  <div class="step-title">Pay</div>
                  <div class="step-intro">
                    Securely book, pay and communicate in app with Stripe
                    payment gateway
                  </div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </div>

        <div class="grid-four">
          <ion-grid>
            <ion-row class="ion-align-items-center">
              <ion-col size="12" size-lg="6">
                <div class="step-block">
                  <div class="step-teaser">STEP 4/4</div>
                  <div class="step-title">Get your sweat on, do it again.</div>
                </div>
              </ion-col>
              <ion-col size="12" size-lg="6">
                <div class="ion-text-center">
                  <img src="assets/step4.png" alt="" class="icon" />
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
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
.howitworks-page {
  overflow: auto;
  font-family: Lato;
}

h1 {
  color: #e1dbc5;
  font-size: 44px;
  font-weight: bold;
}
.howitworks-block {
  padding-bottom: 32px;
}
.grid-container {
  padding: 0 160px 32px;
}

.grid-one {
  padding-bottom: 24px;
}

.grid-two {
  padding-bottom: 24px;
}

.grid-three {
  padding-bottom: 24px;
}

.grid-four {
  padding-bottom: 24px;
}

.step-teaser {
  font-size: 16px;
  color: #e1dbc5;
  padding-bottom: 16px;
}
.step-title {
  font-size: 44px;
  color: #e1dbc5;
  padding-bottom: 24px;
}
.step-intro {
  font-size: 16px;
  color: #e1dbc5;
  font-weight: 300;
  line-height: 26px;
}
.icon {
  max-width: 300px;
}

@media (max-width: 992px) {
  h1 {
    color: #e1dbc5;
    font-size: 32px;
    font-weight: bold;
  }
  .howitworks-block {
    padding-bottom: 32px;
  }
  .grid-container {
    padding: 0 0 16px;
  }

  .grid-one {
    padding-bottom: 24px;
  }

  .grid-two {
    padding-bottom: 24px;
  }

  .grid-three {
    padding-bottom: 24px;
  }

  .grid-four {
    padding-bottom: 24px;
  }
  .step-block {
    text-align: center;
    padding: 32px 16px;
  }
  .step-teaser {
    font-size: 18px;
    color: #e1dbc5;
    padding-bottom: 16px;
  }
  .step-title {
    font-size: 24px;
    color: #e1dbc5;
    padding-bottom: 18px;
  }
  .step-intro {
    font-size: 16px;
    color: #e1dbc5;
    font-weight: 300;
    line-height: 26px;
  }
}
</style>
