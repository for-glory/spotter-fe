<template>
  <static-menu />
  <ion-page class="faqs-page" id="landing-page">
    <ion-grid :fixed="true">
      <landing-header />
    </ion-grid>

    <ion-grid :fixed="true">
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
              question="What is Spotter?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="What makes Spotter unique?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="I am new to fitness. How can Spotter help me?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="I am a trainer. How can I join?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="I am a gym owner. How can I join?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="How do I pay for the Gym or Trainer?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="Do you offer discounts?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="What is Spotter??"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="Where can I download the app?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
            <faq-item
              question="Is your network limited to just gyms and trainers?"
              answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients."
            />
          </div>
        </div>
      </div>
    </ion-grid>
    <ion-grid :fixed="true">
      <div class="contactform-box">
        <div class="form-header">
          <div class="haveAQuestionForOurTeam">Still got a question?</div>
          <div class="sendUsAnEmail">Ask anything</div>
        </div>

        <div class="form-input-container">
          <ion-grid>
            <ion-row>
              <ion-col size="12" size-lg="4">
                <label class="label form-input-label" for="name">Name</label>
                <input
                  class="w-100 form-input-text"
                  type="email"
                  name="name"
                  id="name"
                  placeholder="Gabby Artem Rodney"
                  required
                />
              </ion-col>
              <ion-col size="12" size-lg="4">
                <label class="label form-input-label" for="email"
                  >Email address</label
                >
                <input
                  class="w-100 form-input-text"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="spotter@example.com"
                  required
                />
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col>
                <textarea
                  placeholder="Type your message..."
                  class="w-100 form-input-textarea"
                  name="message"
                  id="message"
                  required
                ></textarea>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col class="ion-text-center">
                <div class="form-input-note">
                  Your email will be responded to as soon as we can
                </div>
                <button class="form-input-button">
                  <div class="form-input-button-text">Submit message</div>
                </button>
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
import FaqItem from "@/landing/components/landing/FaqItem.vue";
</script>

<style scoped lang="scss">
.faqs-page {
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

.faq-section {
  position: relative;
  padding-bottom: 32px;

  .faq-box {
    max-width: 1041px;
    width: 95%;
    margin: 0 auto;
    border-radius: 50px;
    padding: 36px 16px;

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
}
.contactform-box {
  align-items: flex-start;
  outline: solid 3px #fff9;
  outline-offset: -3px;
  border-radius: 24px;
  margin-bottom: 72px;
}
.form-header {
  padding: 72px 108px 0;
}
.haveAQuestionForOurTeam {
  color: #efefef;
  font-size: 64px;
  font-weight: bold;
}
.sendUsAnEmail {
  color: #e1dbc5;
  font-size: 32px;
  padding-top: 24px;
}
.form-input-container {
  position: relative;
  margin: 32px 100px;
}
.form-input-text {
  border: 1px solid #fff9;
  color: #797979;
  border-radius: 8px;
  background: #202020;
  padding: 12px 16px;
  font-size: 14px;
}
.form-input-textarea {
  border: 1px solid #e1dbc5;
  color: #797979;
  background: #202020;
  padding: 24px;
  font-size: 14px;
  line-height: 150%;
  margin-top: 32px;
  height: 240px;
}
.form-input-note {
  color: #afafaf;
  font-size: 14px;
  line-height: 130%;
  font-weight: 300;
  padding: 24px 16px;
}

label {
  color: #e1dbc5;
}
.form-input-button {
  width: 544px;
  height: min-content;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 13.0398px;
  background-color: #e1dbc5;
  margin-bottom: 32px;
}
.form-input-button-text {
  color: #262626;
  font-size: 24px;
  line-height: 130%;
  font-weight: 500;
  width: min-content;
  height: min-content;
  text-align: center;
  align-items: center;
  white-space: nowrap;
  flex-direction: column;
}

@media (max-width: 992px) {
  .detail-text {
    color: #afafaf;
    font-size: 16px;
    line-height: 24px;
  }

  .faq-section {
    padding-top: 0;
    padding-bottom: 0;

    .faq-box {
      border-radius: 0;
      padding: 8px 24px 36px 24px;

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
  .contactform-box {
    align-items: flex-start;
    outline: solid 1px #fff9;
    outline-offset: -3px;
    border-radius: 0;
    margin-bottom: 0;
  }
  .form-header {
    text-align: center;
    padding: 16px 0;
  }
  .haveAQuestionForOurTeam {
    color: #efefef;
    font-size: 16px;
    font-weight: bold;
    padding-top: 16px;
  }
  .sendUsAnEmail {
    color: #e1dbc5;
    font-size: 16px;
    padding-top: 16px;
  }
  .form-input-container {
    position: relative;
    margin: 16px 24px 24px 24px;
  }
  .form-input-text {
    padding: 12px 16px;
    margin-bottom: 8px;
  }
  .form-input-textarea {
    border: 1px solid #e1dbc5;
    color: #797979;
    background: #202020;
    padding: 24px;
    font-size: 14px;
    line-height: 150%;
    margin-top: 24px;
    height: 320px;
  }
  .form-input-button {
    width: 260px;
    height: min-content;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: 13.0398px;
    background-color: #e1dbc5;
    margin-bottom: 32px;
  }
  .form-input-button-text {
    color: #262626;
    font-size: 16px;
    line-height: 130%;
    font-weight: 500;
    width: min-content;
    height: min-content;
    text-align: center;
    align-items: center;
    white-space: nowrap;
    flex-direction: column;
  }
}
</style>
