<template>
  <ComponentBaseLayout title="Preference" sub-title="Customize what you see">
    <template #content>
      <div class="toggle-btns flex-2">
        <base-toggle content="Display gyms" />
        <base-toggle content="Display trainers" />
      </div>
    </template>
  </ComponentBaseLayout>
</template>
<script setup lang="ts">
import ComponentBaseLayout from "../ComponentBaseLayout.vue";
import BaseToggle from "@/general/components/base/BaseToggle.vue";
</script>
<style scoped lang="scss">
.toggle-btns {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 473px;
  margin-top: 25px;
}
</style>
