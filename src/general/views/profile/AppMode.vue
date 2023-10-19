<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="App mode" @back="onBack" />
    </template>
    <template #content>
      <div class="modes">
        <ion-radio-group v-model="selectedAppMode">
          <base-radiobutton
            light
            :is-checked="selectedAppMode === 'system'"
            value="system"
            title="System mode"
          />
          <base-radiobutton
            light
            :is-checked="selectedAppMode === 'dark'"
            value="dark"
            title="Dark mode"
          />
          <base-radiobutton
            light
            :is-checked="selectedAppMode === 'light'"
            value="light"
            title="Light mode"
          />
        </ion-radio-group>
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseRadiobutton from "@/general/components/base/BaseRadiobutton.vue";
import { IonRadioGroup } from "@ionic/vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const selectedAppMode = ref("System mode");

const router = useRouter();

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.modes {
  padding: 24px;
}
</style>
