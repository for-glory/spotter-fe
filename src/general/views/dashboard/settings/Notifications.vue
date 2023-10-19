<template>
    <ComponentBaseLayout title="Notification" sub-title="Select which preference you might prefer"
        @save="changeNotificationSetting">
        <template #content>
            <div class="notification flex-2">
                <base-toggle v-for="notification in notifications" v-model:value="notification.value"
                    :content="notification.title" />
            </div>
        </template>
    </ComponentBaseLayout>
</template>
  
<script setup lang="ts">
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import { useRouter } from "vue-router";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import { UpdateUserDocument, MeDocument, SettingsCodeEnum } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref } from "vue";
import { toastController } from "@ionic/vue";

const router = useRouter();
const { id } = useId();
const notificationData = [
    {
        title: "Show notification",
        value: false,
        id: SettingsCodeEnum.ShowNotifications
    },
    {
        title: "With sound",
        value: false,
        id: SettingsCodeEnum.EnableSoundForNotifications
    },
    {
        title: "With vibration",
        value: false,
        id: SettingsCodeEnum.EnableVibrationOnNotification
    }
];
const notifications = ref(notificationData);

const { mutate } = useMutation(UpdateUserDocument);

const { onResult, loading, refetch } = useQuery(MeDocument, { id });

onResult(({ data }) => {
    if (data.me?.settings?.length) {
        data.me?.settings.forEach((setting: any) => {
            const f = notifications.value.findIndex(e => e.id === setting?.setting.code);
            if (f >= 0) {
                notifications.value[f].value = setting.value;
            }
        });
    }
});

const changeNotificationSetting = () => {
    let settings: any = [];
    notifications.value.forEach((e) => {
        settings.push({
            code: e.id,
            value: e.value
        });
    });
    mutate({
        id,
        input: {
            settings: settings
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
<style scoped lang="scss">
.notification {
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 473px;
}
</style>
  