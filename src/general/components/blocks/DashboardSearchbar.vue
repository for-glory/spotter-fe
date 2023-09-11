<template>
	<div class="searchbar">
		<div class="search-section">
			<ion-searchbar
				ref="searchBar"
				@ion-change="search"
				@ion-focus="focusHandle"
				show-clear-button="never"
				class="search-section__control"
				search-icon="assets/icon/search.svg"
				placeholder="Search"
			>
			</ion-searchbar>
		</div>
		<div class="notification">
			<div>
				<ion-icon src="assets/icon/notification.svg" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import {
	IonIcon,
  IonSearchbar,
  SearchbarCustomEvent,
} from '@ionic/vue';
import { useRouter } from "vue-router";
import { EntitiesEnum } from "@/const/entities";
import { clearAuthItems } from "@/router/middleware/auth";
import debounce from "lodash/debounce";

const router = useRouter();

const focusHandle = () => {
  // isFocused.value = true;
  // emits("handle-focus");
};

const search = debounce((event?: SearchbarCustomEvent) => {
  // if (props.hideResults) {
  //   emits("search", event?.detail?.value);
  //   return;
  // }
  // searchQuery.value = event?.detail?.value || "";
  // props.type === EntitiesEnum.ActivitiesNearby;
  // activityRefetch({ first: 100, search: searchQuery.value });
}, 1000);

</script>
<style scoped lang="scss">
.searchbar {
	height: 90px;
	border-bottom: 1px solid #EBEFF2;
	display: flex;
	justify-content: space-between;
	padding: 30px 32px;
	align-items: center;

	.search-section {
		width: 80%;
		color: var(--gold);
		&__control {
			font-family: 'Poppins';
			padding: 0;
			width: 100%;
			z-index: 15;
			transition: right 0.35s ease;
			--border: none;
			--color: var(--ion-color-white);
			--placeholder-opacity: 1;
			--icon-color: var(--gray-500);
			--placeholder-font-weight: 300;
			--placeholder-color: var(--gold);
			--box-shadow: none;
			font-size: 12px !important;
	
			&--with-back-btn {
				width: calc(100% - 56px);
			}
		}
	}
	.notification {
		ion-icon {
			font-size: 32px;
			color: #C2CFE0;
		}
	}
}
</style>
