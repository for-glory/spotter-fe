<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="App mode" @back="onBack" />
    </template>
    <template #content>
      <div class="modes">
        <ion-radio-group v-model="selectedAppMode" v-on:ion-change="changeAppMode">
          <base-radiobutton
            light
            :is-checked="selectedAppMode === 'SYSTEM_MODE'"
            value="SYSTEM_MODE"
            title="System mode"
          />
          <base-radiobutton
            light
            :is-checked="selectedAppMode === 'DARK_MODE'"
            value="DARK_MODE"
            title="Dark mode"
          />
          <base-radiobutton
            light
            :is-checked="selectedAppMode === 'LIGHT_MODE'"
            value="LIGHT_MODE"
            title="Light mode"
          />
        </ion-radio-group>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseRadiobutton from "@/general/components/base/BaseRadiobutton.vue";
import { IonRadioGroup } from "@ionic/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { UpdateUserDocument, MeDocument, SettingsCodeEnum } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { useMutation, useQuery } from "@vue/apollo-composable";

const selectedAppMode = ref("SYSTEM_MODE");

const router = useRouter();
const { id } = useId();

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
  const apiMode = data.me?.settings?.find(
    (setting: any) =>
      setting.setting.code === SettingsCodeEnum.AppMode
  )?.value;
  if(apiMode){
    selectedAppMode.value = apiMode;
  }
});

const changeAppMode = () => {
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.AppMode,
          value: selectedAppMode.value,
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
.modes {
  padding: 24px;
}
</style>
