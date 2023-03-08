<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Order confirmation" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" name="lines" class="spinner" />
      <div class="content" v-else>
        <ion-text
          >Automatically receive confirmation notification when session is
          booked or canceled</ion-text
        >
        <base-toggle
          :value="autoOrderConfirmation"
          content="Auto order confirmation"
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
  SettingsCodeEnum,
  UpdateUserDocument,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { ref } from "vue";

const router = useRouter();
const { id } = useId();

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
</style>
