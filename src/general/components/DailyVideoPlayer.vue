<template>
  <ion-item 
    lines="none" 
    style="z-index: -5"
    class="relative"
  >
    <video 
      :src="videoPath" 
      ref="videoRef"
      autoplay
      style="max-width: 100%; width: 100%; max-height: 100%; height: 100%"
      class="shadow"
    />
    <div @click="handlePlay" class="shadow w-100 h-100 absolute" />
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
  }
});

const videoPath = computed(() => `${process.env.VUE_APP_MEDIA_URL}${props.path}`);
const videoRef = ref<any>();

const shouldPlay = computed(() => props.play);

onMounted(() => {
  console.log('mounted: shouldPlay?: ', shouldPlay.value);
  if(shouldPlay.value) {
    videoRef.value.play();
  } else {
    videoRef.value.pause();
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
  background-image: linear-gradient(to bottom, #1818181a, #181818ba);
}
</style>
