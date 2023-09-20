<template>
    <component-base-layout title="App mode" sub-title="Select which preference you might prefer">
        <template #content>
           <CustomSelection label="Mode" :options="appModes" :selected-value="selectedValue" @select-change="(e)=> selectedValue = e"></CustomSelection>
        </template>
    </component-base-layout>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import CustomSelection from "./CustomSelection.vue";

const selectedValue = ref("System mode");
const isSelect = ref<boolean>(false);
const appModes = [
    {
        title: "System mode",
        value: "System mode"
    },
    {
        title: "Dark mode",
        value: "Dark mode"
    },
    {
        title: "Light mode",
        value: "Light mode"
    }
]

</script>
<style scoped lang="scss">
</style>
  