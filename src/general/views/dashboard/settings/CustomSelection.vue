<template>
    <div class="select-container flex-2">
        <div class="select-content" :class="{ 'active': isSelect }">
            <div class="select-wrapper" @click="isSelect = !isSelect">
                <IonLabel class="item-label">Language</IonLabel>
                <div class="custom-select d-flex align-items-center justify-content-between">
                    <IonLabel>{{ selectedValue }}</IonLabel>
                    <IonIcon src="assets/icon/chevron-down.svg"></IonIcon>
                </div>
            </div>
            <hr class="divider">
            <Transition v-if="isSelect">
                <div class="select-option-wrapper hide-scrollbar">
                    <div class="select-option" v-for="option in props.options" :key="option.value"
                        :class="{ 'active': selectedValue === option.value }"
                        @click="$emit('selectChange', option.value); isSelect = false">
                        <IonLabel>{{ option.title }}</IonLabel>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import { IonIcon, IonLabel } from "@ionic/vue";

const props = defineProps<{
    label: string;
    options: Array<{
        title: string,
        value: string;
    }>;
    selectedValue: string;
}>();
const emit = defineEmits<{
    (e: 'selectChange', value: string): void;
}>();
const isSelect = ref<boolean>(false);
</script>
<style scoped lang="scss">
.select-container {
    margin-top: 25px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    max-width: 493px;

    .select-content {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        &.active {
            background: var(--gray-800);

            .divider {
                display: block;
            }
        }
    }
}

.select-wrapper {
    margin: 10px;
    cursor: pointer;

    .item-label {
        margin-bottom: 8px;
        color: var(--60, rgba(255, 255, 255, 0.60));
        font-size: 14px;
        font-weight: 500;
        display: block;
    }

    .custom-select {
        padding: 13px 16px;
        border: 1px solid var(--60, rgba(255, 255, 255, 0.60));
        border-radius: 8px;

        ion-label {
            font-size: 14px;
            color: var(--fitnesswhite);
        }
    }
}

.divider {
    background: var(--grey-text);
    margin: 16px 0;
    display: none;
}

.select-option-wrapper {
    padding: 10px;
    overflow: auto;

    .select-option {

        &.active,
        &:hover {
            background: rgba(225, 219, 197, 0.10);
            cursor: pointer;
        }

        padding: 16px;

        ion-label {
            color: var(--fitnesswhite);
            font-size: 14px;
        }
    }
}
</style>
  