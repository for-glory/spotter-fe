<template>
	<div>
		<ion-grid class="event-table">
			<ion-row class="table-header">
				<ion-col size="1.7" class="table-th">
					<ion-text class="gray">Event name</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-th">
					<ion-text  class="gray">Venue</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-th">
					<ion-text  class="gray">Reservations left</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-th">
					<ion-text>Entry Fee</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-th">
					<ion-text class="gray">Start date</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-th">
					<ion-text class="gray">End date</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-th">
					<ion-text class="gray">Status</ion-text>
				</ion-col>
			</ion-row>
			<ion-row class="table-row" v-for="event in events" :key="event.id" @click="onHandleDetailsPage(EntitiesEnum.DashboardEventDetail, event.id)">
				<ion-col size="1.7" class="table-td">
					<ion-text class="gray">{{ event.title }}</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-td">
					<ion-text class="gray font-12">{{ event?.address?.street }}</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-td">
					<ion-text class="gray">{{ event.max_participants - event.booked_count }}</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-td">
					<ion-text>${{ formatNumber(event.price?event.price/100:0) }}</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-td">
					<ion-text class="gray">{{ dayjs(event.start_date).format("DD/MM/YYYY") }}</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-td">
					<ion-text class="gray">{{ dayjs(event.end_date).format("DD/MM/YYYY") }}</ion-text>
				</ion-col>
				<ion-col size="1.7" class="table-td">
					<div class="upcoming">{{ event.status }}</div>
					<!-- <ion-text class="gray">{{ event.status }}</ion-text> -->
				</ion-col>
			</ion-row>
		</ion-grid>
	</div>
</template>

<script setup lang="ts">
import { IonItem, IonRadio, IonText, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { defineProps, withDefaults } from "vue";
import { EntitiesEnum } from "@/const/entities";
const router = useRouter();
import dayjs from "dayjs";
import { useRouter } from "vue-router";

withDefaults(
  defineProps<{
    events: any;
  }>(),
  {
		events:[]
  }
);

const formatNumber = ((num: any) => {
    return parseFloat(num).toFixed(2)
  })

// handle click event
const onHandleDetailsPage = (pathName: string, id: string) => {
	console.log(pathName, id)
  router.push({
     name: pathName, 
      params: { id: id } 
    
    });
};

</script>

<style scoped lang="scss">
.upcoming {
    background-color: #EDE8D7;
    border-radius: 30px;
    padding: 5px 7px;
    color: #19191B;
    text-align: center;
    font-family: Lato;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
.font-12 {
	    font-size: 12px;
}
.upcomingWhite {
    background-color: #EDE8D7;
    border-radius: 30px;
    padding: 5px 7px;
    color: #19191B;
    text-align: center;
    font-family: Lato;
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
.event-table {
	border-radius: 8px;
	border: 1px solid var(--fitnesswhite);
	background: var(--gray-700);
	width: 100%;
	padding: 0;

	.table-th {
		padding: 10px 24px;
	}

	.table-td {
		padding: 16px 24px;
	}
}

.gray {
	color: #797979;;
}
.table-header {
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	background-color: var(--main-color);
	color: var(--gold);
}

.table-row {
	border-top: 1px solid var(--fitnesswhite);
}

</style>
