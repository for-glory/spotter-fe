<template>
  <ion-item 
    lines="none" 
    @click="handlePlay"
    style="z-index: -5"
  >
    <video 
      :src="videoPath" 
      ref="videoRef" 
      style="max-width: 100%; width: 100%; max-height: 100%; height: 100%"
    />
  </ion-item>
</template>

<script setup lang="ts">
import {
  IonItem,
} from "@ionic/vue";
import { EntitiesEnum } from "@/const/entities";
import { ref, computed, defineProps, watch } from "vue";
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
    default: false,
  }
});

const videoPath = computed(() => `${process.env.VUE_APP_MEDIA_URL}${props.path}`);
const videoRef = ref<any>();

const videoPlay = computed(() => props.play);

watch(() => videoPlay.value,
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
</style>
