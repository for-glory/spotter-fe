import { defineStore } from "pinia";
import { profileStore } from "@/ts/types/store";

export const useProfileStore = defineStore("profile", {
  state: (): profileStore => {
    return {
      first_name: "",
      last_name: "",
      avatarUrl: "",
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
      this.first_name = "";
      this.last_name = "";
      this.avatarUrl = "";
      this.address = "";
    },
  },
});
