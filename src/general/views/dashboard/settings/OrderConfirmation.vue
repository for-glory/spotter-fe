<template>
  <component-base-layout title="Order confirmation"
    sub-title="Automatically receive confirmation notification when session is booked or canceled">
    <template #content>
      <div class="content flex-2">
        <ion-spinner v-if="loading" name="lines" class="spinner" />
        <base-toggle v-else :value="autoOrderConfirmation" content="Auto order confirmation" @change="onHandleChange" />
      </div>
    </template>
  </component-base-layout>
</template>

<script setup lang="ts">
import { IonSpinner } from "@ionic/vue";
import { useRouter } from "vue-router";
import { useMutation, useQuery } from "@vue/apollo-composable";
import {
  MeDocument,
  SettingsCodeEnum,
  UpdateUserDocument,
} from "@/generated/graphql";
import useId from "@/hooks/useId";
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";

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
  margin-top: 46px;
  max-width: 473px;
}

.spinner {
  display: block;
}
</style>
