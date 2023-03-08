<template>
  <ion-modal :is-open="isOpen">
    <page-header
      class="header"
      @back="closeModal"
      title="Crop"
      back-btn
      transparent
    >
      <template #custom-btn>
        <ion-button @click="submitImage" class="header-btn">
          <ion-icon src="assets/icon/accept.svg" />
        </ion-button>
      </template>
    </page-header>
    <ion-content class="cropper-content">
      <vue-cropper
        ref="cropper"
        class="cropper-img"
        alt="Source Image"
        drag-mode="crop"
        :background="false"
        :cropmove="cropImage"
        :aspectRatio="circleShape ? 1 : NaN"
        :src="imgSrc"
        :class="{ 'circle-shape': circleShape }"
        :minContainerWidth="width"
        :minContainerHeight="height"
        :center="false"
        :highlight="false"
        :viewMode="1"
      />
      <ion-buttons class="cropper-footer">
        <ion-button
          fill="clear"
          color="light"
          @click="rotateRight"
          class="cropper-action"
        >
          <ion-icon slot="icon-only" src="assets/icon/rotate-right.svg" />
        </ion-button>
        <ion-button
          fill="clear"
          color="light"
          @click="rotateLeft"
          class="cropper-action"
        >
          <ion-icon slot="icon-only" src="assets/icon/rotate-left.svg" />
        </ion-button>
        <ion-button
          fill="clear"
          color="light"
          @click="zoomIn"
          class="cropper-action"
        >
          <ion-icon slot="icon-only" src="assets/icon/zoom-in.svg" />
        </ion-button>
      </ion-buttons>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, withDefaults, ref, watch } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import {
  IonModal,
  IonContent,
  IonButton,
  IonIcon,
  IonButtons,
} from "@ionic/vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";

const emits = defineEmits<{
  (e: "set-open", value: boolean): void;
  (e: "get-uploaded-img", value: string): void;
}>();

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    file: string;
    circleShape?: boolean;
  }>(),
  {
    circleShape: false,
  }
);

const imgSrc = ref<string>("");
const cropImg = ref<string>("");
const cropper = ref<typeof VueCropper | null>(null);

const width = ref<number>(window.innerWidth);
const height = ref<number>(window.innerHeight);

const closeModal = () => {
  emits("set-open", false);
};

const cropImage = () => {
  cropImg.value = cropper?.value.$refs.img.cropper
    .getCroppedCanvas()
    .toDataURL();
};

const rotateLeft = () => {
  cropper?.value.$refs.img.cropper.rotate(-90);
};

const rotateRight = () => {
  cropper?.value.$refs.img.cropper.rotate(90);
};

const zoomIn = () => {
  cropper?.value.$refs.img.cropper.zoom(0.1);
};

const submitImage = () => {
  cropImage();
  emits("get-uploaded-img", cropImg.value);
  closeModal();
};

watch(
  () => props.file,
  (newVal) => {
    imgSrc.value = newVal;
  }
);
</script>

<style lang="scss" scoped>
.cropper-content {
  position: relative;
  --padding-start: 0;
  --padding-end: 0;

  &::part(scroll) {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

.header {
  top: 0;
  left: 0;
  right: 0;
  position: fixed;
}

.cropper-footer {
  width: 100%;
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  bottom: calc(20px + var(--ion-safe-area-bottom));

  .cropper-action {
    width: 32px;
    height: 32px;
    margin: 0 18px;
    line-height: 1;
    font-size: 24px;
    --border-radius: 50%;
    --padding-bottom: 0;
    --padding-end: 0;
    --padding-start: 0;
    --padding-top: 0;

    ion-icon {
      font-size: 1em;
    }
  }
}

.header-btn {
  margin: 0;
  height: 32px;
  font-size: 24px;
  display: block;
  min-width: 32px;
  backdrop-filter: blur(4px);
  border-radius: 50%;
  --border-radius: 50% !important;
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
</style>

<style lang="scss">
.cropper-modal {
  opacity: 0.6;
}

.cropper-line {
  opacity: 0;
  background-color: var(--ion-color-light);
}

.cropper-img {
  &:not(.circle-shape) {
    .cropper-point.point-e,
    .cropper-point.point-n,
    .cropper-point.point-w,
    .cropper-point.point-s {
      display: none;
    }

    .cropper-point.point-ne,
    .cropper-point.point-nw,
    .cropper-point.point-sw,
    .cropper-point.point-se {
      width: 24px;
      height: 24px;
      border-style: solid;
      background: transparent;
      border-color: var(--ion-color-light);
    }

    .cropper-point.point-ne {
      border-width: 2px 2px 0 0;
    }

    .cropper-point.point-nw {
      border-width: 2px 0 0 2px;
    }

    .cropper-point.point-sw {
      border-width: 0 0 2px 2px;
    }

    .cropper-point.point-se {
      border-width: 0 2px 2px 0;
    }

    .cropper-dashed {
      opacity: 1;
      border-style: solid;
      border-color: rgba(var(--ion-color-light-rgb), 0.4);
    }

    .cropper-view-box {
      outline-color: var(--ion-color-light);
    }
  }
}

.circle-shape {
  .cropper-crop-box,
  .cropper-view-box {
    border-radius: 50%;
  }
  .cropper-view-box {
    box-shadow: 0 0 0 1px var(--ion-color-light);
    outline: 0;
  }
  .cropper-face {
    background-color: inherit !important;
  }

  .cropper-dashed,
  .cropper-line {
    display: none !important;
  }
  .cropper-view-box {
    outline: inherit !important;
  }

  .cropper-point {
    background-color: var(--ion-color-light);
  }

  .cropper-point.point-se,
  .cropper-point.point-sw,
  .cropper-point.point-nw,
  .cropper-point.point-ne {
    display: none;
  }
}
</style>
