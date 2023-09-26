<template>
  <ion-modal ref="blurredModal" trigger="open-modal" :is-open="isOpen">
    <div class="blurred-bg" :style="bgImage"></div>
    <ion-content class="modal-content ion-padding">
      <page-header back-btn @back="onBack" class="header" transparent>
      </page-header>
      <div
        class="modal-buttons ion-padding-horizontal ion-padding-top"
        slot="fixed"
      >
        <ion-button
          expand="block"
          @click="purchaseDaily"
          :disabled="disabled"
          v-if="isTrusted"
        >
          Purchase Daily
        </ion-button>

        <ion-button
          @click="watchTrialVideo"
          expand="block"
          fill="outline"
          color="medium"
          class="watch-btn"
        >
          Watch free-trial video
        </ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
export default {
  name: "WorkoutPreviewBlurredScreeModal",
};
</script>

<script setup lang="ts">
import { IonModal, IonContent, IonButton } from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { defineProps, defineEmits, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { MeDocument, SettingsCodeEnum } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";

const isTrusted = ref(false);

const props = defineProps<{
  previewUrl: string;
  disabled: boolean;
}>();

const emits = defineEmits<{
  (e: "visibility", isOpen: boolean): void;
  (e: "watchTrialVideo"): void;
  (e: "purchaseDaily"): void;
}>();

const router = useRouter();

const isOpen = ref(true);
const blurredModal = ref(null);

const bgImage = ref(
  `background: no-repeat center/cover url(${props.previewUrl})`
);

watch(props, (newVal) => {
  bgImage.value = `background: no-repeat center/cover url(${newVal.previewUrl})`;
});

const purchaseDaily = () => {
  isOpen.value = false;
  emits("purchaseDaily");
};

const { onResult: gotMe } = useQuery(
  MeDocument,
  {},
  {
    fetchPolicy: "no-cache",
  }
);

gotMe(async (response) => {
  isTrusted.value = !!response.data?.me?.settings?.find(
    (settings: any) => settings.setting.code === SettingsCodeEnum.VerifiedUser
  )?.value;
});

const onBack = () => {
  isOpen.value = false;
  emits("visibility", false);
  router.go(-1);
};

const watchTrialVideo = () => {
  isOpen.value = false;
  emits("visibility", false);
  emits("watchTrialVideo");
};
</script>

<style scoped lang="scss">
.trial-video-player {
  width: auto;
  height: 100%;
}

.blurred-bg {
  opacity: 0.5;
  filter: blur(30px);
  -webkit-filter: blur(300px);
  padding: 0;
  margin: 0;
  position: fixed;
  width: 100%;
  height: 100%;
  /* background: no-repeat center/cover url(https://spotter-dev-space.sfo3.cdn.digitaloceanspaces.com/workout-preview/6351c7f468639.png) */
}

.header {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
}

ion-modal,
ion-content {
  background: transparent;
  --background: transparent;
}

.blurred-modal {
  opacity: 0.7;
  filter: blur(30px);
}

.header-btn {
  height: 32px;
  margin: 0 5px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  color: var(--ion-color-light);
  --border-radius: 50% !important;
  --icon-font-size: 24px;
  --padding-bottom: 0;
  --padding-end: 0;
  --padding-start: 0;
  --padding-top: 0;
  --icon-padding-bottom: 0;
  --icon-padding-end: 0;
  --icon-padding-start: 0;
  --icon-padding-top: 0;
  --min-height: 32px;
  --min-width: 32px;
  --background: rgba(var(--ion-color-black-rgb), 0.12);

  ion-icon {
    font-size: 1em;
  }
}

.modal-buttons {
  left: 0;
  right: 0;
  bottom: 0;
  padding-bottom: calc(20px + var(--ion-safe-area-bottom));

  .button {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;

    &:first-child {
      margin-top: 0;
    }

    &:not(:first-child) {
      margin-top: 16px;
    }
  }
}
</style>
