<template>
  <IonHeader class="web-header" mode="ios">
    <IonToolbar class="ion-no-border">
      <IonButtons slot="start">
        <IonButton class="back-btn" v-if="backBtn" @click="$emit('back')">
          <IonIcon src="assets/icon/arrow-back.svg" />
        </IonButton>
      </IonButtons>
      <IonTitle>{{ title }}</IonTitle>
    </IonToolbar>
  </IonHeader>
</template>
<script lang="ts" setup>
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonButtons,
  IonIcon,
} from "@ionic/vue";
interface WebHeaderProps {
  title: string;
  backBtn: boolean;
}

interface WebHeaderEmits {
  (e: "back"): void;
}

withDefaults(defineProps<WebHeaderProps>(), {
  backBtn: true,
});

defineEmits<WebHeaderEmits>();
</script>
<style scoped lang="scss">
.web-header {
  ion-toolbar {
    --background: transparent;
  }

  ion-icon {
    font-size: 20px;
  }

  .back-btn {
    margin: 0;
    ion-icon {
      color: var(--gray-500);
    }
  }

  ion-title {
    font-family: Lato;
    color: var(--white, #fff);
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    margin-inline: 0;
    text-align: start;
    padding-inline: 35px;
  }
}
</style>
