<template>
  <div class="booking-container">
    <div class="d-flex align-items-center page-header">
      <ion-title>Booking history</ion-title>
    </div>

    <div class="content">
      <IonSpinner name="lines" class="spinner" v-if="loading" />
      <div class="booking-history">
        <template v-for="order in orders" :key="order.id">
          <base-item
            :title="order.title"
            :rating="order.rating"
            :date="order.date"
            :avatarUrl="order.previewUrl"
            :address="order.address"
            :price="order.price"
          >
            <template #end>
              <ion-text
                :class="[
                  'booking-item__price',
                  { 'native-app': role === RoleEnum.User },
                ]"
              >
                ${{ order.price }}
              </ion-text>
            </template>
          </base-item>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import useRoles from "@/hooks/useRole";
import { OrderHistoryType } from "@/ts/types/orders";
import { IonSpinner, IonTitle } from "@ionic/vue";
import { ref } from "vue";
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
import { getHistoryOrdersData } from "@/helpers/history-orders-data";
import BaseItem from "@/general/components/base/BaseItem.vue";

const orders = ref<OrderHistoryType[]>([]);
const quantity = ref(50);
const page = ref(1);
const loading = ref(true);
const { role } = useRoles();

const { result, onResult, refetch } = useQuery<OrdersQuery>(
  OrdersDocument,
  {
    first: quantity.value,
    page: page.value,
    state: [TransactionStatesEnum.Canceled],
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

onResult(({ data }) => {
  const ordersData: OrderHistoryType[] = [];

  data?.orders?.data?.forEach((order: Order) => {
    order.items.forEach((item: OrderItem) => {
      ordersData.push(...getHistoryOrdersData(item.orderable, item.price));
    });
  });

  orders.value = [...orders.value, ...ordersData];
  if (role === RoleEnum.User) {
    orders.value = [
      {
        id: "1",
        title: "Tamara Dae",
        date: "30 June",
        address: "Dallas walla street, 24",
        price: "80,00",
        rating: 4.9,
        previewUrl: "assets/backgrounds/tamra.png",
      },
      {
        id: "2",
        title: "Amazon Gym",
        date: "20 June",
        address: "Dallas walla street, 24",
        price: "200,00",
        rating: 4.9,
        previewUrl: "assets/backgrounds/Gym_1.png",
      },
      {
        id: "3",
        title: "Alice James",
        date: "17 June",
        address: "Dallas walla street, 24",
        price: "80,00",
        rating: 4.9,
        previewUrl: "assets/backgrounds/women4.png",
      },
      {
        id: "4",
        title: "Diamond Gym",
        date: "16 June",
        address: "Dallas walla street, 24",
        price: "200,00",
        rating: 4.9,
        previewUrl: "assets/backgrounds/Gym_2.png",
      },
      {
        id: "5",
        title: "Victoria Maria",
        date: "14 June",
        address: "Dallas walla street, 24",
        price: "80,00",
        rating: 4.9,
        previewUrl: "assets/backgrounds/women3.png",
      },
      {
        id: "6",
        title: "Summer Gym",
        date: "12 June",
        address: "Dallas walla street, 24",
        price: "200,00",
        rating: 4.9,
        previewUrl: "assets/backgrounds/Gym_3.png",
      },
    ];
  }
  loading.value = false;
});

onTrainerTrainingsResult(({ data }) => {
  const ordersData: OrderHistoryType[] = [];

  data?.trainerTrainings?.data?.forEach((training: Training) => {
    ordersData.push({
      id: training.id,
      date: dayjs(training.start_date).format("DD MMM"),
      rating: "",
      title: `${training.user?.first_name} ${training.user?.last_name}`,
      previewUrl: training.user?.avatarUrl,
      address: training?.address_string || "",
      price: training.order?.total / 100,
    });
  });
  orders.value = [...orders.value, ...ordersData];

  loading.value = false;
});
</script>
<style scoped lang="scss">
.booking-container {
  padding: 24px 40px 40px;
  height: 100%;
  width: 100%;
  overflow: auto;
  .page-header {
    padding-top: 21px;
    margin-bottom: 26px;

    ion-title {
      font-size: 24px;
      padding-left: 7px;
      color: var(--gold);
    }

    ion-icon {
      color: var(--gray-500);
      font-size: 20px;
    }
  }

  .content {
    margin-top: 35px;
  }

  .spinner {
    display: block;
    margin: 25vh auto;
  }

  .booking-history {
    padding-bottom: 80px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 16px;
  }
}
</style>
