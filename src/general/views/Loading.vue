<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>SPOTTER</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/login" name="actions-end">NEXT</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonButtons,
  IonTitle,
} from "@ionic/vue";

export default defineComponent({
  name: "loading-component",
  componets: {
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonButtons,
    IonTitle,
  },
});
</script>
