import { defineStore } from "pinia";
import { Facility } from "@/generated/graphql";
import { FacilityState } from "@/ts/types/facility";

export const useFacilityStore = defineStore("currentFacility", {
  state: (): FacilityState => {
    return {
      facility: {
        created_at: null,
        description: "",
        id: "",
        name: "",
        organization: {
          contact_phone: "",
          email: "",
          id: "",
          name: "",
        },
        updated_at: null,
      },
    };
  },
  actions: {
    setFacility(facility: Facility) {
      this.facility = facility;
    },
    clearState() {
      this.facility = {
        created_at: null,
        description: "",
        id: "",
        name: "",
        organization: {
          contact_phone: "",
          email: "",
          id: "",
          name: "",
        },
        updated_at: null,
      };
    },
  },
});
