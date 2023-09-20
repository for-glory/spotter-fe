<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Order confirmation" :title-class="role === RoleEnum.Trainer ? 'title-ytmn-20' : undefined"  @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <div class="content" :class="{ 'tr-content': role === RoleEnum.Trainer }" v-else>
        <ion-text
          >Automatically receive confirmation notification when session is
          booked or canceled</ion-text
        >
        <base-toggle
          :value="autoOrderConfirmation"
          content="Auto order confirmation"
          class="tr-toggle"
          @change="onHandleChange"
        />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import { IonText, IonSpinner } from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  MeDocument,
  RoleEnum,
  SettingsCodeEnum,
  UpdateUserDocument,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { ref } from "vue";
import useRoles from "@/hooks/useRole";

const router = useRouter();
const { id } = useId();
const { role } = useRoles();

const autoOrderConfirmation = ref(false);

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
  autoOrderConfirmation.value = data.me?.settings?.find(
    (setting: any) =>
      setting.setting.code === SettingsCodeEnum.AutoOrderConfirmation
  )?.value;
});

const onHandleChange = (checked: boolean) => {
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.AutoOrderConfirmation,
          value: checked,
        },
      ],
    },
  })
    .then(() => {
      refetch();
    })
    .catch((error) => {
      throw new Error(error);
    });
};

const onBack = () => {
  router.go(-1);
};
</script>

<style scoped lang="scss">
.content {
  padding: 24px;
}

ion-text {
  display: block;
  margin-bottom: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: var(--ion-color-medium);
}
.spinner {
  display: block;
  margin: 30vh auto;
}

.tr-content { 
  ion-text {
    color: var(--gray-600);
    font-family: Yantramanav;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
</style>
