import { defineStore } from "pinia";

export const useDailysItemsStore = defineStore("dailys-items", {
  state: (): any => {
    return {
      dailysData : []
    };
  },
  actions: {
    clearState() {
      this.dailysData = [];
    },
    setData(payload: any) {
      this.dailysData = payload;
    },
  },
});
