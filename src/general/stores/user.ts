import { City, State } from "@/generated/graphql";
import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: (): any => {
    return {
      id: "",
      email: "",
      first_name: "",
      last_name: "",
      avatarUrl: "",
      owned_facilities: [],
      currentSubscription: "",
      address: {
        state: null,
        city: null,
        address: null,
      },
    };
  },
  actions: {
    setName(first_name: string, last_name: string) {
      this.first_name = first_name;
      this.last_name = last_name;
    },
    setSubscription(setSubscription: string) {
      this.currentSubscription = setSubscription;
    },
    setEmail(email: string) {
      this.email = email;
    },
    setId(id: number) {
      this.id = id;
    },
    setAvatarUrl(avatarUrl?: string) {
      this.avatarUrl = avatarUrl ?? "";
    },
    setAddress(
      state: State | null,
      city: City | null,
      address: NativeGeocoderResult | null
    ) {
      this.address = { state, city, address };
    },
    clear() {
      this.id= "",
      this.email= "",
      this.first_name= "",
      this.last_name= "",
      this.avatarUrl= "",
      this.owned_facilities= [],
      this.currentSubscription= "",
      this.address= {
        state: null,
        city: null,
        address: null,
      };
    },
  },
});
