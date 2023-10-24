import { Address } from "@/generated/graphql";
import { defineStore } from "pinia";
export interface Manager {
  avatarUrl: string;
  first_name: string;
  last_name: string;
  address: Address;
  tax_id: string;
  email: string;
  phone_number: string;
  postal_code: string;
  employment_type: string;
  birth: string;
}

export const useManagerStore = defineStore("manager", {
  state: (): Manager => {
    return {
      avatarUrl: "",
      first_name: "",
      last_name: "",
      address: {
        lat: null,
        lng: null,
        street: "",
        id: "",
      },
      tax_id: "",
      email: "",
      phone_number: "",
      postal_code: "",
      employment_type: "",
      birth: "",
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
    setAddress(lat: any, lng: any, street: string | null, id?: string) {
      this.address = { lat, lng, street, id: id ? id : "" };
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
    setBirthDate(birth: string) {
      this.birth = birth;
    },
    clear() {
      this.first_name = "";
      this.last_name = "";
      this.address = {
        lat: null,
        lng: null,
        street: "",
        id: "",
      };
    },
  },
  getters: {},
});
