<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Change language" @back="onBack" />
    </template>
    <template #content>
      <div class="languages">
        <ion-radio-group v-model="selectedLanguage">
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'English'"
            value="English"
            title="English"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Ukrainian'"
            value="Ukrainian"
            title="Ukrainian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Spanish'"
            value="Spanish"
            title="Spanish"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Italian'"
            value="Italian"
            title="Italian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'German'"
            value="German"
            title="German"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Arabic'"
            value="Arabic"
            title="Arabic"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Bulgarian'"
            value="Bulgarian"
            title="Bulgarian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Croatian'"
            value="Croatian"
            title="Croatian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Georgian'"
            value="Georgian"
            title="Georgian"
          />
          <base-radiobutton
            light
            :is-checked="selectedLanguage === 'Italian'"
            value="Italian"
            title="Italian"
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

const selectedLanguage = ref("Ukrainian");

const router = useRouter();

const onBack = () => {
  router.go(-1);
};
</script>
<style scoped lang="scss">
.languages {
  padding: 24px;
}
</style>
