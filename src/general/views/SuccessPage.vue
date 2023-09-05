<template>
	<div class="scrolled-page">
		<ion-spinner name="lines" class="spinner" v-if="loading || linkLoading" />
		<div v-else class="content">
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
						Payment succesfully completed! 
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
import { IonText, IonImg, IonButton, IonSpinner } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { useMutation, useQuery } from "@vue/apollo-composable";
import useFacilityId from "@/hooks/useFacilityId";
import {
  MyStripeConnectDocument,
  LinksDocument,
} from "@/generated/graphql";
import { onMounted } from "vue";
import { Capacitor } from '@capacitor/core';

const router = useRouter();

const { onResult: gotMyStripeConnect, loading } = useQuery(
	MyStripeConnectDocument,
	{},
	{
		fetchPolicy: "no-cache",
	}
);
gotMyStripeConnect(async (response) => {
	if (response.data?.myStripeConnect?.state === "ACTIVE"){
		const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
		localStorage.setItem(
			"user",
			JSON.stringify({
				...currentUser,
				stripeAccountId: response.data?.myStripeConnect?.account_id,
				stripeAccountState: response.data?.myStripeConnect?.state
			})
		);
		const { id: myFacilityId } = useFacilityId();
		if(!myFacilityId) {
			router.push({ name: EntitiesEnum.SuccessStripeConnect });
			return;
		}
		if(Capacitor.isNativePlatform()) {
			router.push({ name: EntitiesEnum.Overview });
			return;
		}
		router.push({ name: EntitiesEnum.DashboardOverview });
	}
});


const handleContinue = () => {
	const link = createStripeConnect();
};

const { mutate: createStripeConnect, onDone: goToStripeConnect, loading: linkLoading } = useMutation(
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
	width: 70%;
	ion-button {
		font: 700 16px/1 Yantramanav;
		width: 100%;
		height: 40px;
		--border-radius: 12px;
		--padding-start: 26px;
		--padding-end: 26px;
	}
}
.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
</style>
