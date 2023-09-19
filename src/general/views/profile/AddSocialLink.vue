<template>
    <base-layout>
        <template #header>
            <page-header back-btn title="Add social links" @back="onBack" />
        </template>
        <template #content>
            <div class="profile-edit">
                <choose-block v-for="social in socialMedia" class="profile-edit__option" :title="social.name" @click="openConfirmAlert(social)" />
            </div>
        </template>
    </base-layout>
</template>
  
<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import { alertController } from "@ionic/vue";
import { useRouter } from "vue-router";

const router = useRouter();
const onBack = () => {
    router.go(-1);
};

const socialMedia = [
    {
        id: "1",
        name: "Twitter"
    },
    {
        id: "2",
        name: "Instagram"
    },
    {
        id: "3",
        name: "Facebook"
    }
]

const openConfirmAlert = async (social: any) => {
    const alert = await alertController.create({
      header: "Spotter",
      message: `Wants to open “${social.name}”`,
      mode:'ios',
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
        },
        {
          text: "Open",
          role: "confirm",
          handler: () => {
          },
        },
      ],
      cssClass: 'dark-confirmation-alert'
    });

    await alert.present();
}
</script>
<style scoped lang="scss">
.profile-edit {
    padding: 24px 24px calc(32px + var(--ion-safe-area-bottom));

    &__option {
        &:not(:first-child) {
            margin-top: 16px;
        }
    }
}
</style>
  