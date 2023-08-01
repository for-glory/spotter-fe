<template>
	<div class="landing-footer">
		<div class="landing-footer__banner">
			<div class="landing-footer__banner__content">
				<ion-text class="lg-title">
					Ready to take charge of your life?
				</ion-text>
				<ion-button class="button-dark large-btn mt-3" type="button">
					Try Spotter for Free
				</ion-button>
			</div>
		</div>
		<ion-grid :fixed="true" class="footer-bottom">
			<ion-row>
				<ion-col size="12" size-lg="8">
					<div class="landing-footer__menu-container">
						<div class="landing-footer__menu">
							<ion-text class="landing-footer__menu-title">DOWNLOAD</ion-text>
							<div class="landing-footer__menu__links">
								<router-link
									to="/"
									class="landing-footer__menu-item"
								>
									iOS
								</router-link>
								<router-link
									to="/"
									class="landing-footer__menu-item"
								>
									Android
								</router-link>
							</div>
						</div>
						<div class="landing-footer__menu">
							<ion-text class="landing-footer__menu-title">LEGAL</ion-text>
							<div class="landing-footer__menu__links">
								<router-link
									to="/"
									class="landing-footer__menu-item"
								>
									Terms & Conditions
								</router-link>
								<router-link
									to="/"
									class="landing-footer__menu-item"
								>
									Privacy Policy
								</router-link>
							</div>
						</div>
						<div class="landing-footer__menu">
							<ion-text class="landing-footer__menu-title">RESOURCES</ion-text>
							<div class="landing-footer__menu__links">
								<router-link
									to="/"
									class="landing-footer__menu-item"
								>
									News and blog
								</router-link>
							</div>
						</div>
						<div class="landing-footer__menu">
							<ion-text class="landing-footer__menu-title">ABOUT US</ion-text>
							<div class="landing-footer__menu__links">
								<router-link
									to="/"
									class="landing-footer__menu-item"
								>
									Step-by-step instruction
								</router-link>
								<router-link
									to="/faqs"
									class="landing-footer__menu-item"
								>
									FAQs
								</router-link>
								<router-link
									to="/contact-us"
									class="landing-footer__menu-item"
								>
									Contact us
								</router-link>
							</div>
						</div>
					</div>
				</ion-col>
				<ion-col>
				</ion-col>
				<ion-col size="12" size-lg="3">
					<div class="w-100 d-flex justify-content-center">
						<div>
							<ion-img
								src="assets/icon/logo-complete.png"
								class="logo"
								alt="logo"
							/>
							<div class="mt-2">
								<ion-text>
									Be in total control of your life, one session at a time.
								</ion-text>
							</div>
							<div class="mt-2">
								<ion-text>
									STAY IN TOUCH
								</ion-text>
							</div>
							<div class="landing-footer__social-links">
								<router-link
									to="/"
									class="landing-footer__social-links__link"
								>
									<ion-icon
										src="assets/icon/facebook.svg"
									/>
								</router-link>
								<router-link
									to="/"
									class="landing-footer__social-links__link"
								>
									<ion-icon
										src="assets/icon/twitter.svg"
									/>
								</router-link>
								<router-link
									to="/"
									class="landing-footer__social-links__link"
								>
									<ion-icon
										src="assets/icon/instagram.svg"
									/>
								</router-link>
							</div>
						</div>
					</div>
				</ion-col>
			</ion-row>
		</ion-grid>
	</div>
</template>

<script setup lang="ts">
import { IonImg, IonCol, IonGrid, IonRow, IonIcon, IonText, IonButton } from "@ionic/vue";
</script>

<style scoped lang="scss">
	
.landing-footer {
	font-family: Lato;
	&__banner {
		background-color: var(--gold);
		padding: 100px 0;

		&__content {
			display: flex;
			flex-direction: column;
			align-items: center;
			color: var(--gray-700);
			text-align: center;
		}
	}

	.footer-bottom {
		padding: 64px 0;
	}

	&__menu-container {
		display: inline-flex;
		align-items: flex-start;
		gap: 64px;
		flex-wrap: wrap;
	}
	
	&__menu {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;

		&__links {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: 16px;
		}
	}

	&__menu-title {
		color: var(rgba(255, 255, 255, 0.60));
		font-size: 18px;
		font-weight: 400;
	}

	&__menu-item {
		color: var(--ion-color-white);
		font-size: 16px;
		font-weight: 400;
	}

	&__social-links {
		margin-top: 8px;
		display: flex;
		gap: 24px;

		&__link {
			color: var(--main-color);
			width: 50px;
			height: 50px;
			border-radius: 50%;
			background-color: var(--gold);
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24px;
		}
	}
	@media (max-width: 992px) {
		.footer-bottom {
			padding: 20px;
		}
		.landing-footer__menu-container {
			flex-direction: column;
			gap: 40px;
		}
	}
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
</style>
