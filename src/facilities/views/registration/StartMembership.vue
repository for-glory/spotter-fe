<template>
	<div>
		<div class="header">
			<ion-grid :fixed="true">
				<router-link
					to="/"
				>
					<ion-img
						src="assets/icon/logo-complete.png"
						class="logo"
						alt="logo"
					/>
				</router-link>
			</ion-grid>
		</div>
		<ion-grid :fixed="true">
			<div class="content">
				<div>
					<ion-title class="title" color="primary" v-if="!Capacitor.isNativePlatform()">
						Start Membership
					</ion-title>
					<ion-title class="font-20 white-text" color="primary" v-else>
						Start with 30 days free trial
					</ion-title>
				</div>
				<div class="plan">
					<ion-title class="font-20" color="primary" v-if="!Capacitor.isNativePlatform()">
						Start with 30 days free trial
					</ion-title>
					<ion-title 
						class="font-40" 
						:class="!Capacitor.isNativePlatform() ? 'white-text' : ''" 
						color="primary"
					>
						Choose your plan
					</ion-title>
					<div class="plan-features">
						<div class="plan-features__item">
							<ion-icon src="assets/icon/check-mark.svg" color="primary" />
							<ion-text>All Features</ion-text>
						</div>
						<div class="plan-features__item">
							<ion-icon src="assets/icon/check-mark.svg" color="primary" />
							<ion-text>Other Features</ion-text>
						</div>
						<div class="plan-features__item">
							<ion-icon src="assets/icon/check-mark.svg" color="primary" />
							<ion-text>Premium Access</ion-text>
						</div>
					</div>
					<ion-text class="font-20" color="primary">
						Enjoy full feature with the right plan
					</ion-text>
				</div>
				<ion-text 
					class="font-20 grey-text"
					:class="!Capacitor.isNativePlatform() ? '' : 'py-16'"
				>
					You currently do not have an active plan, click next to get started
				</ion-text>
				<div class="buttons">
					<ion-button
						expand="block"
						@click="handleContinue"
					>
						Next
					</ion-button>
				</div>
			</div>
		</ion-grid>
	</div>
</template>

<script setup lang="ts">
import { IonTitle, IonText, IonImg, IonButton, IonIcon, IonGrid } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { Capacitor } from '@capacitor/core';

const router = useRouter();

const onBack = () => {
  router.go(-1);
};

const handleContinue = () => {
  router.push({
    name: EntitiesEnum.SelectMembership,
  });
};
</script>

<style scoped lang="scss">
.header {
	padding: 10px 0;
	border-bottom: 1px solid var(--fitnesswhite);
	.logo {
		width: 13.75rem;
		min-width: 60px;
	}
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
	align-items: center;
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
  min-height: calc(100% - 337px - var(--ion-safe-area-top));
}

.title {
  padding: 0;
  margin-bottom: 20px;
  color: var(--gold);
  font-family: Lato;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 130%;
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
	width: 40%;
  .button {
    margin: 0;
    text-align: center;
    font-family: Lato;
    font-size: 1.5rem;
    font-style: normal;
    font-weight: 500;
    line-height: 130%;

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}

.py-16 {
	padding-top: 64px;
	padding-bottom: 64px;
}
</style>
