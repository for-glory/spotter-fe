<template>
  <div>

  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { Workout } from "@/generated/graphql";
import { IonItem, IonLabel } from "@ionic/vue";

const props = defineProps<{
  workout: Workout;
}>(); 


</script>

<style lang="scss" scoped>

</style>
