<template>
	<ion-page class="landing-page">
		<ion-grid :fixed="true">
			<landing-header />
		</ion-grid>
		<div>
			<div class="first-part">
				<div class="bg-blob bg-blob-1">
					<ion-img class="bg-blob__img" src="assets/landing/quickly-blob.png" />
				</div>
				<div class="bg-blob bg-blob-2">
					<ion-img class="bg-blob__img" src="assets/landing/quickly-blob1.png" />
				</div>
				<div class="bg-blob bg-blob-3">
					<ion-img class="bg-blob__img" src="assets/landing/quickly-blob2.png" />
				</div>
				<ion-grid :fixed="true">
					<ion-row class="embrace-section">
						<ion-col size="12" size-md="7" class="embrace-section__content">
							<div>
								<h1 class="lg-title">Embrace your potential with <ion-text color="primary">Spotter</ion-text> today!</h1>
								<p class="detail-text">
									Your journey to a healthier, happier you starts now. Take the first step and let Spotter be your partner in reaching new heights of wellness. Together, we'll build a stronger, fitter, and more confident version of yourself.
								</p>
								<div class="get-buttons">
									<ion-button class="get-button">
										<ion-icon class="button-icon" src="assets/icon/google-play.svg"/>
										<div class="d-flex flex-direction-column align-items-start">
											<ion-text class="get-button__small-text">GET IT ON</ion-text>
											<ion-text class="get-button__text">Google Play</ion-text>
										</div>
									</ion-button>
									<ion-button class="get-button">
										<ion-icon class="button-icon" src="assets/icon/apple.svg"/>
										<div class="d-flex flex-direction-column align-items-start">
											<ion-text class="get-button__small-text">GET IT ON</ion-text>
											<ion-text class="get-button__text">Google Play</ion-text>
										</div>
									</ion-button>
								</div>
							</div>
							<div class="trainers">
								<div class="trainers__left">
									<h1 class="md-title">100+</h1>
									<ion-text class="detail-text">Trainers</ion-text>
								</div>
								<div class="trainers__right">
									<ion-text class="detail-text">Get connected with top personal trainers and world class gyms in your world. Set the time, work at your pace and achieve results.</ion-text>
								</div>
								<ion-img class="my-location" src="assets/landing/my location small.png" />
							</div>
						</ion-col>
						<ion-col size="12" size-md="5">
							<ion-img
								src="assets/landing/iPad Pro (12.9 Inch) Mockup.png"
								class="logo"
								alt="logo"
							/>
						</ion-col>
					</ion-row>
					<ion-row class="find-section px-3 mt-3">
						<ion-col size="12" size-md="6">
							<ion-img
								src="assets/landing/iPhone 14 Pro Space Black Mockup.png"
								class=""
								alt="iphone image"
							/>
						</ion-col>
						<ion-col size="12" size-md="6">
							<div class="find-content">
								<ion-text color="primary"><h3>FIND A TRAINER OR GYM</h3></ion-text>
								<h1 class="md-title">Find the <ion-text color="primary">nearest gym</ion-text> close to you wherever in the world you are.</h1>
								<p class="detail-text">
									Never worry about backsliding; when you have a gym near your home that feels like home, you'll always find yourself in a space free from uncertainty and filled with consistent success.
								</p>
								<ion-img class="my-location" src="assets/landing/my location small.png" />
							</div>
							<div>
								<p>How to get started:</p>
								<ion-grid>
									<ion-row>
										<ion-col size="12" size-md="4">
											<ion-icon
												src="assets/icon/global-search.svg"
												size="large"
											/>
											<p>Search</p>
											<p class="detail-text">Find the closest gym to your apartment</p>
										</ion-col>
										<ion-col size="12" size-md="4">
											<ion-icon
												src="assets/icon/users.svg"
												size="large"
											/>
											<p>Become a member</p>
											<p class="detail-text">Choose a membership option, complete the registration.</p>
										</ion-col>
										<ion-col size="12" size-md="4">
											<ion-icon
												src="assets/icon/currency.svg"
												size="large"
											/>
											<p>Pay</p>
											<p class="detail-text"> make the payment, attend an orientation session, and start your fitness journey.</p>
										</ion-col>
									</ion-row>
								</ion-grid>
							</div>
						</ion-col>
					</ion-row>
					<ion-row class="trainer-section px-3 mt-3">
						<ion-col size="12" size-md="6">
							<div>
								<ion-text color="primary"><h3>FOR TRAINERS</h3></ion-text>
								<h1 class="md-title"><ion-text color="primary">Collaborate</ion-text> with world class gyms in your area to <ion-text color="primary">connect</ion-text> with your clients.</h1>
								<p class="detail-text">
									Being a registered member gives you access to any spotter gym around the world and a one on one personal time with any of our world class trainers in or outside the gym
								</p>
							</div>
							<div>
								<p>Benefits you’ll get:</p>
								<ion-grid>
									<ion-row>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/bezier.svg"
												size="large"
											/>
											<p>Independence</p>
											<p class="detail-text">Find the closest gym to your apartment</p>
										</ion-col>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/heart-graph.svg"
												size="large"
											/>
											<p>Monthly checkups</p>
											<p class="detail-text">Have your body system checked by professional medics</p>
										</ion-col>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/bike.svg"
												size="large"
											/>
											<p>Free cycle classes</p>
											<p class="detail-text">You get 3 free cycle class for every new membership renewal</p>
										</ion-col>
									</ion-row>
								</ion-grid>
							</div>
						</ion-col>
						<ion-col size="12" size-md="6">
							<ion-img
								src="assets/landing/iPhone 14 Pro Space Black Mockup1.png"
								class=""
								alt="iphone image"
							/>
						</ion-col>
					</ion-row>
					<ion-row class="gym-user-section px-3 mt-3">
						<ion-col size="12" size-md="6">
							<ion-img
								src="assets/landing/iPhone14-2.png"
							/>
						</ion-col>
						<ion-col size="12" size-md="6">
							<div>
								<ion-text color="primary"><h3>FOR GYM OWNERS</h3></ion-text>
								<h1 class="md-title">Let people <ion-text color="primary">find</ion-text> your gym easily with spotter</h1>
								<p class="detail-text">
									As a gym owner you get to put your world-class gym on the map for easy access to reaching skilled trainers and clients in need of a gym for their workout.
								</p>
							</div>
							<div>
								<p>Benefits you’ll get:</p>
								<ion-grid>
									<ion-row>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/bezier.svg"
												size="large"
											/>
											<p>Flexibility</p>
											<p class="detail-text">Find the closest gym to your apartment</p>
										</ion-col>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/heart-graph.svg"
												size="large"
											/>
											<p>Monthly checkups</p>
											<p class="detail-text">Have your body system checked by professional medics</p>
										</ion-col>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/bike.svg"
												size="large"
											/>
											<p>Free cycle classes</p>
											<p class="detail-text">You get 3 free cycle class for every new membership renewal</p>
										</ion-col>
									</ion-row>
								</ion-grid>
							</div>
						</ion-col>
					</ion-row>
					<ion-row class="users-section px-3 mt-3">
						<ion-col size="12" size-md="6">
							<div>
								<ion-text color="primary"><h3>FOR USERS</h3></ion-text>
								<h1 class="md-title">Get <ion-text color="primary">unlimited access</ion-text> to a personal trainer of your choice.</h1>
								<p class="detail-text">
									Being a registered member gives you access to any spotter gym around the world and a one on one personal time with any of our world class trainers in or outside the gym
								</p>
							</div>
							<div>
								<p>Benefits you’ll get:</p>
								<ion-grid>
									<ion-row>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/bezier.svg"
												size="large"
											/>
											<p>Flexibility</p>
											<p class="detail-text">Find the closest gym to your apartment</p>
										</ion-col>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/heart-graph.svg"
												size="large"
											/>
											<p>Monthly checkups</p>
											<p class="detail-text">Have your body system checked by professional medics</p>
										</ion-col>
										<ion-col size="4">
											<ion-icon
												src="assets/icon/bike.svg"
												size="large"
											/>
											<p>Free cycle classes</p>
											<p class="detail-text">You get 3 free cycle class for every new membership renewal</p>
										</ion-col>
									</ion-row>
								</ion-grid>
							</div>
						</ion-col>
						<ion-col size="12" size-md="6">
							<ion-img
								src="assets/landing/iPhone14-3.png"
							/>
						</ion-col>
					</ion-row>
				</ion-grid>
			</div>
			<!-- find a gym section -->
			<div>
				<div class="d-flex flex-direction-column align-items-center">
					<h1 class="lg-title">Find a gym</h1>
					<ion-text class="sm-title">Let’s help you find one close to you</ion-text>
				</div>
				<div class="mt-3">
					<ion-img
						src="assets/landing/find a gym.png"
					/>
				</div>
			</div>
			<!-- keep up section -->
			<div class="keep-up-section">
				<ion-grid :fixed="true">
					<ion-row>
						<ion-col size="12">
							<h1 class="xl-title">Keep up with dedicated trainers willing to see you succeed.</h1>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col size="0" size-md="5">
						</ion-col>
						<ion-col size="12" size-md="7">
							<ion-text class="sm-title">Embrace your potential with Embrace your potential w today Embrace your potential with Embrace your potential w today!</ion-text>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col size="12">
							<ion-img
								src="assets/landing/Person in red sweater holding a phone mockup (Mockuuups Studio).png"
							/>
						</ion-col>
					</ion-row>
					<ion-row class="mt-3">
						<ion-col size="12" size-md="7">
							<ion-text class="sm-title">Embrace your potential with Embrace your potential w today Embrace your potential with Embrace your potential w today!</ion-text>
						</ion-col>
						<ion-col size="auto"></ion-col>
						<ion-col size="12" size-md="4">
							<ion-button
								class="button-dark"
								type="button"
							>
								Find out more about our mission
							</ion-button>
						</ion-col>
					</ion-row>
					<div class="mt-3 d-flex align-items-center">
						<div>
							<ion-img
								src="assets/landing/2 persons.png"
								style="min-width: 500px;"
							/>
						</div>
						<div>
							<div class="px-3">
								<ion-text class="sm-title">Embrace your potential with Embrace your potential w today Embrace your potential with Embrace your potential w today!</ion-text>
								<div>
									<ion-button
										class="button-dark"
										type="button"
									>
										Checkout our Mission Roadmap
									</ion-button>
								</div>
							</div>
						</div>
					</div>
				</ion-grid>
			</div>
			<!-- news for you section -->
			<div>
				<ion-grid :fixed="true">
					<ion-row class="mt-3">
						<ion-col size="12">
							<h1 class="lg-title">NEWS FOR YOU</h1>
						</ion-col>
					</ion-row>
					<ion-row class="mt-3">
						<ion-col size="12" size-md="4">
							<news-item
								imgUrl="assets/landing/news1.png"
								title="CLACIUM 98gx"
								detail="Embrace your potential with Embrace your potential w today Embrace your potential with Embrace your potential w today!"
							/>
						</ion-col>
						<ion-col size="12" size-md="4">
							<news-item
								imgUrl="assets/landing/news1.png"
								title="CLACIUM 98gx"
								detail="Embrace your potential with Embrace your potential w today Embrace your potential with Embrace your potential w today!"
							/>
						</ion-col>
						<ion-col size="12" size-md="4">
							<news-item
								imgUrl="assets/landing/news1.png"
								title="CLACIUM 98gx"
								detail="Embrace your potential with Embrace your potential w today Embrace your potential with Embrace your potential w today!"
							/>
						</ion-col>
					</ion-row>
				</ion-grid>
			</div>
			<!-- video section -->
			<div>
				<ion-img src="assets/landing/video.png" class="video-screen" />
			</div>
			<!-- get your life back section -->
			<div class="life-back-section">
				<div>
					<ion-text class="lg-title">Get your life back</ion-text>
				</div>
				<div>
					<ion-text class="sm-title">App available on both ios and Android</ion-text>
				</div>
				<div class="get-buttons">
					<ion-button class="get-button">
						<ion-icon class="button-icon" src="assets/icon/google-play.svg"/>
						<div class="d-flex flex-direction-column align-items-start">
							<ion-text class="get-button__small-text">GET IT ON</ion-text>
							<ion-text class="get-button__text">Google Play</ion-text>
						</div>
					</ion-button>
					<ion-button class="get-button">
						<ion-icon class="button-icon" src="assets/icon/apple.svg"/>
						<div class="d-flex flex-direction-column align-items-start">
							<ion-text class="get-button__small-text">GET IT ON</ion-text>
							<ion-text class="get-button__text">Google Play</ion-text>
						</div>
					</ion-button>
				</div>
			</div>
			<!-- slider section -->
			<div class="slider-section">
					<ion-img src="assets/landing/slider.png" class="slider-1" />
			</div>
			<!-- faq section -->
			<div class="faq-section">
				<div class="faq-box">
					<div class="d-flex justify-content-center">
						<ion-text class="md-title">Frequently asked questions</ion-text>
					</div>
					<div class="faq-container">
						<faq-item
							question="What is the guarantee that my message would be replied?"
							answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
						/>
						<faq-item
							question="Are my personal details secured?"
							answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
						/>
						<faq-item
							question="What is your refund policy?"
							answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
						/>
						<faq-item
							question="Can i delete my account?"
							answer="It would definitely be replied because there is an incentive for the recipient of your message to make money when he or she does that."
						/>
					</div>
				</div>
				<ion-img class="bottom-vector" src="assets/landing/Bottom Vector.png" />
			</div>
		</div>
		<landing-footer />
	</ion-page>
</template>
  
<script setup lang="ts">
import { IonPage, IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon, IonButton } from '@ionic/vue';
import LandingHeader from "@/landing/components/landing/LandingHeader.vue";
import LandingFooter from "@/landing/components/landing/LandingFooter.vue";
import NewsItem from "@/landing/components/landing/NewsItem.vue";
import FaqItem from "@/landing/components/landing/FaqItem.vue";
</script>

<style scoped lang="scss">
.landing-page {
	overflow: auto;
	font-family: Lato;
}

.first-part {
	position: relative;

	.bg-blob {
		position: absolute;
		width: 100%;

		&__img {
			width: 100%;
		}
	}

	.bg-blob-1 {
		top: 0;
	}
	.bg-blob-2 {
		top: 10%;
	}
	.bg-blob-3 {
		width: 50%;
		top: 45%;
		right: 10%;
	}
}

.detail-text {
	color: var(--grey-text);
	font-size: 16px;
	font-family: Lato;
	font-weight: 700;
	line-height: 26px;
}

.embrace-section {
	margin-top: 32px;

	&__content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

		.trainers {
		display: flex;
		align-items: center;
		position: relative;

		&__left {
			padding-right: 32px;
			border-right: 1px solid #999;
		}
		&__right {
			padding-left: 32px;
			max-width: 350px;
		}

		.my-location {
			position: absolute;
			top: 75px;
			left: -36px;
		}
	}
}

.get-buttons {
	display: flex;
	gap: 50px;

	.get-button {
		height: 72px;
		background-color: var(--ion-color-white);
		--background: var(--ion-color-white);
		color: var(--ion-color-white-contrast);
		border-radius: 10px;
		font-family: Urbanist;

		.button-icon {
			width: 45px;
			height: 45px;
			margin-right: 8px;
		}

		&__small-text {
			font-size: 16px;
			font-weight: 700;
		}
		&__text {
			font-size: 24px;
			font-weight: 700;
		}
	}
}

.find-section {
	padding-top: 100px;

	.find-content {
		position: relative;

		.my-location {
			position: absolute;
			right: 0;
			top: -40px;
			transform: rotate(35deg);
			width: 30%;
		}
	}
}

.keep-up-section {
	background: var(--gold);
	color: var(--gray-700);
	padding: 100px 0;
}

.video-screen {
	width: 100%;
}
.life-back-section {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.slider-section {
}
.faq-section {
	position: relative;
	padding-bottom: 100px;
	.faq-box {
		max-width: 1041px;
		width: 95%;
		margin: 0 auto;
		border-radius: 24px;
		border: 3px solid var(--gold);
		background: var(--main-color);
		padding: 36px 80px 80px 80px;
	
		.faq-container {
			margin-top: 60px;
			display: flex;
			flex-direction: column;
			gap: 16px;
		}
	
	}
	.bottom-vector {
		position: absolute;
		bottom: -200px;
		z-index: -1;
	}
}
</style>
  