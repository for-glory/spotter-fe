<template>
  <ion-item class="facility-item">
		<div class="facility-item-inner">
			<ion-avatar class="facility-item__photo">
				<ion-img v-if="photo?.length" :src="photo"></ion-img>
				<template v-else>
					{{ facility.name?.charAt(0) }}
				</template>
			</ion-avatar>
			<div class="facility-item__detail">
				<div class="facility-item__head">
					<ion-label class="facility-item__title">{{ facility.name }}</ion-label>
					<rating-number class="facility-item__rating">{{
						facility.score
					}}</rating-number>
				</div>
				<address-item class="facility-item__address" large>
					{{ facility.address?.street }}
				</address-item>
			</div>
		</div>
  </ion-item>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Facility } from "@/generated/graphql";
import { IonItem, IonImg, IonLabel, IonAvatar } from "@ionic/vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import AddressItem from "@/general/components/AddressItem.vue";

const props = defineProps<{
  facility: Facility;
}>();

const photo = computed(() => {
  return props.facility.media?.length
    ? `${process.env.VUE_APP_MEDIA_URL}${props.facility.media[0]?.path}`
    : "";
});
</script>

<style lang="scss" scoped>
.facility-item {
  --border-radius: 8px;
  --padding-start: 0;
  --padding-end: 0;
  --inner-padding-start: var(--container-offset);
  --inner-padding-end: var(--container-offset);
  --min-height: 160px;
  --inner-padding-top: 10px;
  --inner-padding-bottom: 10px;
  --padding-top: 0;
  --padding-bottom: 0;
  --background: var(--gray-700);
	.facility-item-inner {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 16px;
	}

  &:not(:first-child) {
    margin-top: 16px;
  }

  &__detail {
    width: 100%;
    display: flex;
    min-height: 100%;
    flex-direction: column;
		gap: 24px;
  }

  &__photo {
		width: 100px;
		height: 100px;

    ion-img {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
  }

  &__head {
    display: flex;
    margin-bottom: 4px;
    align-items: center;
    justify-content: flex-start;
  }

  &__rating {
    margin-bottom: 1px;
  }

  &__title {
    display: block;
    margin-right: 12px;
    color: var(--ion-color-white);
		font-size: 25.249px;
		font-style: normal;
		font-weight: 500;
		line-height: 150%;
  }

	&__address {
		color: var(--gray-400);
		font-size: 22.093px;
		font-style: normal;
		font-weight: 300;
		line-height: 150%;
	}

  &__distance {
    margin-right: 3px;
  }
}
</style>
