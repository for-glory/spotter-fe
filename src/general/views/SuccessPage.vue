<template>
	<div class="scrolled-page">
		<div class="content">
			<router-link
				to="/"
			>
				<ion-img
					src="assets/icon/logo-complete.png"
					class="logo"
					alt="logo"
				/>
			</router-link>
			<div class="message-text">
				<div class="title">
					<ion-text color="primary">
						You have successfully set up a subscription
					</ion-text>
				</div>
				<div class="detail">
					<ion-text>
						Your 30 days trial is now active, you can cancel anytime before 30 days, they will not be charged until the 30 days expire,
					</ion-text>
				</div>
			</div>
			<div class="buttons">
				<ion-button
					expand="block"
					@click="handleContinue"
				>
					Connect your payout method
				</ion-button>
			</div>
		</div>
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
.logo {
	width: 13.75rem;
	min-width: 60px;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
	align-items: center;
  padding: 32px 24px calc(32px + var(--ion-safe-area-bottom));
  min-height: calc(100% - var(--ion-safe-area-top));
}

.message-text {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 22px;
	.title {
		padding: 0;
		margin-bottom: 22px;
		color: var(--gold);
		font-family: Lato;
		text-align: center;
		font-size: 28px;
		font-style: normal;
		font-weight: 400;
		line-height: 130%;
		max-width: 316px;
	}
	
	.detail {
		color: var(--ion-text-color);
		text-align: center;
		font-family: Lato;
		font-size: 14px;
		font-style: normal;
		font-weight: 300;
		line-height: 150%;
		max-width: 440px;
	}
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
</style>
