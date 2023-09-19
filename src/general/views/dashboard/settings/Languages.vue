<template>
  <component-base-layout title="Change Language"
    sub-title="Manage which languages are used to personalize your Spotter experience">
    <template #content>
      <CustomSelection :selected-value="selectedLanguage" :options="languages" label="Language"
        @select-change="(e) => selectedLanguage = e"></CustomSelection>
    </template>
  </component-base-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import CustomSelection from "./CustomSelection.vue";

const selectedLanguage = ref("Ukrainian");
const languages = [
  {
    title: "English",
    value: "English"
  },
  {
    title: "Ukrainian",
    value: "Ukrainian"
  },
  {
    title: "Spanish",
    value: "Spanish"
  },
  {
    title: "Italian",
    value: "Italian"
  },
  {
    title: "German",
    value: "German"
  },
  {
    title: "Arabic",
    value: "Arabic"
  },
  {
    title: "Bulgarian",
    value: "Bulgarian"
  },
  {
    title: "Croatian",
    value: "Croatian"
  },
  {
    title: "Georgian",
    value: "Georgian"
  },
]

</script>
<style scoped lang="scss"></style>
