<template>
  <ion-item 
    lines="none" 
    style="z-index: -5"
    class="relative"
    @click.stop="handlePlay"
  >
    <video 
      v-show="shouldPlay"
      :src="videoPath" 
      :poster="preview"
      ref="videoRef"
      autoplay
      style="max-width: 100%; width: 100%; max-height: calc(100vh - 40px); height: 100%"
    ></video>
    <div  class="shadow"></div> 
  </ion-item>
</template>

<script setup lang="ts">
import {
  IonItem,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { ref, computed, defineProps, watch, onMounted } from "vue";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
// import dayjs from "dayjs";
import { Share } from "@capacitor/share";

const VUE_APP_CDN = ref(process.env.VUE_APP_CDN);
const currentFacility = useFacilityStore();

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  play: {
    type: Boolean,
    default: true,
  },
  preview: {
    type: String,
    required: true,
  },
});

const videoPath = computed(() => `${process.env.VUE_APP_MEDIA_URL}${props.path}`);
const videoRef = ref<any>();
const preview = computed(() => `${process.env.VUE_APP_MEDIA_URL}${props.preview}`);

const shouldPlay = computed(() => props.play);

onMounted(async () => {
  console.log('mounted: shouldPlay?: ', shouldPlay.value);
  if(!shouldPlay.value) {
    await videoRef.value.pause();
  }
});

watch(() => shouldPlay.value,
(newVal) => {
  console.log('should play?: ', newVal);
  if(newVal) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
});

const handlePlay = () => {
  console.log("************");
  if(videoRef.value.paused) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
  }
  videoRef.value.blur();
}

</script>

<style scoped lang="scss">
.common-style {
  .w-24 {
    width: 24px;
  }
  .h-24 {
    height: 24px;
  }

  .font-16 {
    font-size: 16px;
  }

  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
}
.shadow {
  position: absolute;
  background-image: linear-gradient(to bottom, #1818181a, #181818ba);
  width: calc(100% - 16px);
  height: 100%;
}
</style>
