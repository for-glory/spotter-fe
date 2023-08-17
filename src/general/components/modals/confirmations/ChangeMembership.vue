<template>
	<ion-modal id="modal" ref="modal" :backdrop-dismiss="false">
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
      <div class="current-plan">
        <ion-text>Current Plan</ion-text>
        <div class="paragraph">
          <ion-text>Bronze</ion-text>&nbsp; &nbsp;<ion-text
            >$149.99</ion-text
          >
          <span class="location">/per location</span>
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
      </div>
      <div class="d-flex align-items-center justify-content-center">
        <div class="split" />
      </div>
      <div class="new-plan">
        <ion-text class="text-golden">New Plan</ion-text>
        <div class="paragraph">
          <ion-text class="text-golden">Gold</ion-text>&nbsp; &nbsp;<ion-text class="text-golden">$199.99</ion-text>
          <span class="location">/for first location</span>
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
      </div>
      <div class="buttons">
        <ion-button id="confirm" @click="handleConfirm"
          >Confirm change</ion-button
        >
        <ion-button id="cancel" @click="onCancel">Cancel</ion-button>
      </div>
    </div>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
} from "@ionic/vue";
import { defineComponent, ref, defineProps, defineEmits, withDefaults, defineExpose } from "vue";

const modal = ref<typeof IonModal | null>(null);

const present = () => {
  modal?.value?.$el.present();
};

const onCancel = () => {
  modal?.value?.$el.dismiss();
}

defineExpose({
  present,
});
</script>
<style scoped lang="scss">
.flex-container {
  display: flex;
  align-items: center;
  gap: 17px;
  width: 100%;
  ion-text {
    font-size: 0.8rem;
  }
  ion-icon.gold {
    color: rgb(141, 112, 15);
  }
}
.current-plan {
  color: var(--grey-text);
}
.new-plan {
  .text-golden {
    color: var(--gold);
  }
}
.grade-image {
  width: 70px;
  height: 70px;
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
.split {
  background-color: #DBB582;
  width: 77px;
  height: 1px;
  margin-top: 32px;
  margin-bottom: 32px;
}
.paragraph {
  padding-top: 1.2rem;
  padding-bottom: 0.8rem;
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
        font-size: 12px;
      }
    }
  }
}
.location {
  color: var(--grey-text);
  font: 12px/1 var(--ion-font-family);
}
.buttons {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 25px;

  ion-button#confirm {
    --background: #DBB582;
    font: bold 16px/1 var(--ion-font-family);
    width: 144px;
    height: 41px;
  }
  ion-button#cancel {
    --background: grey;
    font: bold 16px/1 var(--ion-font-family);
    width: 144px;
    height: 41px;
  }
}
ion-modal#modal {
  --height: rem;
  --width: 330px;
  --backdrop-opacity: var(--ion-backdrop-opacity, 0.8);
  padding: 24px;
}
ion-header {
  background-color: var(--gray-700);
  
  ion-toolbar {
    --background: var(--gray-700);
  }
}
.title {
  border-top: 2px solid grey;
  border-left: 2px solid grey;
  border-right: 2px solid grey;
  padding-right: 1rem;
  padding-left: 0.4rem;

  ion-title {
    --color: white;
  }
}
.close {
  width: 1rem;
  height: 1rem;
}
</style>
