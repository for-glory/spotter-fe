<template>
  <component-base-layout title="Change Language"
    sub-title="Manage which languages are used to personalize your Spotter experience" @save="changeLanguage">
    <template #content>
      <div class="flex-2">
        <CustomSelection :selected-value="selectedLanguage" :options="languages" label="Language"
          @select-change="(e) => selectedLanguage = e"></CustomSelection>
      </div>
    </template>
  </component-base-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import CustomSelection from "./CustomSelection.vue";
import useId from "@/hooks/useId";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { UpdateUserDocument, MeDocument, SettingsCodeEnum } from "@/generated/graphql";
import { toastController } from "@ionic/vue";

const languages = [
  {
    title: "English",
    value: "ENGLISH"
  },
  {
    title: "Ukrainian",
    value: "UKRAINIAN"
  },
  {
    title: "Spanish",
    value: "SPANISH"
  },
  {
    title: "Italian",
    value: "ITALIAN"
  },
  {
    title: "German",
    value: "GERMAN"
  },
  {
    title: "Arabic",
    value: "ARABIC"
  },
  {
    title: "Bulgarian",
    value: "BULGARIAN"
  },
  {
    title: "Croatian",
    value: "CROATIAN"
  },
  {
    title: "Georgian",
    value: "GEORGIAN"
  },
];
const selectedLanguage = ref(languages[1]);

const { id } = useId();

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
  const apiLang = data.me?.settings?.find(
    (setting: any) =>
      setting.setting.code === SettingsCodeEnum.Language
  )?.value;
  if (apiLang) {
    selectedLanguage.value = {
      title: apiLang,
      value: apiLang
    };
  }
});

const changeLanguage = () => {
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.Language,
          value: selectedLanguage.value.value,
        },
      ],
    },
  })
    .then(async () => {
      refetch();
      const toast = await toastController.create({
        message: "Updated successfully",
        duration: 2000,
        icon: "assets/icon/success.svg",
        cssClass: "success-toast",
      });
      toast.present();
    })
    .catch((error) => {
      throw new Error(error);
    });
};


</script>
<style scoped lang="scss"></style>
