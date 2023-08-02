<template>
	<div>
		<!-- <table class="event-table">
			<thead class="table-header">
				<th>Event name</th>
				<th>Reservations left</th>
				<th>Entry Fee</th>
				<th>Start date</th>
				<th>End date</th>
				<th>Status</th>
			</thead>
			<tbody>
				<tr>
					<td>swimming</td>
					<td>200</td>
					<td>$900</td>
					<td>11/07/2023</td>
					<td>11/07/2023</td>
					<td>ongoing</td>
				</tr>
			</tbody>
		</table> -->
		<ion-grid class="event-table">
			<ion-row class="table-header">
				<ion-col size="2" class="table-th">
					<ion-text>Event name</ion-text>
				</ion-col>
				<ion-col size="2" class="table-th">
					<ion-text>Reservations left</ion-text>
				</ion-col>
				<ion-col size="2" class="table-th">
					<ion-text>Entry Fee</ion-text>
				</ion-col>
				<ion-col size="2" class="table-th">
					<ion-text>Start date</ion-text>
				</ion-col>
				<ion-col size="2" class="table-th">
					<ion-text>End date</ion-text>
				</ion-col>
				<ion-col size="2" class="table-th">
					<ion-text>Status</ion-text>
				</ion-col>
			</ion-row>
			<ion-row class="table-row" v-for="event in events" :key="event.id">
				<ion-col size="2" class="table-td">
					<ion-text>{{ event.title }}</ion-text>
				</ion-col>
				<ion-col size="2" class="table-td">
					<ion-text>{{ event.reservation }}</ion-text>
				</ion-col>
				<ion-col size="2" class="table-td">
					<ion-text>${{ event.price?event.price/100:0 }}</ion-text>
				</ion-col>
				<ion-col size="2" class="table-td">
					<ion-text>{{ event.start_date }}</ion-text>
				</ion-col>
				<ion-col size="2" class="table-td">
					<ion-text>{{ event.end_date }}</ion-text>
				</ion-col>
				<ion-col size="2" class="table-td">
					<ion-text>ongoing</ion-text>
				</ion-col>
			</ion-row>
		</ion-grid>
	</div>
</template>

<script setup lang="ts">
import { IonItem, IonRadio, IonText, IonGrid, IonRow, IonCol } from "@ionic/vue";
import { defineProps, withDefaults } from "vue";

withDefaults(
  defineProps<{
    events: any;
  }>(),
  {
		events:[]
  }
);
</script>

<style scoped lang="scss">
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
