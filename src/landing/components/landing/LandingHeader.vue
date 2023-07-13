<template>
    <div class="landing-header__container">
      <div
        class="landing-header container"
      >
				<router-link
					to="/"
				>
					<ion-img
						src="assets/icon/new-logo.png"
						class="logo"
						alt="logo"
					/>
				</router-link>
				<div class="landing-menu">
					<router-link
						to="/about-us"
						class="landing-menu__item"
					>
						About us
					</router-link>
					<router-link
						to="/blog"
						class="landing-menu__item"
					>
						Blog
					</router-link>
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
				</div>
				<div>
					<ion-button
						class="login-btn"
						type="button"
						fill="clear"
						@click="goToLogin"
					>
						Log in
					</ion-button>
					<ion-button
						class="get-started-btn"
						type="button"
					>
						Get started
					</ion-button>
				</div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { IonImg, IonIcon, IonButton } from "@ionic/vue";
	import { useRouter } from "vue-router";
	import { EntitiesEnum } from "@/const/routes";

	const router = useRouter();

	const goToLogin = () => {
		router.push({ name: EntitiesEnum.Login });
	};
  </script>
  
  <style scoped lang="scss">
  .landing-header__container {
    width: 100%;
		font-family: Lato;
  }
    
  .landing-header {
    width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
  }

	.container {
		width: 100%;
		max-width: 1100px;
		margin: 0 auto;
	}
  
  .logo {
    width: 200px;
    min-width: 60px;
  }

	.landing-menu {
		display: flex;

		&__item {
			color: var(--ion-color-white);
			margin-right: 40px;
		}
	}

	.login-btn {
		color: var(--ion-color-white);
		margin-right: 32px;
	}

	.get-started-btn {
	}
  </style>
  