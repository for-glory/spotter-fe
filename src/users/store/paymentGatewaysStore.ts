import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import { paymentGatewayProducts, PlaceTypes } from "@/ts/types/store";
import dayjs from "dayjs";
import { defineStore } from "pinia";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const paymentGatewaysStore = defineStore("paymentgateways", {
  state: (): paymentGatewayProducts => {
    return {
      date: "",
      price: null,
      time: "",
      facility: null,
      place: null,
      paymentTime: "",
      title: "",
      startDate: "",
      endDate: "",
      isOpenWaitingModal: false,
      productItemId: "",
      purchasable: "",
      isMobile: false,
    };
  },
  actions: {
    setValue(
      key: string,
      value: string | FacilitySearchResult | PlaceTypes | boolean
    ) {
      this[key] = value;
    },
    clearCart() {
      this.date = "";
      this.price = null;
      this.sessionQuantity = "";
      this.time = "";
      this.facility = null;
      this.place = null;
      this.purchasable = "";
    },
  },
  getters: {
    getStartDate: (state) => {
      if (state.time) {
        return `${dayjs(state.date).local().format("YYYY-MM-DD")} ${dayjs
          .utc(state.paymentTime)
          .local()
          .format("hh:mm:ss")}`;
      } else {
        return `${dayjs.utc(state.date).local().format("YYYY-MM-DD 00:00:00")}`;
      }
    },
    getEndDate: (state) => state.endDate
  },
});
