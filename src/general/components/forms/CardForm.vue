<template>
  <base-form class="add-card__form">
    <base-input placeholder="Enter your name as on card" />
    <base-input placeholder="Enter card number" />
    <div class="add-card__short-inputs">
      <base-input class="add-card__cvc" placeholder="123" />
      <base-input class="add-card__expiration-date" placeholder="20/20" />
    </div>
  </base-form>
</template>

<script setup lang="ts">
import BaseForm from "@/general/components/base/BaseForm.vue";
import BaseInput from "@/general/components/base/BaseInput.vue";
</script>

<style scoped lang="scss">
.add-card {
  &__form {
    display: flex;
    flex-direction: column;
    padding-top: 24px;
    padding-bottom: 10px;
  }

  &__short-inputs {
    display: flex;
    gap: 10px;
  }
}
</style>
