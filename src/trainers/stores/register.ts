import { Commit } from "vuex";
import { PersonalState } from "@/ts/types/authentification";

export default {
  namespaced: true,
  state: {
    firstName: "",
    lastName: "",
    hourlyRate: null,
  },
  getters: {
    extraPersonal: (state: PersonalState) => {
      return state;
    },
  },
  mutations: {
    setExtraPersonal(
      state: PersonalState,
      { key, value }: { key: string; value: string | number }
    ) {
      state[key] = value;
    },
  },
  actions: {
    setExtraPersonalData(
      { commit }: { commit: Commit },
      payload: { key: string; value: string | number }
    ) {
      commit("setExtraPersonal", payload);
      return payload;
    },
  },
};
