<template>
  <base-layout hide-navigation-menu>
    <template #header>
      <page-header back-btn title="Booking history" @back="onBack" />
    </template>
    <template #content>
      <ion-spinner v-if="loading" class="spinner" />
      <div class="booking-items" v-else>
        <template v-for="order in orders" :key="order.id">
          <base-item
            :title="order.title"
            :rating="order.rating"
            :date="order.date"
            :avatarUrl="order.previewUrl"
            :address="order.address"
            :price="order.price"
            :start_date="order.start_date"
            :end_date="order.end_date"
          >
            <template #end>
              <ion-text :class="['booking-item__price', { 'native-app': role === RoleEnum.User }]">
                ${{ order.price }}
              </ion-text>
            </template>
          </base-item>
        </template>
        <!-- <ion-infinite-scroll
          threshold="100px"
          @ionInfinite="loadData"
          v-if="page * quantity < Number(total)"
        >
          <ion-infinite-scroll-content
            loading-spinner="lines"
            loading-text="Loading more data..."
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll> -->
      </div>
    </template>
  </base-layout>
</template>

<script setup lang="ts">
import {
  IonText,
  IonInfiniteScrollContent,
  IonInfiniteScroll,
  InfiniteScrollCustomEvent,
  IonSpinner,
} from "@ionic/vue";
import BaseLayout from "@/general/components/base/BaseLayout.vue";
import PageHeader from "@/general/components/blocks/headers/PageHeader.vue";
import BaseItem from "@/general/components/base/BaseItem.vue";
import { useRouter } from "vue-router";
import { useQuery } from "@vue/apollo-composable";
import {
  Order,
  OrderItem,
  OrdersDocument,
  OrdersQuery,
  QueryTrainerTrainingsOrderByColumn,
  RoleEnum,
  SortOrder,
  TrainerTrainingsDocument,
  TrainerTrainingsQuery,
  Training,
  TrainingStatesEnum,
  TransactionStatesEnum,
} from "@/generated/graphql";
import { computed, ref } from "vue";
import { OrderHistoryType } from "@/ts/types/orders";
import { getHistoryOrdersData } from "@/helpers/history-orders-data";
import useRoles from "@/hooks/useRole";
import dayjs from "dayjs";

const router = useRouter();
const orders = ref<OrderHistoryType[]>([]);
const quantity = ref(50);
const page = ref(1);
const loading = ref(true);
const { role } = useRoles();

const onBack = () => {
  router.go(-1);
};

const { result, onResult, refetch } = useQuery<OrdersQuery>(
  OrdersDocument,
  {
    first: quantity.value,
    page: page.value,
    state: [TransactionStatesEnum.Success],
  },
  () => ({
    enabled: role === RoleEnum.User,
  })
);

const { result: trainerTrainingsResult, onResult: onTrainerTrainingsResult } =
  useQuery<TrainerTrainingsQuery>(
    TrainerTrainingsDocument,
    {
      first: quantity.value,
      page: page.value,
      states: [TrainingStatesEnum.Finished],
      orderBy: [
        {
          column: QueryTrainerTrainingsOrderByColumn.StartDate,
          order: SortOrder.Desc,
        },
      ],
    },
    () => ({
      enabled: role === RoleEnum.Trainer,
    })
  );

// const userTotal = computed(() => result.value?.orders?.paginatorInfo.total);

// const trainerTotal = computed(
//   () => trainerTrainingsResult.value?.trainerTrainings?.paginatorInfo?.total
// );

// const total = computed(() => userTotal.value || trainerTotal.value);

onResult(({ data }) => {
  const ordersData: OrderHistoryType[] = [];

  data?.orders?.data?.forEach((order: Order) => {
    order.items.forEach((item: OrderItem) => {
      ordersData.push(...getHistoryOrdersData(item.orderable, item.price));
    });
  });

  orders.value = [...orders.value, ...ordersData];
  loading.value = false;
});

onTrainerTrainingsResult(({ data }) => {
  const ordersData: OrderHistoryType[] = [];

  data?.trainerTrainings?.data?.forEach((training: Training) => {
    ordersData.push({
      id: training.id,
      date: dayjs(training.start_date).format("DD MMM YYYY"),
      start_date: training.start_date,
      end_date: training.end_date,
      rating: "",
      title: `${training.user?.first_name} ${training.user?.last_name}`,
      previewUrl: training.user?.avatarUrl,
      address: training?.address_string || training?.user?.address?.street,
      price: training.order?.total / 100,
    });
  });
  orders.value = [...orders.value, ...ordersData];

  loading.value = false;
});

// const loadData = (ev: InfiniteScrollCustomEvent) => {
//   if (page.value * quantity.value < Number(total.value)) {
//     page.value = page.value + 1;
//     refetch({ first: quantity.value, page: page.value });
//     ev.target.complete();
//   }
// };
</script>
<style scoped lang="scss">
.booking-items {
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.booking-item__price {
  font-weight: 500;
  font-size: 16px;
  line-height: 150%;
  color: var(--ion-color-white);
}

.spinner {
  display: block;
  pointer-events: none;
  margin: calc(30vh - 60px) auto 0;
}
::v-deep {
  .infinite-loading {
    display: block !important;
  }
}
</style>
