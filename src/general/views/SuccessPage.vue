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
						{{ titleText }}
					</ion-text>
				</div>
				<div class="detail">
					<ion-text>
						{{ detailText }}
					</ion-text>
				</div>
			</div>
			<div class="buttons">
				<ion-button
					expand="block"
					@click="handleContinue"
				>
					{{ continueBtnText }}
				</ion-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IonTitle, IonText, IonImg, IonButton, IonIcon, IonGrid } from "@ionic/vue";
import { useRoute, useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useMutation } from "@vue/apollo-composable";
import {
  LinksDocument,
} from "@/generated/graphql";
import { computed } from "vue";

const route = useRoute();
const router = useRouter();

const currentMode = computed<EntitiesEnum>(() => route.meta.mode);
const continueBtnText = computed(
	() =>{
		if (currentMode.value === EntitiesEnum.SuccessMembership) return "Connect your payout method";
		else if (currentMode.value === EntitiesEnum.SuccessStripeConnect) return "Set up gym profile";
		else return "";
	}
);
const titleText = computed(
	() =>{
		if (currentMode.value === EntitiesEnum.SuccessMembership) return "You have successfully set up a subscription";
		else if (currentMode.value === EntitiesEnum.SuccessStripeConnect) return "Congratulations! Payout Account created successfully";
		else return "";
	}
);
const detailText = computed(
	() =>{
		if (currentMode.value === EntitiesEnum.SuccessMembership) return "Your 30 days trial is now active, you can cancel anytime before 30 days, they will not be charged until the 30 days expire,";
		else if (currentMode.value === EntitiesEnum.SuccessStripeConnect) return "Build your gym profile, create your events and gym passes";
		else return "";
	}
);

const onBack = () => {
  router.go(-1);
};

const handleContinue = () => {
	if (currentMode.value === EntitiesEnum.SuccessMembership) {
		const link = createStripeConnect();
	}
	else if (currentMode.value === EntitiesEnum.SuccessStripeConnect) {
		router.push({ name: EntitiesEnum.CreateFacility });
	}
};

const { mutate: createStripeConnect, onDone: goToStripeConnect } = useMutation(
  LinksDocument
);

goToStripeConnect((res) => {
	if(res.data?.links.url)
	window.location.href = res.data.links.url
});
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
