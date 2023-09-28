<template>
    <div class="edit-profile-component-header">
        <div :class="{ 'pl-10': paddingLeft }">
            <h3>{{ title }}</h3>
            <p :class="{ 'light-title': lightSubtitle }" v-if="subTitle">{{ subTitle }}</p>
        </div>
        <hr>
    </div>
    <slot name="content"></slot>
    <div class="footer-btn" v-if="footer">
        <IonButton color="medium" fill="outline" @click="$emit('cancel')">Cancel</IonButton>
        <IonButton color="primary" @click="$emit('save')" :disabled="disabled">Save</IonButton>
    </div>
</template>
  
<script setup lang="ts">
import { IonButton } from '@ionic/vue';

withDefaults(defineProps<{
    title: string;
    subTitle?: string;
    disabled?: boolean;
    lightSubtitle?:boolean;
    footer?: boolean;
    paddingLeft?:boolean
}>(),  {
    footer: true,
    paddingLeft: false
});
defineEmits<{
    (e: "cancel"): void;
    (e: "save"): void;
}>();
</script>
<style scoped lang="scss">
.edit-profile-component-header {
    h3 {
        margin: 0;
        font-size: 18px;
        color: var(--fitnesswhite);
        font-weight: 700;
    }

    hr {
        background: var(--gray-600);
        margin-top: 14px;

    }

    p {
        margin: 14px 0;
        color: var(--fitnesswhite);
        font-size: 14px;
    }
}

.footer-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 16px;

    ion-button {
        margin: 0;
        min-width: 77px;
        height: 40px;
    }
}
.light-title {
    color: rgba(255, 255, 255, 0.60) !important;
}

.pl-10 {
    padding-left: 15px;
}
</style>
  