<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn @back="onBack" title="Identity verification" />
    </template>
    <template #content>
      <!-- <iframe
        :src="src"
        allow="camera"
        id="shuftipro-iframe"
        data-removable="true"
        class="shuftipro-iframe"
      /> -->
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { payloadType, token } from "@/ts/shuftipro/shuftipro";
import { Browser } from "@capacitor/browser";

const router = useRouter();

onMounted(() => {
  createShuftiproRequest();
});

const src = ref<string>("");

const createShuftiproRequest = () => {
  const payload: payloadType = {
    reference: `SP_REQUEST_${Math.random()}`,
    callback_url: process.env.VUE_APP_SHUFTIPRO_CALLBACK_URL,
    redirect_url: `https://${process.env.VUE_APP_URL}/profile`,
    country: process.env.VUE_APP_COUNTRY,
    language: "EN",
    verification_mode: "image_only",
    ttl: 60,
  };

  payload["document"] = {
    proof: "",
    additional_proof: "",
    name: "",
    dob: "",
    age: "",
    document_number: "",
    expiry_date: "",
    issue_date: "",
    allow_offline: "1",
    allow_online: "1",
    supported_types: ["id_card", "passport", "driving_license"],
    gender: "",
  };

  fetch(process.env.VUE_APP_SHUFTIPRO_URL, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Basic " + token,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      return response.json();
    })
    .then(async (data) => {
      if (data.event && data.event === "request.pending") {
        src.value = data.verification_url;
        await Browser.open({ url: src.value });
        onBack();
      }
    });
};

const onBack = () => {
  router.go(-1);
};
</script>
<style lang="scss">
.shuftipro-iframe {
  margin: 0;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  padding-bottom: var(--ion-safe-area-bottom);
}
</style>
