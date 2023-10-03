<template>
  <div class="discover-container">
    <WebHeader title="Discover" :back-btn="false" gold-title  />

    <div class="position-realtive">
      <Discover is-web />
    </div>
  </div>
</template>
<script setup lang="ts">
import WebHeader from '@/general/components/blocks/headers/WebHeader.vue';
import Discover from "@/users/views/discover/Index.vue"
</script>
<style scoped lang="scss">
.discover-container {
  padding: 24px 16px 64px;
  height: 100%;
  width: 100%;
  overflow: auto;

  .position-realtive {
    position: relative;
    height: 100%;
  }
}
</style>