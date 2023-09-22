<template>
  <ion-text :class="{ total: isTotal,'user-rating' : role === RoleEnum.User }" class="rating">
    {{ value.toString().includes(".") ? value : `${value}.0` || "0.0" }}
  </ion-text>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { IonText } from "@ionic/vue";
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";

const { role } = useRoles();

withDefaults(
  defineProps<{
    value: number;
    isTotal?: boolean;
  }>(),
  {
    isTotal: false,
  }
);
</script>

<style scoped lang="scss">
.rating {
  border: 1px solid var(--gray-400);
  border-radius: 20px;
  padding: 2px 10px;
  font-weight: 500;
  font-size: 12px;
  color: var(--ion-color-white);

  &.total {
    border-color: var(--gold);
    color: var(--gold);
  }
}
.user-rating {
  border-color: var(--gold);
  color: var(--gold);
  font-family: "Yantramanav";
  height: 22px;
}
</style>
