import { defineStore } from "pinia";
import { profileStore } from "@/ts/types/store";

export const useProfileStore = defineStore("profile", {
  state: (): profileStore => {
    return {
      email: "",
      state: "",
      city: "",
    };
  },
  actions: {
    setValue(key: string, value: string) {
      this[key] = value;
    },
    clearState() {
      this.email = "";
    },
  },
});
