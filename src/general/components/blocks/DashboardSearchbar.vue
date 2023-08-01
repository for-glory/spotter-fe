<template>
	<div class="searchbar">
		<div class="search-section">
		</div>
		<div class="notification">
			<div>
				<ion-icon src="assets/icon/notification.svg" />
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
.searchbar {
	height: 90px;
	border-bottom: 1px solid #EBEFF2;
	display: flex;
	justify-content: space-between;
	padding: 30px 32px;

	.notification {
		ion-icon {
			font-size: 32px;
			color: #C2CFE0;
		}
	}
}
</style>
