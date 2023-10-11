<template>
	<ion-modal id="modal" ref="modal" :class="{'tr-membership-modal': (role === RoleEnum.Trainer || role === RoleEnum.FacilityOwner) }" :is-open="isVisible"  :backdrop-dismiss="false">
		<ion-header class="title">
			<ion-toolbar>
				<ion-title>Change Membership Plan1</ion-title>
				<ion-buttons slot="end">
					<ion-button @click="handleCancel">
						<ion-icon src="assets/icon/close.svg" class="close" />
					</ion-button>
				</ion-buttons>
			</ion-toolbar>
		</ion-header>
		<div v-if="!Capacitor.isNativePlatform()" class="ion-padding">
      <ion-row>
        <ion-col size="6">
          <div class="plan">
            <ion-text>Current Plan</ion-text>
            <div class="paragraph">
              <ion-title class="radiobutton__label">
                {{ currentPlan.title }}
              </ion-title>

              <ion-text class="radiobutton__cost"
                >${{ currentPlan?.prices.length? currentPlan?.prices[0].price/100:"" }}
                <span>
                  /per location
                </span>
              </ion-text>
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
                  <li
                    class="accessibility"
                    v-for="(benefit, idx) in currentPlan?.benefits"
                    :key="idx"
                  >
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>{{ benefit?.description }}</ion-text>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ion-col>
        <ion-col size="6">
          <div class="plan">
            <ion-text>New Plan</ion-text>
            <div class="paragraph">
              <ion-title class="radiobutton__label">
                {{ newPlan.title }}
              </ion-title>

              <ion-text class="radiobutton__cost"
                >${{ newPlan?.prices.length? newPlan?.prices[0].price/100:"" }}
                <span>
                  /per location
                </span>
              </ion-text>
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
                  <li
                    class="accessibility"
                    v-for="(benefit, idx) in newPlan?.benefits"
                    :key="idx"
                  >
                    <div>
                      <ion-icon src="assets/icon/accessibility.svg" />
                    </div>
                    <div>
                      <ion-text>{{ benefit?.description }}</ion-text>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </ion-col>
      </ion-row>
			<div class="buttons">
				<ion-button class="confirm" @click="handleConfirm">Confirm change</ion-button>
				<ion-button class="cancel" @click="handleCancel">Back</ion-button>
			</div>
		</div>
    <div v-else class="ion-padding">
      <div class="current-plan">
        <ion-text class="plan-title">Current Plan</ion-text>
        <div class="paragraph">
          <ion-text class="tier">{{currentPlan?.tier}}</ion-text>&nbsp; &nbsp;<ion-text class="price"
            >${{currentPlan?.prices[0].price / 100}}</ion-text
          >
          <span class="location">/{{currentPlan?.tier === 'GOLD' ? 'for first location' : 'per location'}}</span>
        </div>
        <div class="flex-container">
          <div>
            <ion-icon
              src="assets/icon/medal.svg"
              class="grade-image"
              :class="currentPlan?.tier === 'GOLD' ? 'gold' : currentPlan?.tier === 'SILVER' ? 'silver' : 'bronze'"
            />
          </div>
          <div>
            <ul>
              <li v-for="(benefit, id) in currentPlan?.benefits" :key="id" class="accessibility">
                <div>
                  <ion-icon src="assets/icon/accessibility.svg" />
                </div>
                <div>
                  <ion-text>{{benefit.description}}</ion-text>
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
        <ion-text class="plan-title text-golden">New Plan</ion-text>
        <div class="paragraph">
          <ion-text class="tier text-golden">{{newPlan?.tier}}</ion-text>&nbsp; &nbsp;<ion-text class="price text-golden"
            >${{newPlan?.prices[0].price / 100}}</ion-text
          >
          <span class="location">/{{newPlan?.tier === 'GOLD' ? 'for first location' : 'per location'}}</span>
        </div>
        <div class="flex-container">
          <div>
            <ion-icon
              src="assets/icon/medal.svg"
              class="grade-image"
              :class="[newPlan?.tier === 'GOLD' ? 'gold' : newPlan?.tier === 'SILVER' ? 'silver' : 'bronze', newPlan.tier]"
            />
          </div>
          <div>
            <ul>
              <li v-for="(benefit, id) in newPlan?.benefits" :key="id" class="accessibility">
                <div>
                  <ion-icon src="assets/icon/accessibility.svg" />
                </div>
                <div>
                  <ion-text>{{benefit.description}}</ion-text>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="buttons d-flex align-items-center justify-content-between">
        <ion-button id="confirm" @click="handleConfirm"
          >Confirm change</ion-button
        >
        <ion-button id="cancel" @click="handleCancel">Cancel</ion-button>
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
  IonText,
  IonTitle,
	IonGrid,
	IonRow,
	IonCol
} from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";
import { Capacitor } from '@capacitor/core';
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";

const  props = withDefaults(
  defineProps<{
    currentPlan: any;
    newPlan: any;
    isVisible: boolean;
  }>(),
  {
  }
);

console.log("props", props);


const emits = defineEmits<{
  (e: "confirm", isConfirmed: boolean): void;
  (e: "cancel", isConfirmed: boolean): void;
}>();

const { role } = useRoles();

const handleConfirm = () => {
  emits("confirm", true);
};

const handleCancel = () => {
  emits("cancel", false);
};
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
  margin-top: 1.5rem;
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

.plan {
	margin: 0 auto;
	width: fit-content;
	color: var(--gold);
	text-align: center;
}
.tr-membership-modal {
  &::part(content){
    --width: 87%;
  }

  .title {
    border-top: 2px solid var(--gold);
    border-left: 2px solid var(--gold);
    border-right: 2px solid var(--gold);

    ion-toolbar {
      --background: var(--gray-700);
    }

    ion-title {
      color: var(--Spotter-new, #EFEFEF);
      font-family: Yantramanav;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: 150%;
    }

    ion-icon {
      color: var(--gold);
    }
  }

  .BRONZE {
    color: var(--bronze) !important;
  }
  .SILVER{
    color: var(--gray-500) !important; 
  }
  .GOLD{
    color: var(--new-gold) !important;
  }

  .ion-padding {
    border: 2px solid var(--gold);
    padding: 23px;
    background: var(--main-color);
  }
  .grade-image {
     width: 4rem;
     height: 4rem;
  }

  .split {
    width: 77px;
    height: 1px;
    background: var(--gold);
    flex-shrink: 0;
    margin: 30px 0;
  }

  .accessibility {
    padding-bottom: 2px;
    ion-text {
      font-size: 12px;
      font-weight: 500;
    }
  }

  .paragraph {
    padding: 12px 0;
    font-weight: 500; 
    .tier {
      font-size: 16px;
      text-transform: capitalize;
    }
    .price {
      font-size: 14px;
    }
    .location {
      font-size: 12px;
    }
  }
  .current-plan {
      color: var(--gray-500);
      font-family: Lato;

      .plan-title {
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
      }
  }

  .new-plan {
    .plan-title {
      color: var(--gold);
      font-family: Yantramanav;
      font-size: 14px;
      font-weight: 700;
    }

    .tier, .price {
      color: var(--gold);
    }
    .location {
      color: var(--gray-500);
    }
  }

  .buttons {
    align-items: flex-start;
    gap: 21px;
    ion-button {
      height: 41px;
      color: var(--Black, #0D2023);
      font-family: Yantramanav;
      font-size: 16px;
      font-weight: 700;
    }

    #cancel {
      --background: rgba(255, 255, 255, 0.60);
      width: 110px;
    }
  }
}
</style>
 