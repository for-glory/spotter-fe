import { Commit } from "vuex";
import { FacilityState } from "@/ts/types/facility";
import { Facility } from "@/generated/graphql";

export default {
  namespaced: true,
  state: {
    facility: null,
  },
  getters: {
    facility: (state: FacilityState) => {
      return state.facility;
    },
  },
  mutations: {
    setFacility(state: FacilityState, facility: Facility) {
      state.facility = facility;
    },
  },
  actions: {
    setFacilityData({ commit }: { commit: Commit }, payload: Facility) {
      commit("setFacility", payload);
      return payload;
    },
  },
};
