<template>
  <ion-page>
    <ion-content :fullscreen="true"> TODO VIEW </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IonPage, IonContent } from "@ionic/vue";

export default defineComponent({
  name: "registration-review",
  components: {
    IonContent,
    IonPage,
  },
});
</script>
