<template>
    <ComponentBaseLayout title="Social Media" sub-title="Link your social media accounts to your profile">
        <template #content>
            <div class="social-media flex-2">
                <BaseInput from-settings :label="social.name" placeholder="@username" v-for="social in socialMedia" :key="social.id"></BaseInput>
            </div>
        </template>
    </ComponentBaseLayout>
</template>
  
<script setup lang="ts">
import BaseInput from "@/general/components/base/BaseInput.vue";
import ComponentBaseLayout from "./ComponentBaseLayout.vue";

const socialMedia = [
    {
        id: "1",
        name: "Twitter"
    },
    {
        id: "2",
        name: "Instagram"
    },
    {
        id: "3",
        name: "Facebook"
    }
]
</script>
<style scoped lang="scss">
.social-media {
    margin-top: 30px;
    max-width: 473px;
}
</style>
  