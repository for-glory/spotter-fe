<template>
	<ion-menu content-id="landing-page">
    <ion-header>
      <ion-toolbar class="ion-padding">
				<router-link
					to="/"
				>
					<ion-img
						src="assets/icon/logo-complete.png"
						class="logo"
						alt="logo"
					/>
				</router-link>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
			<div class="landing-menu">
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
		</ion-content>
  </ion-menu>
	<ion-page class="landing-page" id="landing-page">
		<!-- <div class="test"></div> -->
		<ion-grid :fixed="true">
			<landing-header />
		</ion-grid>
		<div>
			<div class="first-part">
				<!-- <div class="bg-blob bg-blob-1">
					<ion-img class="bg-blob__img" src="assets/landing/quickly-blob.png" />
				</div>
				<div class="bg-blob bg-blob-2">
					<ion-img class="bg-blob__img" src="assets/landing/quickly-blob1.png" />
				</div>
				<div class="bg-blob bg-blob-3">
					<ion-img class="bg-blob__img" src="assets/landing/quickly-blob2.png" />
				</div> -->
				<ion-grid :fixed="true">
					<ion-row class="embrace-section">
						<ion-col size="12" size-lg="7" class="embrace-section__content md-align-items-center">
							<div class="embrace-section__content__first">
								<h1 class="lg-title md-text-center">Find your spot, find your fit with <ion-text color="primary">Spotter</ion-text></h1>
								<ion-text class="detail-text">
									Your journey to a healthier, happier you starts now. Take the first step and let Spotter be your partner in reaching new heights of wellness. Together we'll build a stronger fitter, and more confident YOU!
								</ion-text>
								<div class="get-buttons">
									<ion-button class="get-button">
										<ion-icon class="button-icon" src="assets/icon/google-play.svg"/>
										<div class="d-flex flex-direction-column align-items-start">
											<ion-text class="get-button__small-text">DOWNLOAD IT ON THE</ion-text>
											<ion-text class="get-button__text">Google Play</ion-text>
										</div>
									</ion-button>
									<ion-button class="get-button">
										<ion-icon class="button-icon" src="assets/icon/apple.svg"/>
										<div class="d-flex flex-direction-column align-items-start">
											<ion-text class="get-button__small-text"> IT ON THE</ion-text>
											<ion-text class="get-button__text">App Store</ion-text>
										</div>
									</ion-button>
								</div>
								<div class="d-flex flex-direction-column align-items-center ion-padding-end ion-padding-vertical">
									<ion-text class="sm-title"><ion-text color="primary">Connect</ion-text> with hundreds of top Trainers and world-class Gyms near you.</ion-text>
								</div>
							</div>
							<div class="trainers">
								<div class="trainers__left">
									<h1 class="md-title">100+</h1>
									<ion-text class="detail-text">Trainers</ion-text>
								</div>
								<div class="trainers__right">
									<ion-text class="detail-text">Set your time. Set your pace. Maximize your results.</ion-text>
								</div>
							</div>
						</ion-col>
						<ion-col size="12" size-lg="5">
							<ion-img
								src="assets/landing/iPad Pro (12.9 Inch) Mockup.png"
								alt=""
							/>
						</ion-col>
					</ion-row>
				</ion-grid>
				<div class="for-sections">
					<ion-img class="my-location" src="assets/landing/my location small.png" />
					<ion-img class="my-location-1" src="assets/landing/my location.png" />
					<ion-grid :fixed="true">
						<ion-row class="for-section find-section">
							<div class="for-section__img md-order-2">
								<ion-img
									src="assets/landing/iPhone 14 Pro Space Black Mockup.png"
									class=""
									alt="iphone image"
								/>
							</div>
							<div class="for-section__content find-content md-order-1">
								<div>
									<ion-text color="primary"><h5>FIND YOUR FIT</h5></ion-text>
									<div class="for-section__content__detail">
										<h1 class="md-title">Find the nearest <ion-text color="primary">Gym</ion-text> or <ion-text color="primary">Trainer</ion-text> wherever you are and wherever you go.</h1>
										<ion-text class="detail-text">
											Never worry about backsliding; when you have a gym near your home that feels like home, you'll always find yourself in a space free from uncertainty and filled with consistent success.
										</ion-text>
										<div>
											<ion-text class="items-title"><a href="/how-it-works" title="How it works">How to get started</a>:</ion-text>
											<ion-grid>
												<ion-row>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/users.svg"
															size="large"
														/>
														<p>Become a member</p>
														<p class="detail-text">Tell us about yourself! Register and create your profile in seconds.</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/global-search.svg"
															size="large"
														/>
														<p>Search</p>
														<p class="detail-text">Search & match with Gyms and Trainers wherever you are.</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/currency.svg"
															size="large"
														/>
														<p>Pay</p>
														<p class="detail-text">Securely book, pay, and communicate all in-app. Get your sweat on and do it again!</p>
													</ion-col>
												</ion-row>
											</ion-grid>
										</div>
									</div>
								</div>
							</div>
						</ion-row>
					</ion-grid>
					<ion-grid :fixed="true">
						<ion-row class="for-section trainer-section">
							<div class="for-section__content trainers-content md-order-1">
								<div>
									<ion-text color="primary"><h5>FOR TRAINERS</h5></ion-text>
									<div class="for-section__content__detail">
										<h1 class="md-title"><ion-text color="primary">Increase visibility</ion-text> gain exposure and <ion-text color="primary">maximize </ion-text> your earning potential.</h1>
										<ion-text class="detail-text">
											Being a Spotter Trainer gives you access to  our vast network of clients looking for a trainer like you!
										</ion-text>
										<div>
											<ion-text>Benefits Include:</ion-text>
											<ion-grid>
												<ion-row>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/bezier.svg"
															size="large"
														/>
														<p>Flexibility</p>
														<p class="detail-text">Spotter gives you the freedom to create a schedule that works for you!</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/heart-graph.svg"
															size="large"
														/>
														<p>Get Connected</p>
														<p class="detail-text">Safely and securely get matched and communicate with ideal clients.</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/bike.svg"
															size="large"
														/>
														<p>Boost Earnings</p>
														<p class="detail-text">Offer your services in-person and/or digitally anytime, anywhere with DAILYS and maximize your earning potential.</p>
													</ion-col>
												</ion-row>
											</ion-grid>
										</div>
									</div>
								</div>
							</div>
							<div class="for-section__img md-order-2">
								<ion-img
									src="assets/landing/iPhone 14 Pro Space Black Mockup1.png"
									class=""
									alt="iphone image"
								/>
							</div>
						</ion-row>
					</ion-grid>
					<ion-grid :fixed="true">
						<ion-row class="for-section gym-user-section">
							<div class="for-section__img md-order-2">
								<ion-img
									src="assets/landing/iPhone14-2.png"
								/>
							</div>
							<div class="for-section__content gym-user-content md-order-1">
								<div>
									<ion-text color="primary"><h5>GYM OWNERS</h5></ion-text>
									<div class="for-section__content__detail">
										<h1 class="md-title">Increase your visibility with <ion-text color="primary">Spotter</ion-text></h1>
										<ion-text class="detail-text">
											As a gym owner, showcase your facility, amenities, events, and even trainers all in one convenient place. Spotter makes it easy for anyone to find, visit, and make purchases at your facility.
										</ion-text>
										<div>
											<ion-text>Benefits include:</ion-text>
											<ion-grid>
												<ion-row>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/bezier.svg"
															size="large"
														/>
														<p>Visibility</p>
														<p class="detail-text">Exposure is key! Stand out from the rest, and let Spotter help bring more eyes and traffic to your facility</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/heart-graph.svg"
															size="large"
														/>
														<p>Connection</p>
														<p class="detail-text">"Attract, target, and retain more clients with Spotter."</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/users.svg"
															size="large"
														/>
														<p>Amenities</p>
														<p class="detail-text">"Highlight your staff, amenities, offerings, and create events easily and efficiently with Spotter."</p>
													</ion-col>
												</ion-row>
												<ion-row>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/bike.svg"
															size="large"
														/>
														<p>Tools & Features</p>
														<p class="detail-text">Dashboarding, analytics, and facility management. So you can focus on what you do best!</p>
													</ion-col>
												</ion-row>
											</ion-grid>
										</div>
									</div>
								</div>
							</div>
						</ion-row>
					</ion-grid>
					<ion-grid :fixed="true">
						<ion-row class="for-section users-section">
							<div class="for-section__content users-content md-order-1">
								<div>
									<ion-text color="primary"><h5>USERS</h5></ion-text>
									<div class="for-section__content__detail">
										<h1 class="md-title">Gain <ion-text color="primary"> access</ion-text> to hundreds of participating Gyms and Trainers wherever you go.</h1>
										<ion-text class="detail-text">
											As a registered Spotter User, you'll have access to any Spotter Gym or Trainer in our network anywhere in the world. Whether you're vacationing, on the go, new in town, or traveling for work, fitness is always within reach. Spotter takes care of the heavy lifting so you don't have to.
										</ion-text>
										<div>
											<ion-text>Benefits include:</ion-text>
											<ion-grid>
												<ion-row>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/bezier.svg"
															size="large"
														/>
														<p>Flexibility</p>
														<p class="detail-text">Find the closest Gym, Trainer, or Facility in our network. We bring fitness right to your fingertips.</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/heart-graph.svg"
															size="large"
														/>
														<p>Connect</p>
														<p class="detail-text">Book, pay, and safely communicate all in-app. Spend less time researching and calling. We’ve got you covered.</p>
													</ion-col>
													<ion-col size="12" size-sm="4">
														<ion-icon
															src="assets/icon/bike.svg"
															size="large"
														/>
														<p>On the GO!</p>
														<p class="detail-text">Take your favorite Trainer or Gym with you wherever you go. With Dailys, you can enjoy your favorite Trainer or workout for the price of a cup of coffee!</p>
													</ion-col>
												</ion-row>
											</ion-grid>
										</div>
									</div>
								</div>
							</div>
							<div class="for-section__img md-order-2">
								<ion-img
									src="assets/landing/iPhone14-3.png"
								/>
							</div>
						</ion-row>
					</ion-grid>
				</div>
			</div>
			<!-- find a gym section -->
			<div>
				<div class="d-flex flex-direction-column align-items-center">
					<h1 class="lg-title">Find a Gym or Trainer</h1>
					<ion-text class="sm-title">YOUR FIT, YOUR WAY!</ion-text>
				</div>
				<div class="mt-3 find-map">
						<base-layout
							draggable
							header-fixed
							ref="layout"
							:offset-top="64"
							:content-full-height="isMapFullscreen"
							:initial-breakpoint="!isMapFullscreen ? 0.5 : 1"
						>
							<template #header>
								<search-form
									:filters="
										availabilityFilters
											? {
													availability: {
														date_from: availabilityFilters.date_from,
														date_to: availabilityFilters.date_to,
													},
												}
											: {}
									"
									:type="activeTab"
									@handle-focus="isSearchOnFocus = true"
									@handle-blur="isSearchOnFocus = false"
									:filters-btn="activeTab === EntitiesEnum.Trainers"
									@apply-filters="applyFilters"
									@reset-filters="resetFilters"
								/>
							</template>

							<template #static>
								<div class="page-map">
									<items-map
										:items="locations"
										:center="userLocation"
										@marker-click="selectItem"
										@fullscreen="changeMapView"
										:selected-item="selectedItem"
										@change-position="mapPositionChanged"
										:use-current-location="useCurrentLocation"
									>
									</items-map>
								</div>
							</template>

							<template #draggable>
								<facilities-page-public
									:filters="mapPosition"
									@toggle-modal="showDraggable"
									v-if="activeTab === EntitiesEnum.Facilities"
									@location-items="mapItemsChanged"
									:selected="selectedItem"
									@deselect="selectedItem = null"
								/>

								<trainers-page-public
									:filters="mapPosition"
									:availability-filters="availabilityFilters"
									@toggle-modal="showDraggable"
									v-if="activeTab === EntitiesEnum.Trainers"
									@location-items="mapItemsChanged"
									:selected="selectedItem"
									@deselect="selectedItem = null"
								/>
							</template>
						</base-layout>

						<div
							class="page-tabs-container"
							v-if="activeTab && !isSearchOnFocus"
						>
							<page-tabs
								:tabs="tabs"
								class="page-tabs"
								:value="activeTab"
								@change="tabsChanged"
							/>
						</div>
				</div>
			</div>
			<!-- keep up section -->
			<div class="keep-up-section">
				<ion-grid :fixed="true">
					<ion-row>
						<ion-col size="12">
							<h1 class="xl-title">Keep a steady pulse on your fit with Spotter.</h1>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col size="0" size-md="5">
						</ion-col>
						<ion-col size="12" size-md="7" class="ion-padding-bottom">
							<ion-text class="sm-title ion-padding-bottom">GYMS AND FACILITIES - The revolution of fitness is here! With Spotter, take control of your business your way! Attract new clientele, increase foot traffic, highlight your amenities, and keep them coming back for more. The Spotter app was designed with your business in mind. Whether big or small, single or with multiple locations, Spotter can highlight your facility, offerings, events, trainers, and more.</ion-text>
						</ion-col>
					</ion-row>
					<ion-row>
						<ion-col size="12">
							<ion-img
								src="assets/landing/Person in red sweater holding a phone mockup (Mockuuups Studio).png"
							/>
						</ion-col>
					</ion-row>
					<div class="mt-3 first-content">
						<div class="detail">
							<!-- <ion-text class="sm-title">TRAINERS - Get matched with clientele specifically looking for someone like you! Whether this is a side hustle or your full-time job, whether you are just starting out or a seasoned trainer, Spotter can do the heavy lifting. With Spotter, you can progressively overload your schedule while having the freedom and flexibility to be you!</ion-text> -->
						</div>
						<div>
							<ion-button
								class="button-dark large-btn"
								type="button"
							>
								Find out more about our mission
							</ion-button>
						</div>
					</div>
					<div class="mt-3 second-content">
						<div>
							<ion-img
								src="assets/landing/2 persons.png"
								style="max-width: 500px;"
							/>
						</div>
						<div class="detail">
							<ion-text class="sm-title">TRAINERS - Get matched with clientele specifically looking for someone like you! Whether this is a side hustle or your full-time job, whether you are just starting out or a seasoned trainer, Spotter can do the heavy lifting. With Spotter, you can progressively overload your schedule while having the freedom and flexibility to be you!</ion-text>
							<div class="ion-padding-top">
								<ion-button
									class="button-dark large-btn"
									type="button"
								>
									Checkout our Mission Roadmap
								</ion-button>
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
				<ion-content class="video-content" overflow-scroll="true">
					<video controls preload="metadata" webkit-playsinline="webkit-playsinline">
						<source src="assets/landing/video.png" type="video/mp4" />
					</video>
				</ion-content>
			</div>
			<!-- get your life back section -->
			<div class="life-back-section">
				<div>
					<div class="ion-text-center">
						<div class="lg-title">With Spotter, you can Spot, <br>Sweat, <ion-text color="primary"> Repeat</ion-text></div>
					</div>
					<div class="mt-2 ion-text-center">
						<ion-text class="sm-title">App available on both iOS and Android</ion-text>
					</div>
					<div class="mt-2 ion-text-center ion-padding-top">
						<ion-text class="sm-title">DOWNLOAD NOW!</ion-text>
					</div>
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
							<ion-text class="get-button__small-text">Download on the</ion-text>
							<ion-text class="get-button__text">App Store</ion-text>
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
						<ion-text class="md-title faq-box__title">Frequently asked questions</ion-text>
					</div>
					<div class="faq-container">
						<faq-item
							question="What is Spotter?"
							answer="Spotter is the app that filters nearby gyms and/or trainers according to user preferences. It is free* to create a profile for users and offers bundled discount drop-in rates to in-network gyms for travelers or gym-goers who just want to try something new. Payment is all in-app. Users can also connect, chat, and book with trainers all in-app. Both gyms and trainers have reviews and rankings by confirmed users/clients. (* There is a one time $1.99 identity verification fee to help keep our network safe!)"
						/>
						<faq-item
							question="What makes Spotter unique?"
							answer="By harnessing our SpotFit technology we provide the best matches based on preferences and proximity. We offer in-app booking, communication, and payment tools so you can manage gym access and/or trainer scheduling easily and from anywhere."
						/>
						<faq-item
							question="I am new to fitness. How can Spotter help me? "
							answer="We take the guesswork out of fitness! Our onboarding makes it simple to build your free, unique profile. Spotter filters the best gyms and trainers near you according to your custom preferences and needs. Read through posted reviews from others about each provider before you decide what is best for you. Use discounted drop-in bundles to try out a new gym. Chat and communicate with matched trainers, and book and pay right in the app."
						/>
						<faq-item
							question="I am a trainer. How can I join?"
							answer="We would love for you to join our network! Joining is free. Download the app, create your Trainer account, and let the fitness roll! You have full control over your booked sessions and rates. We secure a flat fee for any service booked within the app."
						/>
					</div>
				</div>
				<!-- <ion-img class="bottom-vector" src="assets/landing/Bottom Vector.png" /> -->
			</div>
		</div>
		<landing-footer />
	</ion-page>
</template>
  
<script setup lang="ts">
import { IonPage, IonCol, IonGrid, IonRow, IonText, IonImg, IonIcon, IonButton, IonContent, IonMenu, IonTitle, IonToolbar, IonHeader } from '@ionic/vue';
import LandingHeader from "@/landing/components/landing/LandingHeader.vue";
import LandingFooter from "@/landing/components/landing/LandingFooter.vue";
import NewsItem from "@/landing/components/landing/NewsItem.vue";
import FaqItem from "@/landing/components/landing/FaqItem.vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import SearchForm from "@/general/components/forms/SearchForm.vue";
import FacilitiesPagePublic from "@/landing/components/landing/FacilitiesPagePublic.vue";
import TrainersPagePublic from "@/landing/components/landing/TrainersPagePublic.vue";
import PageTabs from "@/general/components/PageTabs.vue";
import ItemsMap, { MapMarkerItem } from "@/general/components/ItemsMap.vue";
import { TabItem } from "@/interfaces/TabItem";
import { EntitiesEnum } from "@/const/entities";
import { MapFilters, PositionLatLng } from "@/ts/types/map";
import { debounce } from "lodash";
import { computed, ref } from "vue";


const isMapFullscreen = ref<boolean>(false);
const isSearchOnFocus = ref<boolean>(false);
const selectedItem = ref<string | null>(null);
const locations = ref<MapMarkerItem[]>([]);

const layout = ref<typeof BaseLayout | null>(null);

const tabs: TabItem[] = [
  {
    name: EntitiesEnum.Facilities,
    label: "Gyms",
  },
  {
    name: EntitiesEnum.Trainers,
    label: "Trainers",
  },
];

const preferredTab: EntitiesEnum = localStorage.getItem(
  "preferred_booking_tab"
) as EntitiesEnum;
const activeTab = ref<EntitiesEnum>(preferredTab ?? EntitiesEnum.Facilities);

const tabsChanged = (ev: EntitiesEnum) => {
  if (ev) activeTab.value = ev;
  selectedItem.value = null;
};

const showDraggable = () => {
  layout?.value?.showDraggable();
};

const useCurrentLocation = ref<boolean>(false);
const userLocation = ref<PositionLatLng>({
  lat: Number(process.env.VUE_APP_DEFAULT_POSITION_LAT),
  lng: Number(process.env.VUE_APP_DEFAULT_POSITION_LNG),
});

const mapPosition = ref<MapFilters>({
  position: userLocation.value,
  distance: 6,
});

const mapPositionChanged = debounce((result: MapFilters) => {
  selectedItem.value = null;
  mapPosition.value = result;
}, 500);

const changeMapView = (isFullscreen: boolean) => {
  isMapFullscreen.value = isFullscreen;
};

const mapItemsChanged = (items: MapMarkerItem[]) => {
  locations.value = items;
};

const availabilityFilters = ref();

const applyFilters = (filters: any) => {
  availabilityFilters.value = filters;
};

const resetFilters = () => {
  availabilityFilters.value = null;
};

const selectItem = (id: string) => {
  selectedItem.value = selectedItem.value !== id ? id : null;
};
</script>

<style scoped lang="scss">
.landing-page {
	overflow: auto;
	font-family: Lato;

	.test {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 6000px;
		background-image: url(/public/assets/backgrounds/image1.png);
		background-size: cover;
	}
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
	font-family: Lato;
	font-size: 16px;
	font-style: normal;
	font-weight: 700;
	line-height: 26px;
}

.embrace-section {
	margin-top: 8px;

	&__content {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 20px;
		padding-top: 12px;

		&__first {
			display: flex;
			flex-direction: column;
			gap: 24px;
		}
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
	}
}

.get-buttons {
	display: flex;
	flex-wrap: wrap;
	gap: 50px;

	@media (max-width: 992px) {
		gap: 30px;
		justify-content: center;
	}

	.get-button {
		height: 72px;
		width: 236px;
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

.for-sections {
	position: relative;

	.my-location {
		position: absolute;
		top: -28px;
		left: 86px;
	}
	.my-location-1 {
		position: absolute;
		right: 0px;
		top: 110px;
		width: 33%;
	}
	.find-section {
		margin-top: 210px;
		padding: 0px 72px;
		position: relative;
	
		.find-content {
			padding-top: 60px;
		}
	}
	.trainer-section {
		padding: 0px 84px;
		.trainers-content {
			margin-top: 4px;
		}
	}
	.gym-user-section {
		padding: 0px 50px;
		.gym-user-content {
			margin-top: 38px;
		}
	}
	.users-section {
		.users-content {
			margin-top: 40px;
		}
	}
	
	.for-section {
		display: flex;
		justify-content: space-between;
		margin-bottom: 65px;

		@media (max-width: 992px) {
			justify-content: center;
		}
	
		h5 {
			margin: 0;
		}
	
		&__content {
			width: 100%;
			max-width: 500px;
	
			&__detail {
				display: flex;
				flex-direction: column;
				gap: 24px;
	
				h1 {
					margin: 16px 0 0 0;
				}
	
				.items-title {
	
				}
			}
		}
		&__img {
			ion-img {
				max-width: 100%;
				max-height: 100%;
			}
		}
	}
}
.find-map {
  height: 85vh;
	position: relative;

	.fixed-content {
		position: absolute !important;
	}
	.page-map {
		height: 100%;
	}
	.page-tabs-container {
		position: absolute;
		bottom: 5%;
		width: 100%;

		.page-tabs {
			width: 90%;
			margin: 0 auto;
		}
	}
}

.keep-up-section {
	background: var(--gold);
	color: var(--gray-700);
	padding: 100px 0;

	.detail {
		max-width: 645px;
	}
	.first-content {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.second-content {
		display: flex;
		gap: 78px;
		align-items: center;
		flex-wrap: wrap;
	}
}

.video-content {
	width: 100%;
}
.life-back-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 40px;
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

		&__title {
			text-align: center;
		}
	
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
		width: 100%;
	}
}

.landing-menu {
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__item {
		color: var(--ion-color-white);
		text-align: center;
		font-size: 16px;
		font-style: normal;
		line-height: normal;
	}
}

@media (max-width: 992px) {
	.first-part {
		padding: 0 20px;

		.find-section {
			padding: 0;
			margin-top: 40px;
		}

		.trainer-section {
			padding: 0;
		}
		.gym-user-section {
			padding: 0;
		}
		.users-section {
			padding: 0;
		}
	}
	.keep-up-section {
		padding: 30px 20px;
	}
	.faq-section {
		.faq-box {
			padding: 20px;
		}
	}
}
</style>
  