<template>
	<div class="landing-header__container hide-if-native" :style="fixed?{position: 'fixed', zIndex: 999}:''">
		<div
			class="landing-header"
		>
			<div class="menu-content">
				<router-link
					to="/"
				>
					<ion-img
						src="assets/icon/logo-complete.png"
						class="logo"
						alt="logo"
					/>
				</router-link>
				<div class="landing-menu md-hidden">
					<router-link
						to="/about-us"
						class="landing-menu__item"
					>
						About us
					</router-link>
					<!-- <router-link
						to="/blog"
						class="landing-menu__item"
					>
						Blog
					</router-link> -->
					<router-link
						to="/contact-us"
						class="landing-menu__item"
					>
						Contact us
					</router-link>
					<router-link
						to="/terms-of-use"
						class="landing-menu__item"
					>
						Terms of use
					</router-link>
					<router-link
						to="/how-it-works"
						class="landing-menu__item"
					>
						How it works
					</router-link>
				</div>
			</div>
			<div v-if="!hideAuthBtn" class="buttons md-hidden">
				<ion-button
					class="login-btn"
					type="button"
					fill="clear"
					v-if="!isLoggedIn"
					@click="goToLogin"
				>
					Log in
				</ion-button>
				<ion-button
					class="get-started-btn"
					type="button"
					v-if="!isLoggedIn"
					@click="goToRegister"
				>
					Get started
				</ion-button>
				<ion-button
					class="login-btn"
					type="button"
					fill="clear"
					v-if="isLoggedIn"
					@click="onLogout"
				>
					Log out
				</ion-button>
				<ion-button
					class="get-started-btn"
					type="button"
					v-if="isLoggedIn"
					@click="goToDashboard"
				>
					Dashboard
				</ion-button>
			</div>
			<div class="d-none md-block">
				<ion-menu-button>
					<ion-icon src="assets/icon/menu-icon.svg"></ion-icon>
				</ion-menu-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { IonImg, IonButtons, IonMenuButton, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { defineProps, ref } from "vue";
import useUser from "@/hooks/useUser";
import { clearAuthItems } from "@/router/middleware/auth";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const props = defineProps<{
  hideAuthBtn?: boolean;
  fixed?: boolean;
}>();

const { isLoggedIn } = useUser();
const { role } = useRoles()

const router = useRouter();

const goToLogin = () => {
	router.push({ name: EntitiesEnum.Login });
};
const goToRegister = () => {
	router.push({ name: EntitiesEnum.Register });
};

const onLogout = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
};
const goToDashboard = () => {
	if(role === RoleEnum.User){
		return router.push({
			name: EntitiesEnum.DashboardUserOverview
		})
	}
	router.push({ name: EntitiesEnum.DashboardOverview });
};
</script>

<style scoped lang="scss">
.landing-header__container {
	width: 100%;
	font-family: Lato;
	padding-top: 24px;
	padding-bottom: 24px;
}
	
.landing-header {
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
  .menu-content {
		display: flex;
		gap: 81px;
		.logo {
			width: 220px;
			min-width: 60px;
		}
	
		.landing-menu {
			display: flex;
			align-items: center;
			gap: 40px;
	
			&__item {
				color: var(--ion-color-white);
				text-align: center;
				font-size: 16px;
				font-style: normal;
				line-height: normal;
			}
		}
	}

	.buttons {
		ion-button {
			height: 70px;
			text-align: center;
			font-family: Lato;
			font-size: 20px;
			font-style: normal;
			font-weight: 700;
			line-height: 150%;
			letter-spacing: 0.24px;
		}
		.login-btn {
			color: var(--ion-color-white);
			margin-right: 26px;
		}
	
		.get-started-btn {
		}
	}
  </style>
  