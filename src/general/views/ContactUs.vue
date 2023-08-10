<template>
  <static-menu />
  <ion-page class="contactus-page" id="landing-page">
    <ion-grid :fixed="true">
      <landing-header />
    </ion-grid>

    <ion-grid :fixed="true">
      <div class="contactform-box">
        <div class="form-header">
          <div class="haveAQuestionForOurTeam">
            Have a question for our team?
          </div>
          <div class="sendUsAnEmail">Send us an email</div>
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
                  placeholder="First name and Last name"
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
              <ion-col size="12" size-lg="4">
                <label class="label form-input-label" for="phone"
                  >Phone no</label
                >
                <input
                  class="w-100 form-input-text"
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="800-976-5678"
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
</script>

<style scoped lang="scss">
.contactus-page {
  overflow: auto;
  font-family: Lato;
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
  padding-top: 32px;
}
.form-input-container {
  position: relative;
  margin: 64px 100px;
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
  margin-top: 64px;
  height: 360px;
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
