import { defineStore } from "pinia";

export const usePassDropinsItemsStore = defineStore("dropins-items", {
  state: (): any => {
    return {
      passDropinsData :  {
        id: "",
        title: "",
        price: 0,
        facility: {
            id: "",
            __typename: ""
        },
        product_id: "",
        duration: null,
        item_type: "",
        __typename: ""
      }
    };
  },
  actions: {
    clearState() {
      this.passDropinsData = {};
    },
    setData(payload: any) {
      this.passDropinsData = payload;
    }
  },
});
