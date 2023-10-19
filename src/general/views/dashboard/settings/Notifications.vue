<template>
    <ComponentBaseLayout title="Notification" sub-title="Select which preference you might prefer">
        <template #content>
            <div class="notification flex-2">
                <base-toggle :value="true" content="Show notification" />
                <base-toggle :value="true" content="With sound" />
                <base-toggle :value="false" content="With vibration" />
            </div>
        </template>
    </ComponentBaseLayout>
</template>
  
<script setup lang="ts">
import BaseToggle from "@/general/components/base/BaseToggle.vue";
import { useRouter } from "vue-router";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";

const router = useRouter();

</script>
<style scoped lang="scss">
.notification {
    margin-top: 35px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 473px;
}
</style>
  