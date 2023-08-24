import { defineStore } from "pinia";

export const useManagerStore = defineStore("manager", {
  state: (): any => {
    return {
      avatarUrl: "",
      first_name: "",
      last_name: "",
      address: {
        lat: null,
        lng: null,
        street: "",
      },
    };
  },
  actions: {
    setName(first_name: string, last_name: string) {
      this.first_name = first_name;
      this.last_name = last_name;
    },
    setAvatarUrl(avatarUrl: string) {
      this.avatarUrl = avatarUrl;
    },
    setAddress(
      lat: any,
      lng: any,
      street: string | null
    ) {
      this.address = { lat, lng, street };
    },
    clear() {
      this.first_name = "";
      this.last_name = "";
      this.address = {
        lat: null,
        lng: null,
        street: "",
      };
    },
  },
  getters: {},
});
