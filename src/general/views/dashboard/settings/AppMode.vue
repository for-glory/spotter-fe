<template>
    <component-base-layout title="App mode" sub-title="Select which preference you might prefer">
        <template #content>
            <div class="flex-2">
                <CustomSelection label="Mode" :options="appModes" :selected-value="selectedValue" @select-change="(e)=> selectedValue = e"></CustomSelection>
            </div>
        </template>
    </component-base-layout>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";
import CustomSelection from "./CustomSelection.vue";

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
];

const selectedValue = ref(appModes[0]);


</script>
<style scoped lang="scss">
</style>
  