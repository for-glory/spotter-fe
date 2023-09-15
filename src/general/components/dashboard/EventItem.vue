<template>
  <div class="event-item">
    <div class="flex-container">
      <div>
        <div class="title">{{ title }}</div>
        <div class="date-time">{{ dateTime }}</div>
      </div>
      <div>
        <div class="status">{{ status }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, withDefaults } from "vue";

const props = withDefaults(
  defineProps<{
    title?: string;
    dateTime?: string;
    status?: string;
  }>(),
  {
    // title: "Swimming & Cycling",
    // dateTime: "Saturday, April 14 | 08:00 AM",
    // status: "Closed",
  }
);
</script>
<style scoped lang="scss">
.content {
  display: contents;
}
.status {
  font-size: 12px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  height: 22px;
  color: white;
  padding: 3px 8px;
}
.event-item {
  border-radius: 10px;
  background-color: var(--gray-800);
  margin-top: 1rem;
  padding: 1rem;
  .title {
    color: var(--grey-text);
    font-size: 14px;
    padding-bottom: 0.5rem;
  }
  .date-time {
    color: var(--fitnesswhite);
    font-size: 12px;
  }
}
.flex-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  grid-gap: 1.5rem;
}
</style>
