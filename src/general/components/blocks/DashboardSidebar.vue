<template>
	<div class="sidebar">
		<div class="menu-section">
			<div class="logo">
				<router-link
					to="/"
				>
					<ion-img
						src="assets/icon/logo-complete.png"
						class="logo__img"
						alt="logo"
					/>
				</router-link>
			</div>
			<div class="main-menu">
				<div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardOverview)">
					<ion-icon src="assets/icon/dashboard.svg" />
					<ion-text>Overview</ion-text>
				</div>
				<div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardEvent)">
					<ion-icon src="assets/icon/events.svg" />
					<ion-text>Events</ion-text>
				</div>
				<div class="menu-item">
					<ion-icon src="assets/icon/Pass.svg" />
					<ion-text>Gym pass</ion-text>
				</div>
				<div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardMembership)">
					<ion-icon src="assets/icon/Rate.svg" />
					<ion-text>Membership</ion-text>
				</div>
				<div class="menu-item">
					<ion-icon src="assets/icon/gym-user-icon.svg" />
					<ion-text>Workout plans</ion-text>
				</div>
				<div class="menu-item">
					<ion-icon src="assets/icon/email.svg" />
					<ion-text>Message</ion-text>
				</div>
			</div>
			<div class="setting-menu">
				<div class="menu-item">
					<ion-icon src="assets/icon/gym-icon.svg" />
					<ion-text>Manage Gyms</ion-text>
				</div>
				<div class="menu-item">
					<ion-icon src="assets/icon/profile.svg" />
					<ion-text>Gym Manager</ion-text>
				</div>
				<div class="menu-item">
					<ion-icon src="assets/icon/Card.svg" />
					<ion-text>Getting Paid</ion-text>
				</div>
				<div class="menu-item">
					<ion-icon src="assets/icon/Setting.svg" />
					<ion-text>Settings</ion-text>
				</div>
			</div>
		</div>
		<div class="logout">
			<div class="menu-item" @click="onLogout">
				<ion-icon src="assets/icon/Logout.svg" />
				<ion-text>Logout</ion-text>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { IonText, IonImg, IonIcon, IonButton } from '@ionic/vue';
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";

const router = useRouter();

const onHandleClickMenu = (pathName: string) => {
	console.log(pathName)
  router.push({ name: pathName });
};

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
</script>
<style scoped lang="scss">
.sidebar {
	position: relative;
	height: 100vh;

	.menu-section {
		height: calc(100vh - 45px);
		overflow: auto;
	}
	.main-menu {
		padding: 12px 0;
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid rgba(255, 255, 255, 0.60);
	}

	.setting-menu {
		padding: 12px 0;
		display: flex;
		flex-direction: column;
	}

	.menu-item {
		padding: 12px 24px;
		display: flex;
		align-items: center;
		gap: 14px;
		color: var(--gray-500);
		font-family: Lato;
		font-size: 14px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%;
		cursor: pointer;

		&:hover {
			color: var(--gold);
		}
	}

	.logo {
		padding: 24px;
	}

	.logout {
		width: 100%;
		position: absolute;
		bottom: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.60);
	}
}
</style>
