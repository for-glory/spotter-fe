<template>
	<ion-modal id="modal" :is-open="isVisible" :backdrop-dismiss="false">
		<ion-header class="title">
			<ion-toolbar>
				<ion-title>Change Membership Plan</ion-title>
				<ion-buttons slot="end">
					<ion-button @click="handleCancel">
						<ion-icon src="assets/icon/red-close.svg" class="close" />
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
    <div class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="12" size-sm="6" class="silver">
            <ion-text>Current Plan</ion-text>
            <div class="paragraph">
              <ion-text>Bronze</ion-text>&nbsp&nbsp<ion-text
                >$149.99</ion-text
              >
              <span>/per location</span>
            </div>
            <div class="flex-container">
              <div>
                <ion-icon
                  src="assets/icon/medal.svg"
                  class="silver grade-image"
                />
              </div>
              <div>
                <ul>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>All Bronze features +</ion-text>
                    </div>
                  </li>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text
                        >List unlimited offerings on the Network
                        profile</ion-text
                      >
                    </div>
                  </li>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>Reduced flat booking fee</ion-text>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </ion-col>
          <ion-col size="12" size-sm="6" class="gold">
            <ion-text>New Plan</ion-text>
            <div class="paragraph">
              <ion-text>Gold</ion-text>&nbsp&nbsp<ion-text>$199.99</ion-text>
              <span class="gold-location">/for first location</span>
            </div>
            <div class="flex-container">
              <div>
                <ion-icon
                  class="gold grade-image"
                  src="assets/icon/medal.svg"
                />
              </div>
              <div>
                <ul>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>All Bronze & Silver features +</ion-text>
                    </div>
                  </li>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text
                        >Reporting features on Spotter Dashboard</ion-text
                      >
                    </div>
                  </li>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>Marketing/branding consultation</ion-text>
                    </div>
                  </li>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>Reduced flat booking fee</ion-text>
                    </div>
                  </li>
                  <li class="accessibility">
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>Create and post local events</ion-text>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div class="buttons">
        <ion-button class="confirm" @click="handleConfirm"
          >Confirm change</ion-button
        >
        <ion-button class="cancel" @click="setOpen(false)">Cancel</ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script lang="ts">
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
} from "@ionic/vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  components: {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
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
.flex-container {
  display: flex;
  flex-direction: row;
  ion-text {
    font-size: 0.8rem;
  }
  ion-icon.gold {
    color: rgb(141, 112, 15);
  }
}
.grade-image {
  width: 2rem;
  height: 2rem;
  padding: 1.2rem;
  border-radius: 10px;
  align-items: center;
  box-shadow: inset 0 0 0 0.8px var(--gray-600);
  border: 1px solid var(--gray-600);
  margin-top: 0.3rem;
}
.silver {
  color: var(--silver);
}
.gold {
  color: var(--gold);
}
.ion-padding {
  padding: 0.5rem 1rem;
  border: 2px solid grey;
}
.paragraph {
  padding-top: 1.2rem;
  padding-bottom: 0.8rem;
  span {
    font-size: 0.7rem;
  }
}
.color {
  color: grey;
}
ul {
  margin: 0 0 0 10px;
  padding: 0;
  list-style: none;
  font-weight: 400;

  li {
    &.accessibility {
      display: flex;
      gap: 0.1rem;
      ion-icon {
        font-size: 6px;
      }
      ion-text {
        font-size: 0.7rem;
      }
    }
  }
}
.gold-location {
  color: var(--silver);
}
.buttons {
  text-align: center;
  margin-top: 0.5rem;
}
.confirm {
  width: 10rem;
  color: var(--gold);
  margin-right: 1.5rem;
  --background: rgb(43, 42, 42);
  height: 45px;
}
.cancel {
  width: 10rem;
  color: rgb(31, 30, 30);
  --background: grey;
  height: 45px;
}
ion-modal#modal {
  --height: rem;
  --width: 41rem;
  --backdrop-opacity: var(--ion-backdrop-opacity, 0.6);
}
.title {
  border-top: 2px solid grey;
  border-left: 2px solid grey;
  border-right: 2px solid grey;
  padding-right: 1rem;
  padding-left: 0.4rem;
}
.close {
  width: 1rem;
  height: 1rem;
}
</style>
