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
      tax_id: "",
      email: "",
      phone_number: "",
      postal_code: "",
      employment_type: "",
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
    setTaxID(tax_id: string) {
      this.tax_id = tax_id;
    },
    setEmail(email: string) {
      this.email = email;
    },
    setPhoneNumber(phone_number: string) {
      this.phone_number = phone_number;
    },
    setPostalCode(postal_code: string) {
      this.postal_code = postal_code;
    },
    setEmploymentType(employment_type: string) {
      this.employment_type = employment_type;
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
