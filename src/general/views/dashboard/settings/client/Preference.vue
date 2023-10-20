<template>
  <ComponentBaseLayout title="Preference" sub-title="Customize what you see" @save="changePreferences">
    <template #content>
      <div class="toggle-btns flex-2">
        <base-toggle @click="selectedPreferences = preference.id" v-for="preference in preferences" :value="selectedPreferences === preference.id" :content="preference.title" />
      </div>
    </template>
  </ComponentBaseLayout>
</template>
<script setup lang="ts">
import { EntitiesEnum } from "@/const/entities";
import { MeDocument, SettingsCodeEnum, UpdateUserDocument } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { toastController } from "@ionic/vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { ref } from "vue";
import ComponentBaseLayout from "../ComponentBaseLayout.vue";
import BaseToggle from "@/general/components/base/BaseToggle.vue";

const { id } = useId();

const preferences = [
{
      title: 'Display gyms',
      id: EntitiesEnum.Facilities
    },
    {
      title: 'Display trainers',
      id: EntitiesEnum.Trainers
    }
]

const selectedPreferences = ref('');

const { onResult, refetch, loading } = useQuery(
  MeDocument,
  { id },
  {
    fetchPolicy: "no-cache",
  }
);

onResult(({ data }) => {
  const preference = data.me?.settings?.find(
    (setting: any) =>
      setting.setting.code === SettingsCodeEnum.DisplayPreference
  )?.value;
  if (preference) {
    selectedPreferences.value = preference;
  }
});

const { mutate } = useMutation(UpdateUserDocument);

const showToast = async (msg: string, key: string, icon: string) => {
  const toast = await toastController.create({
    message: msg,
    duration: 2000,
    icon: `assets/icon/${icon}.svg`,
    cssClass: `${key}-toast`,
  });
  return toast.present();
};

const changePreferences = () => {
  mutate({
    id,
    input: {
      settings: [
        {
          code: SettingsCodeEnum.DisplayPreference,
          value: selectedPreferences.value
        }
      ]
    },
  })
    .then(() => {
      refetch();
      showToast("Preferences successfully updated", "success", "success");
    })
    .catch(() => {
      showToast("Something went wrong. Try again.", "danger", "info");
    });
};
</script>
<style scoped lang="scss">
.toggle-btns {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 473px;
  margin-top: 25px;
}
</style>
