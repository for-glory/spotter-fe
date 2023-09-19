import { FacilitySearchResult } from "@/interfaces/FacilitySearchResult";
import { selectedAddressStoreTypes } from "@/ts/types/store";
import { defineStore } from "pinia";

export const useSelectedAddressStore = defineStore("seleted-address", {
  state: (): selectedAddressStoreTypes => {
    return {
      assignedFacility: null,
      hourlyRate: null,
      remoteHourlyRate: null,
      travelRadius: null,
      useTrainerLocation: false,
      workingInGym: false,
      edit: false,
      isSelected: false,
    };
  },
  actions: {
    setEdit(value: boolean) {
      this.edit = value;
    },
    setAssignedFacility(facility: FacilitySearchResult) {
      this.assignedFacility = facility;
    },
    setWorkinginGym(val: boolean) {
      this.workingInGym = val;
    },
    setHourlyRate(rate: number) {
      this.hourlyRate = rate;
    },
    setRemoteHourlyRate(rate: number) {
      this.remoteHourlyRate = rate;
    },
    setTravelRadius(radius: number | null) {
      this.travelRadius = radius;
    },
    setUseTrainerLocation(value: boolean) {
      this.useTrainerLocation = value;
    },
    clearState() {
      this.assignedFacility = null;
      this.hourlyRate = null;
      this.remoteHourlyRate = null;
      this.travelRadius = null;
      this.useTrainerLocation = false;
    },
    clearAssignedFacility() {
      this.assignedFacility = null;
    },
  },
});
