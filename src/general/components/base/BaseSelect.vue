<template>
  <div :class="['base-select', { 'gray-select': graySelect, 'pointer': !Capacitor.isNativePlatform() }]" :id="id">
    <IonText>{{ title }}</IonText>
    <IonIcon src="assets/icon/arrow-down-light.svg"></IonIcon>
  </div>
  <IonPopover v-if="role === RoleEnum.Trainer || role === RoleEnum.FacilityOwner" :trigger="id" reference="event"  side="bottom" alignment="start" dismiss-on-select>
      <IonContent>
        <IonList>
          <IonItem v-for="option in options" :key="option.value" @click="title = option.name"  button>
            {{ option.name }}
          </IonItem>
        </IonList>
      </IonContent>
  </IonPopover>
</template>
<script lang="ts" setup>
interface SelectProps {
  id: string, 
  placeholder?:string,
  defualtCheck?:string,
  options: {
    name:string,
    value: any
  }[],
  graySelect?:boolean;
 }
import { RoleEnum } from '@/generated/graphql';
import useRoles from '@/hooks/useRole';
import { Capacitor } from '@capacitor/core';
 import { IonIcon, IonPopover, IonText, IonContent, IonList, IonItem } from '@ionic/vue';
import { ref } from 'vue';

const props = defineProps<SelectProps>();
console.log(props);

const { role } = useRoles()
const title = ref(props.defualtCheck)

</script>
<style scoped lang="scss">


.base-select{

  color: #E1DBC5;
  display: flex;
  align-items: center;
  gap: 3px;

  ion-text {
    font: 500 14px/1 Lato;
  }
  ion-icon {
    width: 16px;
    height: 16px;
  }
  // &::part(icon){
  //   content: url("../../../../public/assets/icon/arrow-down-light.svg");
  // }
  // &::part(text){
  //   text-align: center;
  //   font-family: Lato;
  //   font-size: 14px;
  //   font-style: normal;
  //   font-weight: 500;
  //   line-height: 150%;
  //   margin-right: 3px;
  // }
}


.pointer:hover {
  cursor: pointer;
}

.gray-select {
  margin-bottom: 8px;
  ion-text {
    color: #5D6679;
    font-family: Inter;
    font-size: 14px;
    font-weight: 500;
  }
}

</style>