<template>
  <div class="search-result" :class="{ 'search-active': isSelected, 'tr-search-result': role === RoleEnum.Trainer }">
    <ion-thumbnail class="search-result__photo">
      <img v-if="photo?.length" :src="photo" class="search-result__img" />
      <template v-else>
        {{ item.name?.charAt(0) }}
      </template>
    </ion-thumbnail>
    <div class="search-result__holder">
      <div class="search-result__header">
        <div class="search-result__header__main">
          <ion-label class="search-result__title">{{ item.name }}</ion-label>
          <rating-number v-if="showRating" class="search-result__rating">
            {{
              item.score?.toString().includes(".")
                ? item?.score
                : `${item?.score}.0` || "0.0"
            }}
          </rating-number>
        </div>
        <div class="search-result__header__end" v-if="$slots.end">
          <slot name="end"></slot>
        </div>
      </div>
      <address-item
        v-if="item.address?.street?.length"
        class="facility-item__address"
      >
        {{ item.address?.street }}
      </address-item>
      <workout-type-item v-if="item.type" class="facility-item__address">
        {{ item?.type }}
      </workout-type-item>
    </div>
    <slot name="check-box"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, withDefaults } from "vue";
import { IonCheckbox, IonLabel, IonThumbnail } from "@ionic/vue";
import AddressItem from "@/general/components/AddressItem.vue";
import WorkoutTypeItem from "@/general/components/WorkoutTypeItem.vue";
import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import RatingNumber from "@/general/components/RatingNumber.vue";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const props = withDefaults(
  defineProps<{
    item: FacilitySearchResult;
    showRating?: boolean;
    isSelected?:boolean;
  }>(),
  {
    showRating: false,
    isSelected: false
  }
);
const { role } = useRoles()
const photo = computed(() => {
  return props.item.media?.length ? props.item.media[0]?.pathUrl : "";
});
</script>

<style lang="scss" scoped>
.search-result {
  display: flex;
  padding: 16px;
  min-height: 99px;
  border-radius: 8px;
  position: relative;
  align-items: center;
  margin-bottom: 15px;
  justify-content: flex-start;
  background: var(--gray-700);
  box-sizing: border-box;

  &__photo {
    flex-shrink: 0;
    --size: 68px;
    font-size: 40px;
    font-weight: 700;
    line-height: 68px;
    text-align: center;
    width: var(--size);
    margin: 0 16px 0 0;
    height: var(--size);
    color: var(--gray-700);
    background: var(--gray-600);
    --border-radius: 8px;
  }

  &__header {
    display: flex;
    margin-bottom: 15px;
    align-items: center;
    justify-content: space-between;

    &__main {
      display: flex;
      overflow: hidden;
      align-items: center;
    }

    &__end {
      margin-left: 8px;
    }
  }

  &__holder {
    align-self: flex-start;
    width: calc(100% - 84px);
  }

  &__title {
    font-size: 16px;
    overflow: hidden;
    font-weight: 500;
    line-height: 1.5;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: var(--ion-color-white);
  }

  &__rating {
    margin-left: 12px;
  }
}

.tr-search-result {
  padding: 12px 16px;
  .search-result__title {
    font-family: Yantramanav;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
  }
}

.search-active {
  box-shadow: inset 0px 0px 0px 0.8px #E1DBC5 !important;
}
</style>
