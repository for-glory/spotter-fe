<template>
    <ion-modal ref="modal" class="delete-gym-modal">
        <div>
            <!-- <img src="" alt=""> -->
            Delete gym
        </div>
    </ion-modal>
</template>
<script setup lang="ts">
import { computed, ref, defineExpose, defineEmits } from "vue";
import { IonText, IonModal, IonButton } from "@ionic/vue";
const item = ref<string>("Amenities");

const modal = ref<typeof IonModal | null>(null);
const present = (p?: any) => {
    item.value = p?.item;
}
defineExpose({
    present,
});
</script>
<style lang="scss" scoped>
.delete-gym-modal {
    --height: 40vh;
    --width: 40vw;
}
</style>