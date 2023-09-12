<template>
  <div class="scrolled-page">
    <div class="content">
      <router-link to="/">
        <ion-img src="assets/icon/logo-complete.png" class="logo" alt="logo" />
      </router-link>
      <div class="message-text">
        <div class="title">
          <ion-text color="primary">
            Congratulations! Payout Account created successfully
          </ion-text>
        </div>
        <div class="detail">
          <ion-text>
            Build your gym profile, create your events and gym passes
          </ion-text>
        </div>
      </div>
      <div class="buttons">
        <ion-button expand="block" @click="handleContinue">
          Set up gym profile
        </ion-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonTitle,
  IonText,
  IonImg,
  IonButton,
  IonIcon,
  IonGrid,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const router = useRouter();
const { role } = useRoles();

const handleContinue = () => {
  if (role === RoleEnum.FacilityOwner) {
    router.push({ name: EntitiesEnum.CreateFacility });
  }

  if (role === RoleEnum.Trainer) {
    router.push({ name: EntitiesEnum.FreelancerTrainer });
  }
};
</script>

<style scoped lang="scss">
.logo {
  width: 13.75rem;
  min-width: 60px;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
  min-height: calc(100% - var(--ion-safe-area-top));
}

.message-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  .title {
    padding: 0;
    margin-bottom: 22px;
    color: var(--gold);
    font-family: Lato;
    text-align: center;
    font-size: 28px;
    font-style: normal;
    font-weight: 400;
    line-height: 130%;
    max-width: 100%;
  }

  .detail {
    color: var(--ion-text-color);
    text-align: center;
    font-family: Lato;
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: 150%;
    max-width: 440px;
  }
}

.plan {
  margin-top: 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  .plan-features {
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: fit-content;

    &__item {
      display: flex;
      gap: 1rem;
    }
  }
}

.buttons {
  margin-top: 7.5rem;
  margin-top: 1rem;
  border-radius: 8px;
  width: 30%;

  @media (max-width: 992px) {
    width: 100%;
  }

  ion-button {
    margin-bottom: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 48px;
    --border-radius: 12px;
    color: var(--dark-grey, #262626);
    text-align: center;
    font-family: Lato;
    font-size: 24px;
    font-style: normal;
    line-height: 130%;
  }
}
</style>
