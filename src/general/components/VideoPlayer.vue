<template>
  <page-header class="header" back-btn @back="onBack" transparent>
    <template #custom-btn>
      <slot name="custom-header-btn"></slot>
    </template>
  </page-header>
  <video-player
    :autoplay="autoplay"
    class="video-player vjs-big-play-centered"
    :src="`${VUE_APP_CDN}${pathUrl}`"
    crossorigin="anonymous"
    playsinline
    controls
    :poster="photoUrl"
    :volume="0.6"
    :height="height"
    :width="width"
    :playback-rates="[0.7, 1.0, 1.5, 2.0]"
    :preferFullWindow="true"
    @mounted="handleMounted"
    @ended="handleVideoEnded"
  />
</template>
<script setup lang="ts">
import { shallowRef, withDefaults, defineProps, defineEmits, ref } from "vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { VideoJsPlayer } from "video.js";
import { VideoPlayer } from "@videojs-player/vue";
import "video.js/dist/video-js.css";

withDefaults(
  defineProps<{
    pathUrl: string;
    height: number;
    width: number;
    photoUrl: string;
    autoplay?: boolean;
  }>(),
  {
    width: 320,
    photoUrl: "",
    autoplay: false,
  }
);

const emits = defineEmits<{
  (e: "back"): void;
  (e: "ended"): void;
}>();
const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const player = shallowRef<VideoJsPlayer>();
const handleMounted = (payload: any) => {
  player.value = payload.player;
};

const onBack = () => {
  emits("back");
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
</style>
