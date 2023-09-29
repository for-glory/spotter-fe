<template>
    <div class="main-content">
        <div class="page-header">
            <ion-title class="banner__title">Trainers</ion-title>
        </div>
        <div class="position-relative">
            <mapSection :show-tabs="false"  :is-web-view="true"></mapSection>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { IonTitle } from "@ionic/vue";
import mapSection from "../facilities/Index.vue";

</script>
  
<style lang="scss" scoped>
.main-content {
    padding: 16px 90px;
    padding-bottom: 0;
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-header {
        margin-bottom: 30px;

        ion-title {
            font-size: 24px;
            padding: 0;
            color: var(--gold);
        }
    }
    .position-relative{
        position: relative;
        height: 100%;
    }
}
</style>
  