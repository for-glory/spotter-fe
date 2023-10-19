<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Change language" @back="onBack" />
    </template>
    <template #content>
      <div class="languages">
        <ion-radio-group v-model="selectedLanguage" v-on:ion-change="changeLanguage">
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'ENGLISH'"
            value="ENGLISH"
            title="English"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'UKRAINIAN'"
            value="UKRAINIAN"
            title="Ukrainian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'SPANISH'"
            value="SPANISH"
            title="Spanish"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'ITALIAN'"
            value="ITALIAN"
            title="Italian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'GERMAN'"
            value="GERMAN"
            title="German"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'ARABIC'"
            value="ARABIC"
            title="Arabic"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'BULGARIAN'"
            value="BULGARIAN"
            title="Bulgarian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'CROATIAN'"
            value="CROATIAN"
            title="Croatian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'GEORGIAN'"
            value="GEORGIAN"
            title="Georgian"
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

const selectedLanguage = ref("ENGLISH");

const router = useRouter();
const { id } = useId();

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
  const apiLang = data.me?.settings?.find(
    (setting: any) =>
      setting.setting.code === SettingsCodeEnum.Language
  )?.value;
  if(apiLang){
    selectedLanguage.value = apiLang;
  }
});

const changeLanguage = () => {
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.Language,
          value: selectedLanguage.value,
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
.languages {
  padding: 24px;
}
</style>
