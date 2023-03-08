<template>
  <router-link
    class="item-wrap"
    :to="{ name: EntitiesEnum.Trainer, params: { id: trainer?.id } }"
  >
    <ion-item lines="none" class="trainer-item wrap-item">
      <avatar
        class="trainer-item__avatar"
        :src="trainer.avatarUrl"
        :symbols="symbols"
      />
      <div class="trainer-item__inner">
        <div class="trainer-item__head">
          <ion-label class="trainer-item__title">
            {{ trainer.first_name }} {{ trainer.last_name }}
          </ion-label>
          <rating-number class="trainer-item__rating">
            {{ String(trainer.score?.toFixed(1)) }}
          </rating-number>
          <div class="trainer-item__end">
            <slot name="end"></slot>
          </div>
        </div>
        <address-item class="trainer-item__address" v-if="address">
          {{ address }}
        </address-item>
      </div>
    </ion-item>
  </router-link>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { User } from "@/generated/graphql";
import { IonItem, IonLabel } from "@ionic/vue";
import RatingNumber from "@/general/components/RatingNumber.vue";
import AddressItem from "@/general/components/AddressItem.vue";
import Avatar from "@/general/components/blocks/Avatar.vue";
import { EntitiesEnum } from "@/const/entities";

const props = defineProps<{
  trainer: User;
}>();

const address = computed(() => {
  return (
    props.trainer.facilities?.[0]?.address?.street ?? "Dallas, Wall Street, 24"
  );
});

const symbols = computed(() => {
  return (
    (props.trainer.first_name?.length
      ? props.trainer.first_name?.charAt(0)
      : "") +
    (props.trainer.last_name?.length ? props.trainer.last_name?.charAt(0) : "")
  );
});
</script>

<style lang="scss" scoped>
.item-wrap {
  display: block;
  margin-top: 16px;
}

.trainer-item {
  position: relative;
  --border-radius: 8px;
  --min-height: 68px;
  --padding-top: 15px;
  --padding-bottom: 16px;
  --background: var(--gray-700);
  --padding-start: 16px;
  --padding-end: var(--container-offset);
  --inner-padding-start: 0;
  --inner-padding-end: 0;

  &__avatar {
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    --border-radius: 50%;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    margin-right: 16px;
  }

  &__inner {
    max-width: calc(100vw - 148px);
  }

  &__head {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
    justify-content: flex-start;
  }

  &__rating {
    margin-bottom: 1px;
  }

  &__title {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--ion-color-white);
  }

  &__end {
    position: absolute;
    right: 0;
    top: 6px;
  }

  &__address {
    display: flex;
    align-items: center;
  }

  &__rating {
    margin-left: 12px;
  }
}
</style>
