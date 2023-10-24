<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Notifications" @back="onBack" />
    </template>
    <template #content>
      <div class="notification">
        <base-toggle @click="changeNotificationSetting(notification.value,notification.id)" v-for="notification in notifications" v-model:value="notification.value"
          :content="notification.title" />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import { useRouter } from "vue-router";
import { SettingsCodeEnum, UpdateUserDocument, MeDocument } from "@/generated/graphql";
import useId from "@/hooks/useId";
import { toastController } from "@ionic/vue";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { ref } from "vue";

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

const changeNotificationSetting = (value:boolean,code: string) => {
  mutate({
    id,
    input: {
      settings: [{
        code: code,
        value: value
      }]
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

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.notification {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
