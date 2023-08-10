<template>
  <div class="landing-footer">
    <!-- get your life back section -->
    <div class="life-back-section">
      <div>
        <div>
          <ion-text class="lg-title">Get your life back</ion-text>
        </div>
        <div class="mt-2">
          <ion-text class="sm-title"
        </div>
      </div>
      <div class="get-buttons">
        <ion-button class="get-button">
          <ion-icon class="button-icon" src="assets/icon/google-play.svg" />
          <div class="d-flex flex-direction-column align-items-start">
            <ion-text class="get-button__small-text">GET IT ON</ion-text>
            <ion-text class="get-button__text">Google Play</ion-text>
          </div>
        </ion-button>
        <ion-button class="get-button">
          <ion-icon class="button-icon" src="assets/icon/apple.svg" />
          <div class="d-flex flex-direction-column align-items-start">
            <ion-text class="get-button__small-text">Download on the</ion-text>
            <ion-text class="get-button__text">App Store</ion-text>
          </div>
        </ion-button>
      </div>
    </div>
    <!-- faq section -->
    <div class="faq-section">
      <div class="faq-box">
        <div class="d-flex justify-content-center">
          <ion-text class="md-title faq-box__title"
            >Frequently asked questions</ion-text
          >
        </div>
        <div class="faq-container">
          <faq-item
            question="What is the guarantee that my message would be replied?"
            answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
          />
          <faq-item
            question="Are my personal details secured?"
            answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
          />
          <faq-item
            question="What is your refund policy?"
            answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
          />
          <faq-item
            question="Can i delete my account?"
            answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
          />
        </div>
      </div>
      <!-- <ion-img class="bottom-vector" src="assets/landing/Bottom Vector.png" /> -->
    </div>

    <ion-grid :fixed="true" class="footer-bottom">
      <ion-row>
        <ion-col size="12" size-lg="8">
          <div class="landing-footer__menu-container">
            <div class="mobile-only">
              <ion-img
                src="assets/icon/logo-complete.png"
                class="logo"
                alt="logo"
              />
              <div class="mt-2">
                <ion-text>
                  Be in total control of your life, one session at a time.
                </ion-text>
              </div>
              <div class="mt-2 social-text">
                <ion-text> STAY IN TOUCH </ion-text>
              </div>
              <div class="landing-footer__social-links">
                <router-link to="/" class="landing-footer__social-links__link">
                  <ion-icon src="assets/icon/facebook.svg" />
                </router-link>
                <router-link to="/" class="landing-footer__social-links__link">
                  <ion-icon src="assets/icon/twitter.svg" />
                </router-link>
                <router-link to="/" class="landing-footer__social-links__link">
                  <ion-icon src="assets/icon/instagram.svg" />
                </router-link>
              </div>
            </div>

            <div class="landing-footer__menu">
              <ion-text class="landing-footer__menu-title">DOWNLOAD</ion-text>
              <div class="landing-footer__menu__links">
                <router-link to="/" class="landing-footer__menu-item">
                  iOS
                </router-link>
                <router-link to="/" class="landing-footer__menu-item">
                  Android
                </router-link>
              </div>
            </div>
            <div class="landing-footer__menu">
              <ion-text class="landing-footer__menu-title">LEGAL</ion-text>
              <div class="landing-footer__menu__links">
                <router-link to="/" class="landing-footer__menu-item">
                  Terms & Conditions
                </router-link>
                <router-link to="/" class="landing-footer__menu-item">
                  Privacy Policy
                </router-link>
              </div>
            </div>
            <div class="landing-footer__menu">
              <ion-text class="landing-footer__menu-title">RESOURCES</ion-text>
              <div class="landing-footer__menu__links">
                <router-link to="/" class="landing-footer__menu-item">
                  News and blog
                </router-link>
              </div>
            </div>
            <div class="landing-footer__menu">
              <ion-text class="landing-footer__menu-title">ABOUT US</ion-text>
              <div class="landing-footer__menu__links">
                <router-link to="/" class="landing-footer__menu-item">
                  Step-by-step instruction
                </router-link>
                <router-link to="/faqs" class="landing-footer__menu-item">
                  FAQs
                </router-link>
                <router-link to="/contact-us" class="landing-footer__menu-item">
                  Contact us
                </router-link>
              </div>
            </div>
          </div>
        </ion-col>
        <ion-col> </ion-col>
        <ion-col size="12" size-lg="3">
          <div class="w-100 d-flex justify-content-center">
            <div class="desktop-only">
              <ion-img
                src="assets/icon/logo-complete.png"
                class="logo"
                alt="logo"
              />
              <div class="mt-2">
                <ion-text>
                  Be in total control of your life, one session at a time.
                </ion-text>
              </div>
              <div class="mt-2 social-text">
                <ion-text> STAY IN TOUCH </ion-text>
              </div>
              <div class="landing-footer__social-links">
                <router-link to="/" class="landing-footer__social-links__link">
                  <ion-icon src="assets/icon/facebook.svg" />
                </router-link>
                <router-link to="/" class="landing-footer__social-links__link">
                  <ion-icon src="assets/icon/twitter.svg" />
                </router-link>
                <router-link to="/" class="landing-footer__social-links__link">
                  <ion-icon src="assets/icon/instagram.svg" />
                </router-link>
              </div>
            </div>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  </div>
</template>

<script setup lang="ts">
import { IonImg, IonCol, IonGrid, IonRow, IonIcon, IonText } from "@ionic/vue";
import FaqItem from "@/landing/components/landing/FaqItem.vue";
</script>

<style scoped lang="scss">
.landing-footer {
  font-family: Lato;

  &__banner {
    background-color: var(--gold);
    padding: 100px 0;

    &__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--gray-700);
      text-align: center;
    }
  }
  .mobile-only {
    display: none;
  }

  .desktop-only {
    display: block;
  }

  .footer-bottom {
    padding: 64px 0;
    border-top: 1px solid #494949;
  }

  &__menu-container {
    display: inline-flex;
    align-items: flex-start;
    gap: 64px;
    flex-wrap: wrap;
  }

  &__menu {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;

    &__links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
  }

  &__menu-title {
    color: var(rgba(255, 255, 255, 0.6));
    font-size: 18px;
    font-weight: 400;
  }

  &__menu-item {
    color: var(--ion-color-white);
    font-size: 16px;
    font-weight: 400;
  }

  &__social-links {
    margin-top: 8px;
    display: flex;
    gap: 24px;

    &__link {
      color: var(--main-color);
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: var(--gold);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24px;
    }
  }

  .logo {
    width: 200px;
    min-width: 60px;
  }

  .landing-menu {
    display: flex;

    &__item {
      color: var(--ion-color-white);
      margin-right: 40px;
    }
  }

  .get-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 50px;

    .get-button {
      height: 72px;
      width: 236px;
      background-color: var(--ion-color-white);
      --background: var(--ion-color-white);
      color: var(--ion-color-white-contrast);
      border-radius: 10px;
      font-family: Urbanist;

      .button-icon {
        width: 45px;
        height: 45px;
        margin-right: 8px;
      }

      &__small-text {
        font-size: 16px;
        font-weight: 700;
      }

      &__text {
        font-size: 24px;
        font-weight: 700;
      }
    }
  }

  .life-back-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
  }

  .faq-section {
    position: relative;
    padding-top: 48px;
    padding-bottom: 100px;

    .faq-box {
      max-width: 1041px;
      width: 95%;
      margin: 0 auto;
      border-radius: 50px;
      border: 3px solid var(--gold);
      background: var(--main-color);
      padding: 36px 80px 80px 80px;

      &__title {
        text-align: center;
      }

      .faq-container {
        margin-top: 60px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
    }

    .bottom-vector {
      position: absolute;
      bottom: -200px;
      z-index: -1;
      width: 100%;
    }
  }

  @media (max-width: 992px) {
    .mobile-only {
      display: block;
      margin: 0 auto;
    }

    .desktop-only {
      display: none;
    }
    .footer-bottom {
      padding: 20px;
    }

    .landing-footer__menu-container {
      flex-direction: column;
      // gap: 40px;
      width: 100%;
    }

    &__menu-container {
      display: inline-flex;
      align-items: flex-start;
      gap: 36px;
      flex-wrap: wrap;
    }

    &__menu {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      width: 100%;

      &__links {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }
    }

    &__social-links {
      margin-top: 8px;
      display: flex;
      gap: 24px;
      justify-content: center;

      &__link {
        color: var(--main-color);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--gold);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
      }
    }
    .logo {
      width: 200px;
      min-width: 60px;
      margin: 0 auto;
    }
    .social-text {
      text-align: center;
      padding: 16px 0 8px;
      font-size: 18px;
    }
    .life-back-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 64px;
      margin-top: 48px;
      padding: 0 32px;
      text-align: center;
    }

    .get-buttons {
      display: flex;
      flex-wrap: nowrap;
      gap: 16px;

      .get-button {
        height: 52px;
        width: 164px;
        border-radius: 5px;

        .button-icon {
          width: 30px;
          height: 36px;
          margin-right: 5px;
        }

        &__small-text {
          font-size: 12px;
          font-weight: normal;
        }

        &__text {
          font-size: 16px;
          font-weight: 700;
        }
      }
    }

    .faq-section {
      padding-top: 48px;
      padding-bottom: 48px;

      .faq-box {
        border-radius: 0;
        border: 1px solid var(--gold);
        padding: 18px 24px 36px 24px;

        &__title {
          text-align: center;
          font-size: 24px;
        }

        .faq-container {
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          gap: 16px;

          .faq-item {
            padding: 8px 18px;
            border-radius: 24px;
          }
        }
      }
    }
  }
}
</style>
