<template>
  <div class="content">
    <div class="header d-flex justify-content-between">
      <div>
        <ion-title>Title</ion-title>
        <ion-text>{{product.title}}</ion-text>
      </div>
      <ion-icon @click="$emit('open-settings')" src="assets/icon/three-dot.svg" slot="icon-only"></ion-icon>
    </div>
    <div class="split" />
    <div class="details">
      <div class="section">
        <ion-title>Duration</ion-title>
        <ion-text>{{product.duration > 30 ? Math.floor(product.duration / 30) : product.duration}}{{ product.duration > 30 ? 'Months' : product.duration > 1 ? 'Days' : 'Day'  }}</ion-text>
      </div>
      <div class="section">
        <ion-title>Features</ion-title>
        <ion-text>Full access(amenities & equipment)</ion-text>
      </div>
      <div class="section">
        <ion-title>Pass Fee</ion-title>
        <ion-text>${{product.price}}</ion-text>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonIcon,
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/vue";
import {
  PaymentGatewayRefundDocument,
  Query,
  SettingsCodeEnum,
  TrainingDocument,
  TrainingStatesEnum,
  FacilityItemsByFacilityIdAndTypeDocument,
} from "@/generated/graphql";
import { useLazyQuery } from "@vue/apollo-composable";
import { chevronBackOutline } from "ionicons/icons";
import { computed, onMounted, ref, defineProps, withDefaults, defineEmits } from "vue";
import { EntitiesEnum } from "@/const/entities";
import { useRouter } from "vue-router";
import { useFacilityStore } from "@/general/stores/useFacilityStore";
import useFacilityId from "@/hooks/useFacilityId";
import useRoles from "@/hooks/useRole";
import { v4 as uuidv4 } from "uuid";
import useId from "@/hooks/useId";
import { useQuery } from "@vue/apollo-composable";

const router = useRouter();
const activeTab = ref("subscribers");
const currentFacility = useFacilityStore();
const selectedTab = ref("All");
const { role } = useRoles();

const { id } = useId();

const props = defineProps<{
  item: any;
}>();

const product = computed(() => props.item);

defineEmits<{
  (e: "open-settings"): void;
}>();

</script>

<style scoped lang="scss">
.content {
  padding: 10px 8px;
  border-radius: 8px;
  background-color: #262626;
  margin-bottom: 8px;
  
  .split {
    margin-top: 12px;
    margin-bottom: 12px;
    height: 1px;
    background-color: #3D3D3D;
  }

  .section {
    padding-bottom: 8px;
  }

  ion-title {
    color: #AFAFAF;
    font: 500 12px/1 Lato;
    padding: 0 0 4px;
  }
  ion-text {
    color: #EFEFEF;
    font: 500 14px/1 Lato;
  }
  ion-icon {
    width: 24px;
    height: 24px;
    stroke: white;
  }

  .header {
    ion-text{
      font: 500 16px/1 Lato;
    }
  }
}
</style>
