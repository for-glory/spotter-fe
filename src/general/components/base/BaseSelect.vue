<template>
  <div class="base-select" :id="id">
    <IonText >{{ title }}</IonText>
    <IonIcon src="assets/icon/arrow-down-light.svg"></IonIcon>
  </div>
  <IonPopover :trigger="id" reference="event"  side="bottom" alignment="start" dismiss-on-select>
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
 }
 import { IonIcon, IonPopover, IonText, IonContent, IonList, IonItem } from '@ionic/vue';
import { ref } from 'vue';

const props = defineProps<SelectProps>()
console.log('props', props);

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

</style>