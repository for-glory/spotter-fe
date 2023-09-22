<template>
  <div class="likes" :class="{'likes-user' : role === RoleEnum.User}">
    <div class="likes__holder">
      <strong class="likes__positive">
        <ion-icon class="likes__icon" src="assets/icon/like.svg" />
        {{ likes }}
      </strong>
      <strong class="likes__negative">
        <ion-icon class="likes__icon" :src="'assets/icon/' + (role === RoleEnum.User ? 'dislike-outline' : 'dislike') + '.svg'" />
        {{ dislikes }}
      </strong>
    </div>
    <ion-progress-bar class="progress" :value="progressValue" />
    <ion-text color="medium" class="likes__reviews"
      >based on {{ total }} reviews
    </ion-text>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { IonText, IonIcon } from "@ionic/vue";
import { IonProgressBar } from "@ionic/vue";
import useRoles from "@/hooks/useRole";
import { RoleEnum } from "@/generated/graphql";

const { role } = useRoles();

defineProps<{
  progressValue: number;
  likes: number;
  dislikes: number;
  total: number;
}>();
</script>

<style lang="scss" scoped>
.likes {
  flex: 1 1 auto;
  text-align: center;
  padding: 0 5px 0 10px;

  &__holder {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 23px;
    font-size: 32px;
    line-height: 1.5;
    font-weight: 700;
  }

  &__positive {
    margin: 0 11px 0 3px;
    display: flex;
    align-items: center;
    color: var(--ion-color-success);
  }

  &__negative {
    display: flex;
    align-items: center;
    color: var(--ion-color-danger-tint);
  }

  &__icon {
    margin-right: 4px;
    font-size: 24px;
    width: 1em;
    height: 1em;
  }

  .progress {
    max-width: 132px;
    height: 2px;
    margin: 0 auto 15px;
    border-radius: 10px;
    --background: var(--ion-color-danger-tint);
    --progress-background: var(--ion-color-success);
  }

  &__reviews {
    font-size: 14px;
    line-height: 1.5;
  }
}

.likes-user {
  .likes__positive,.likes__negative {
    color: var(--gold);
  }
  .progress {
    --background: var(--gold);
  }
}
</style>
