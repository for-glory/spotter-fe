<template>
  <div class="card__container" :class="{ 'web-card': isWeb }">
    <div class="card__content">
      <ion-icon src="assets/icon/payment/plus.svg" />
      <ion-text class="card__title"> Add new card </ion-text>
    </div>

    <IonIcon class="visa-logo" src="assets/visa.svg" />
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonText } from "@ionic/vue";
interface AddCardProps {
  isWeb?: boolean
}
withDefaults(defineProps<AddCardProps>(), { isWeb: false })
</script>
<style scoped lang="scss">
.card {
  &__container {
    display: flex;
    justify-content: center;
    height: 170px;
    border-radius: 8px;
    background: var(--gray-700)
      url("../../../../../public/assets/icon/payment/visa-logo.png") no-repeat
      50% 50%;
    border: 1px solid var(--gray-600);
  }

  &__content {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 27px 20px 16px 20px;
    height: 100%;
  }
  &__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    margin-left: 10px;
  }
}

.visa-logo {
  font-size: 34px;
  position: absolute;
  top: 5px;
  right: 15px;
}

.web-card {
  background: var(--gray-700);
  max-width: 350px;
  height: 200px;
  position: relative;
  .card {
    &__title { 
      font-family: Yantramanav;
    }
  }
}
</style>
