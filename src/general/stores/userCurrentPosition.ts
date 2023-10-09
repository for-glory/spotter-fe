import { defineStore } from "pinia";
import { PositionLatLng } from "@/ts/types/map";

export const userCurrentPosition = defineStore("userCurrentPosition", {
  state: (): PositionLatLng => {
    return {
      lat: 0,
      lng: 0,
    };
  },
  actions: {
    setValue(lat: number, lng: number) {
      this.lat = lat;
      this.lng = lng;
    }
  },
});
