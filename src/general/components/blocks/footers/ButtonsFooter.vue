<template>
  <div class="buttons__container" :class="(role === RoleEnum.Trainer || role === RoleEnum.User) ? 'buttons__container__trainer' : ''">
    <ion-button
      @click="$emit('handle-click')"
      class="submit-btn"
      :disabled="disabled"
    >
      {{ mainButtonText }}
    </ion-button>
    <ion-button
      v-if="secondaryButtonText"
      class="secondary secondary-btn"
      @click="$emit('handle-secondary-click')"
    >
      {{ secondaryButtonText }}
    </ion-button>
  </div>
</template>

<script setup lang="ts">
import { RoleEnum } from "@/generated/graphql";
import useRoles from "@/hooks/useRole";
import { IonButton } from "@ionic/vue";
import { defineProps, defineEmits, withDefaults } from "vue";

const { role } = useRoles();
withDefaults(
  defineProps<{
    mainButtonText: string;
    secondaryButtonText?: string;
    disabled: boolean;
  }>(),
  {
    secondaryButtonText: "",
    disabled: false,
  }
);
defineEmits<{
  (e: "handle-click"): void;
  (e: "handle-secondary-click"): void;
}>();
</script>

<style lang="scss" scoped>
.buttons {
  &__container {
    padding: 20px 24px calc(20px + var(--ion-safe-area-bottom));
  }
}

.submit-btn,
.secondary-btn {
  margin: 0;
  width: 100%;
}
.buttons__container__trainer {
  ion-button {
    font-family: "Yantramanav";
  }
}
</style>
