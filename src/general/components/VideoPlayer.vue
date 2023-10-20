<template>
  <page-header class="header" :back-btn="backBtn" @back="onBack" transparent :title="freeDuration === 0 ? `Playing ${ title }` : ''">
    <template #custom-btn>
      <slot name="custom-header-btn"></slot>
    </template>
  </page-header>
  <video-player
    class="video-player vjs-big-play-centered"
    :src="`${VUE_APP_CDN}${daily?.video}`"
    crossorigin="anonymous"
    playsinline
    :controls="freeDuration === 0 || showControl"
    :poster="daily?.previewUrl"
    :volume="0.6"
    :height="props.height"
    :width="props.width"
    :playback-rates="[0.7, 1.0, 1.5, 2.0]"
    :preferFullWindow="true"
    @mounted="handleMounted"
    @play="handlePlay"
    @pause="handlePlause"
    @ended="handleVideoEnded"
  />
  <div v-if="freeDuration > 0" class="d-flex-col justify-content-end align-items-start details__left">
    <ion-label class="font-medium font-18 color-white"> {{ daily?.title }}</ion-label>
    <ion-text class="daily-info">
      <ion-icon icon="assets/icon/time.svg" />
      <span>
        <template v-if="daily?.duration">
          <ion-text color="light" class="daily-info-dot">
            &nbsp;&#183;&nbsp;
          </ion-text>
          {{ getDurationText(daily?.duration) }}
        </template>
        {{ type }}
        <ion-text color="light" class="daily-info-dot">
          &nbsp;&#183;&nbsp;
        </ion-text>
        {{ daily?.trainer?.first_name + ' ' + daily?.trainer?.last_name }}
      </span>
    </ion-text>
  </div>
  <div v-if="freeDuration > 0" class="d-flex-col justify-content-end align-items-end gap-16 details__right">
    <div class="d-flex align-items-center gap-12">
      <ion-icon src="assets/icon/heart-filled.svg" class="w-24 h-24 color-gold"></ion-icon>
      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(daily?.recommended_count ?? 0, 'normal') }}</ion-text>
    </div>
    <div class="d-flex align-items-center gap-12">
      <ion-icon src="assets/icon/eye.svg" class="w-24 h-24  color-gold"></ion-icon>
      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(daily?.views_count ?? 0, 'normal') }}</ion-text>
    </div>
    <div class="d-flex align-items-center gap-12">
      <ion-icon src="assets/icon/messages.svg" class="w-24 h-24 color-gold"></ion-icon>
      <ion-text class="font-light font-16 color-fitness-white">{{ formatNumber(daily?.reviews_count ?? 0, 'normal') }}</ion-text>
    </div>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, withDefaults, defineProps, defineEmits, ref, watch } from "vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { VideoPlayer } from "@videojs-player/vue";
import { useRouter } from "vue-router";
import { EntitiesEnum } from '@/const/entities';
import "video.js/dist/video-js.css";
import { Capacitor } from "@capacitor/core";
import route from "@/router"
const props = withDefaults(
  defineProps<{
    pathUrl: string;
    height: number;
    width: number;
    photoUrl: string;
    autoplay?: boolean;
    freeDuration?: number;
    backName?: EntitiesEnum;
    title?: string;
    daily?: any;
    backBtn?: boolean;
    showControl?: boolean;
  }>(),
  {
    width: 320,
    photoUrl: "",
    autoplay: false,
    freeDuration: 0,
    backName: EntitiesEnum.UserWorkouts,
    backBtn: true,
    showControl: false,
  }
);

const emits = defineEmits<{
  (e: "back"): void;
  (e: "ended"): void;
  (e: "trialEnd"): void;
}>();
const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const player = ref<typeof VideoPlayer>();

const handleMounted = async (payload: any) => {
  player.value = payload.player;
  if(props.freeDuration === 0 || props.autoplay){
    await player.value?.play();
  }
};

watch(() => props.autoplay,
  (newVal) => {
    if(newVal === true) {
      player.value?.play();
    } else {
      player.value?.pause();
    }
  }
);

const timer = ref<any>(null);
const totalTime = ref<number>(0);
const router = useRouter();

const handlePlay = () => {
  timer.value = window.setInterval(function() {
    totalTime.value += 1;
  }, 1000);
}

const handlePlause = () => {
  if(timer.value) {
    clearInterval(timer.value);
  }
};

watch(() => totalTime.value,
() => {
  if(props.freeDuration > 0 && totalTime.value >= props.freeDuration) {
    player.value?.pause();
    player.value?.currentTime(0)
    emits('trialEnd');
  }
});

const formatNumber = (num: number, type: string) => {
  if (num < 1e3) {
    if(type === 'normal') {
      return num.toString();
    } else {
      return num.toFixed(2).toString();
    }
  } else if (num < 1e6) {
    return (num / 1e3).toFixed(1) + 'k';
  } else {
    return (num / 1e6).toFixed(1) + 'M';
  }
};

const getDurationText = (value: number) => {
  if(value < 60) {
    return value + ' s';
  } else if(value < 3600) {
    return (value / 60).toFixed(0) + ' min ' + value % 60 + ' s';
  } else {
    return (value / 60).toFixed(0) + ' h ' + (value % 3600) / 60 + ' min';
  }
};

const onBack = () => {
  if(props.backName === EntitiesEnum.UserWorkouts && !Capacitor.isNativePlatform()) {
    router.push({ name: EntitiesEnum.DashboardClientDailys });
  } else {
    // router.push({ name: props.backName });
    route.go(-1)
  }
};

const handleVideoEnded = () => {
  emits("ended");
};
</script>

<style scoped lang="scss">
.header {
  top: 0;
  left: 0;
  right: 0;
  position: absolute;
}

.video-player {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: var(--ion-color-black);
}
</style>

<style lang="scss">
.vjs-tech {
  width: 300px;
  height: auto;
}

.video-js {
  border-radius: 8px;

  .vjs-tech {
    object-fit: cover;
  }

  .vjs-big-play-button {
    top: 50%;
    left: 50%;
    width: 48px;
    height: 48px;
    border: none;
    outline: none;
    border-radius: 50%;
    position: absolute;
    margin: -24px 0 0 -24px;
    backdrop-filter: blur(10px);
    background: rgba(24, 24, 24, 0.32);

    > .vjs-icon-placeholder {
      &:before {
        font-size: 24px;
        line-height: 48px;
      }
    }
  }

  .vjs-progress-control {
    left: 0;
    right: 0;
    bottom: 0;
    width: auto;
    height: auto;
    position: absolute;
    background: rgba(17, 17, 18, 0.32);
    padding: 16px 24px
      calc(40px + var(--video-offset-botton, var(--ion-safe-area-bottom)));

    .vjs-progress-holder {
      margin: 0;
    }
  }

  .vjs-slider {
    height: 2px;
    border-radius: 2px;
    backdrop-filter: blur(10px);
    background: rgba(var(--ion-color-light-rgb), 0.44);
  }

  .vjs-play-progress {
    border-radius: 2px;
    background-color: var(--ion-color-primary);

    &:before {
      top: 50%;
      font-size: 10px;
      margin-top: -0.5em;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.24);
    }
  }

  .vjs-control-bar {
    height: 0;
    position: static;
  }

  .vjs-play-control {
    top: 50%;
    left: 50%;
    width: 48px;
    height: 48px;
    outline: none;
    border-radius: 50%;
    position: absolute;
    margin: -24px 0 0 -24px;
    backdrop-filter: blur(10px);
    background: rgba(24, 24, 24, 0.32);

    > .vjs-icon-placeholder {
      &:before {
        font-size: 24px;
        line-height: 48px;
      }
    }
  }

  .vjs-current-time,
  .vjs-duration {
    padding: 0;
    height: auto;
    display: block;
    font-size: 14px;
    line-height: 1.5;
    position: absolute;
    color: var(--ion-color-light);
    bottom: calc(
      12px + var(--video-offset-botton, var(--ion-safe-area-bottom))
    );
  }

  .vjs-current-time {
    left: 24px;
  }

  .vjs-duration {
    right: 24px;
  }

  .vjs-volume-panel,
  .vjs-remaining-time,
  .vjs-playback-rate,
  .vjs-picture-in-picture-control,
  .vjs-fullscreen-control {
    display: none;
  }
}

.vjs-poster {
  background-size: cover;
}
.daily-info {
  display: flex;
  font-size: 14px;
  font-weight: 300;
  line-height: 24px;
  align-items: center;
  justify-content: flex-start;

  ion-icon {
    line-height: 1;
    font-size: 24px;
    margin-right: 4px;
    color: var(--ion-color-primary);
  }

  .workout-item--hidden & {
    color: var(--ion-color-medium);

    ion-icon {
      color: inherit;
    }
  }
}
.daily-info-dot {
  font-weight: 500;
  font-size: 16px;
}
.details__left {
  position: absolute;
  bottom: 64px;
  left: 24px;
}
.details__right {
  position: absolute;
  bottom: 140px;
  right: 24px;
}
.w-24 {
  width: 24px;
}
.h-24 {
  height: 24px;
}
.font-18 {
  font-size: 18px;
}
.font-16 {
  font-size: 16px;
}
</style>
