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
			<div class="facility">
				<ion-avatar class="photo">
					<ion-img v-if="avatarUrl" :src="avatarUrl"></ion-img>
					<template v-else>
						{{ facilityName?.charAt(0) }}
					</template>
				</ion-avatar>
				<div>
					<ion-title class="name">{{ facilityName }}</ion-title>
					<ion-text class="address">{{ facilityAddress }}</ion-text>
				</div>
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
				<div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardWorkout)">
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
				<div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardGettingPaid)">
					<ion-icon src="assets/icon/Card.svg" />
					<ion-text>Getting Paid</ion-text>
				</div>
				<div class="menu-item" @click="onHandleClickMenu(EntitiesEnum.DashboardSettings)">
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
	<confirmation
    :is-visible="showConfirmationModal"
    title="Do you want to log out?"
    description="You will be logged out"
    button-text="Log out"
    @discard="onLogoutConfirmed"
    @decline="hideModal"
  />
</template>

<script lang="ts" setup>
import { IonText, IonImg, IonIcon, IonAvatar, IonTitle } from '@ionic/vue';
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import { ref, computed, onMounted, defineProps, withDefaults } from "vue";
import { useConfirmationModal } from "@/hooks/useConfirmationModal";
import Confirmation from "@/general/components/modals/confirmations/Confirmation.vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";

const props = withDefaults(
  defineProps<{
    facilities: any;
  }>(),
  {
		facilities:[]
  }
);

const facilityStore = useFacilityStore();

const router = useRouter();
const activeFacilityId = ref<string | null>(props.facilities[0]?.id);
const { showConfirmationModal, hideModal, showModal } = useConfirmationModal();

facilityStore.setFacility(props.facilities[0]);

// onMounted(() => {
// 	localStorage.setItem('currentFacility', JSON.stringify(props.facilities[0]));
// });

const facilities = computed(() => {
  return props.facilities;
});

const avatarUrl = computed(() => {
	const facility = facilities.value?.find(
		(facility) => facility?.id === activeFacilityId.value
	);
	return facility?.media[0]?.pathUrl??""
});
const facilityName = computed<string>(
  () =>
    facilities.value?.find(
      (facility: any) => facility.id === activeFacilityId.value
    )?.name ?? ""
);
const facilityAddress = computed<string>(
  () =>
    facilities.value?.find(
      (facility: any) => facility.id === activeFacilityId.value
    )?.address?.street ?? ""
);

const onHandleClickMenu = (pathName: string) => {
	console.log(pathName)
  router.push({ name: pathName });
};

const onLogout = () => {
  showModal();
};

const onLogoutConfirmed = () => {
  clearAuthItems();
  router.push({ name: EntitiesEnum.Login });
  hideModal();
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

	.facility {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 0 24px;

		.photo {
			width: 46px;
			height: 46px;
		}
		.name {
			padding: 0;
		}
		.address {
			color: var(--gray-400);
			font-family: Yantramanav;
			font-size: 14px;
			font-style: normal;
			font-weight: 400;
			line-height: 150%; /* 21px */
		}
	}

	.logout {
		width: 100%;
		position: absolute;
		bottom: 0;
		border-top: 1px solid rgba(255, 255, 255, 0.60);
	}
}
</style>
