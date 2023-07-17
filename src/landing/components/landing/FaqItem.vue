<template>
	<div class="faq-item">
		<div class="faq-item__question" @click="handleOpen">
			<ion-text>
				{{ question }}
			</ion-text>
			<div class="arrow-icon">
				<ion-icon
					src="assets/icon/arrow-down-light.svg"
					v-if="!isOpened"
				/>
				<ion-icon
					src="assets/icon/arrow-up-light.svg"
					v-if="isOpened"
				/>
			</div>
		</div>
		<ion-text class="faq-item__answer" v-if="isOpened">
			{{ answer }}
		</ion-text>
	</div>
</template>

<script setup lang="ts">
import { IonIcon, IonText } from "@ionic/vue";
import { defineProps, withDefaults } from "vue";
import { ref } from "vue";

withDefaults(
  defineProps<{
    question: string;
    answer: string;
  }>(),
  {}
);

const isOpened = ref<boolean>(false);

const handleOpen = () => {
	isOpened.value = !isOpened.value
}

</script>

<style scoped lang="scss">
.faq-item {
	font-family: Lato;
	
	padding: 34px 40px;
	border-radius: 50px;
	border: 1px solid var(--grey-text);
	box-shadow: 0px 4px 30px 0px rgba(0, 0, 0, 0.10);

	&__question {
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: var(--ion-color-white);
		font-size: 16px;
		font-weight: 500;
		line-height: 28.8px;
	}

	&__answer {
		margin-top: 20px;
		color: var(--grey-text);
		font-size: 14px;
		font-weight: 300;
		line-height: 28.8px;
		padding-right: 32px;
	}

	.arrow-icon {
		font-size: 20px;
	}
}
</style>
  