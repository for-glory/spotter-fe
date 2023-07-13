<template>
    <div class="header__container">
      <div
        :style="{
          backgroundImage: `url(assets/backgrounds/${backgroundImage}.png)`,
        }"
      >
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, toRefs, defineProps, withDefaults, defineEmits } from "vue";
  import { AuthenticationMode } from "@/ts/enums/authentification";
  
  const props = withDefaults(
    defineProps<{
      mode?: AuthenticationMode;
      backButton?: boolean;
      closeButton?: boolean;
      backgroundImage?: string;
      hiddenLogo?: boolean;
    }>(),
    {
      hiddenLogo: false,
      backButton: false,
      closeButton: false,
      backgroundImage: "iPhone 14",
    }
  );
  
  defineEmits<{
    (e: "back"): void;
  }>();
  
  const { mode } = toRefs(props);
  
  const isLogin = computed(() => mode?.value === AuthenticationMode.login);
  const isRegistration = computed(
    () => mode?.value === AuthenticationMode.registration
  );
  </script>
  
  <style scoped lang="scss">
  </style>
  