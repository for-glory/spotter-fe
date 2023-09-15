<template>
  <ion-content>
    <ion-button expand="block" @click="setOpen(true)">Send</ion-button>
    <ion-modal id="modal" :is-open="isOpen" :backdrop-dismiss="false">
      <div class="logo">
        <router-link to="/">
          <ion-img src="assets/icon/logo-complete.png" alt="logo" />
        </router-link>
      </div>
      <ion-title class="title"
        >Payment Succesfully <br />
        Completed!</ion-title>
      <ion-text>
				Your 30 days trial is now active, you can cancel anytime before 30 days,<br />they will not be charged until the 30 days expire.
			</ion-text>
      <div class="button">
        <ion-button class="return" @click="dashboard">Go to home</ion-button>
      </div>
    </ion-modal>
  </ion-content>
</template>

<script lang="ts">
import { IonButton, IonModal, IonTitle, IonText, IonContent } from "@ionic/vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    IonButton,
    IonModal,
    IonText,
    IonTitle,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    setOpen(isOpen: boolean) {
      this.isOpen = isOpen;
    },
  },
});
</script>
<style scoped lang="scss">
ion-modal {
  --width: 45rem;
  --height: 45rem;
  text-align: center;
  --border-radius: 10px;
  color: var(--gold);
  --backdrop-opacity: var(--ion-backdrop-opacity, 1);
}
.title {
  font-size: 1.8rem;
  margin-top: 5rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
.return {
  width: 30rem;
  color: rgb(29, 28, 28);
  font-size: 1.6rem;
  margin-top: 4rem;
}
.logo {
  width: 15rem;
  margin: auto;
  text-align: center;
  margin-top: 9rem;
}
ion-text {
  font-size: 0.8rem;
  font-weight: 100;
  font-family: "Yantramanav";
}
</style>