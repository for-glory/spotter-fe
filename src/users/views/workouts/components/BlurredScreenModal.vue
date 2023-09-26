<template>
  <ion-modal ref="blurredModal" trigger="open-modal" :is-open="isOpen">
    <div class="blurred-bg"></div>
    <ion-content class="modal-content ion-padding">
      <page-header back-btn @back="onBack" class="header" transparent>
      </page-header>
      <div
        ref="swipeContainer"
        class="modal-buttons ion-padding-horizontal ion-padding-top"
        :style="{ transform: `translateY(${containerY / 50}px)` }"
        slot="fixed"
      >
        <ion-button
          expand="block"
          @click="purchaseDaily"
          :disabled="disabled"
          v-if="isTrusted"
        >
          Purchase Daily to watch full video
        </ion-button>
        <ion-text class="font-bold color-gray font-16" style="margin-top: 16px;">Swipe to continue</ion-text>
        <ion-icon 
          src="assets/icon/swipe-down.svg" 
          style="
            width: 48px;
            height: 88px;
            margin-top: 16px;
          " 
          class="swipe-animation"
        />
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
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { MeDocument, SettingsCodeEnum } from "@/generated/graphql";
import { useQuery } from "@vue/apollo-composable";
import { EntitiesEnum } from '@/const/entities';

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

const swipeContainer = ref<any>();
let startX = 0;
let startY = 0;
let deltaX = 0;
let deltaY = 0;
let isSwiping = false;

const containerY = ref(0);

onMounted(() => {
  console.log(swipeContainer);
  swipeContainer?.value?.addEventListener('touchstart', handleTouchStart);
  swipeContainer?.value?.addEventListener('touchmove', handleTouchMove);
  swipeContainer?.value?.addEventListener('touchend', handleTouchEnd);
});

watch(() => swipeContainer.value,
() => {
  if(swipeContainer.value) {
    console.log(swipeContainer);
    swipeContainer?.value?.addEventListener('touchstart', handleTouchStart);
    swipeContainer?.value?.addEventListener('touchmove', handleTouchMove);
    swipeContainer?.value?.addEventListener('touchend', handleTouchEnd);
  }
});


const handleTouchStart = (event: any) => {
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
};

const handleTouchMove = (event: any) => {
  deltaX = event.touches[0].clientX - startX;
  deltaY = event.touches[0].clientY - startY;
  if(deltaY < 0) {
    containerY.value += deltaY;
  }
  if (deltaY < -50) {
    isSwiping = true;
  }
};

const handleTouchEnd = () => {
  if (isSwiping) {
    purchaseDaily();
    // containerY.value = 0;
  }
  startX = 0;
  startY = 0;
  deltaX = 0;
  deltaY = 0;
  isSwiping = false;
};

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
  router.push({ name: EntitiesEnum.UserWorkouts });
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
  filter: blur(10px);
  -webkit-filter: blur(300px);
  background-color: rgba(24, 24, 24, 0.68);
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
  --background: #2424246a;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  top: 112px;
  height: calc(100% - 112px);

  .button {
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0;
    margin-top: -112px;
  }
}
.font-16 {
  font-size: 16px;
}
.swipe-animation {
  animation: moveUpDown 2s ease-in-out infinite;
}

@keyframes moveUpDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px); /* Adjust this value for the desired movement distance */
  }
}
</style>
