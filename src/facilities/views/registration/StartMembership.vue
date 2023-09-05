<template>
	<div>
		<ion-grid :fixed="true">
			<div class="content">
				<div class="plan">
					<ion-title class="font-medium" color="primary">
						Start with 30 days free trial
					</ion-title>
					<ion-title 
						class="font-large white-text" 
						color="primary"
					>
						Choose your plan
					</ion-title>
					<div class="plan-features">
						<div class="plan-features__item font-mini">
							<ion-icon src="assets/icon/check-mark.svg" color="primary" />
							<ion-text>All Features</ion-text>
						</div>
						<div class="plan-features__item font-mini">
							<ion-icon src="assets/icon/check-mark.svg" color="primary" />
							<ion-text>Other Features</ion-text>
						</div>
						<div class="plan-features__item font-mini">
							<ion-icon src="assets/icon/check-mark.svg" color="primary" />
							<ion-text>Premium Access</ion-text>
						</div>
					</div>
					<ion-text class="font-small" color="primary">
						Enjoy full feature with the right plan
					</ion-text>
				</div>
				<ion-text 
					class="font-small grey-text py-16 text-center"
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
		padding: 7px 0px;
	
		&__item {
			display: flex;
			gap: 1rem;
		}
	}
}

.buttons {
	margin-top: 7.5rem;
	width: 70%;
  
	ion-button {
		font: 700 18px/1 Yantramanav;
		width: 100%;
		height: 40px;
		--border-radius: 12px;
	}
}

.py-16 {
	padding-top: 64px;
	padding-bottom: 64px;
}

.font-large {
	font: 500 40px/1 Lato;
}
.font-medium {
	font: 500 20px/1 Lato;
}
.font-small {
	font: 500 16px/1 Lato;
}
.font-mini {
	font: 500 14px/1 Lato;
}
.text-center {
	text-align: center;
}
</style>
