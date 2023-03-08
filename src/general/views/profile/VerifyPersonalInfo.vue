<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Verify personal info" @back="onBack" />
    </template>
    <template #content>
      <div class="personal-info">
        <base-input value="Alice" />
        <base-input value="Johnson" />
        <choose-block
          title="Location"
          value="Alabama, USA"
          class="personal-info__choose"
        />
        <choose-block
          title="Gender"
          value="Female"
          class="personal-info__choose"
        />
        <choose-block title="Age" value="24" class="personal-info__choose" />
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import ChooseBlock from "@/general/components/blocks/Choose.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.personal-info {
  padding: 24px;
  display: flex;
  flex-direction: column;

  &__choose {
    margin-bottom: 16px;
  }
}
</style>
