<template>
    <component-base-layout title="App mode" sub-title="Select which preference you might prefer" @save="changeAppMode">
        <template #content>
            <div class="flex-2">
                <CustomSelection label="Mode" :options="appModes" :selected-value="selectedValue"
                    @select-change="(e) => selectedValue = e"></CustomSelection>
            </div>
        </template>
    </component-base-layout>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import CustomSelection from "./CustomSelection.vue";
import { UpdateUserDocument, MeDocument, SettingsCodeEnum } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { toastController } from "@ionic/vue";

const appModes = [
    {
        title: "System mode",
        value: "SYSTEM_MODE"
    },
    {
        title: "Dark mode",
        value: "DARK_MODE"
    },
    {
        title: "Light mode",
        value: "LIGHT_MODE"
    }
];

const selectedValue = ref(appModes[0]);

const { id } = useId();

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
    const apiMode = data.me?.settings?.find(
        (setting: any) =>
            setting.setting.code === SettingsCodeEnum.AppMode
    )?.value;
    if (apiMode) {
        const appMode = appModes.find(e=>e.value == apiMode);
        selectedValue.value = appMode ? appMode : appModes[0];
    }
});

const changeAppMode = () => {
    mutate({
        id,
        input: {
            settings: [
                {
                    code: SettingsCodeEnum.AppMode,
                    value: selectedValue.value.value,
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
  