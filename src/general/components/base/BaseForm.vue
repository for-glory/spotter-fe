<template>
  <form :class="classname" class="base-form">
    <slot></slot>
  </form>
</template>

<script lang="ts">
export default {
  name: "BaseForm",
};
</script>

<script setup lang="ts">
import { defineProps, withDefaults } from "vue";
import { ClassnameType } from "@/ts/types/components";

withDefaults(
  defineProps<{
    classname?: ClassnameType;
  }>(),
  {
    classname: "",
  }
);
</script>

<style scoped>
.base-form {
  margin: 0 auto;
  width: 100%;
  padding: 16px 24px 0px 24px;
  max-width: 400px;
}
</style>
