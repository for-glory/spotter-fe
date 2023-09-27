<template>
  <div class="edit-profile">
    <PhotoLoader circle-shape web-img type="avatar" :photo="previewUrl" />
  </div>
</template>

<script setup lang="ts">
import PhotoLoader from "@/general/components/blocks/PhotoLoader.vue";
import { useQuery } from "@vue/apollo-composable";
import { MeDocument } from "@/generated/graphql";
import { ref } from "vue";

const previewUrl = ref<string>("");

const { onResult, refetch, result, loading } = useQuery(
  MeDocument,
  {},
  { fetchPolicy: "network-only" }
);

onResult(({ data }) => {
  console.log("data", data);

  previewUrl.value = data.me.avatarUrl;
});
</script>

<style scoped lang="scss">
.edit-profile {
  width: 100%;
  height: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
