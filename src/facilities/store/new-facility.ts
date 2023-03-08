import { City, State } from "@/generated/graphql";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { newFacilityStoreTypes } from "@/ts/types/store";
import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder";
import { defineStore } from "pinia";

export const useNewFacilityStore = defineStore("new-facility", {
  state: (): newFacilityStoreTypes => {
    return {
      photos: [],
      title: "",
      description: "",
      address: {
        state: null,
        city: null,
        address: null,
      },
      equipments: [],
      amenities: [],
    };
  },
  actions: {
    addPhoto(photo: any, index?: number) {
      index ? (this.photos[index] = photo) : this.photos.push(photo);
    },
    deletePhoto(index: number) {
      this.photos.splice(index, 1);
    },
    setTitle(title: string) {
      this.title = title;
    },
    setDescription(description: string) {
      this.description = description;
    },
    setEquipments(equipments: CheckboxValueType[]) {
      this.equipments = equipments;
    },
    setAmenities(amenities: CheckboxValueType[]) {
      this.amenities = amenities;
    },
    setAddress(
      state: State | null,
      city: City | null,
      address: NativeGeocoderResult | null
    ) {
      this.address = { state, city, address };
    },
    clear() {
      this.photos = [];
      this.title = "";
      this.description = "";
      this.address = {
        state: null,
        city: null,
        address: null,
      };
      this.equipments = [];
      this.amenities = [];
    },
  },
  getters: {
    getEquipments: (state) => {
      return state.equipments;
    },
    getAmenities: (state) => {
      return state.amenities;
    },
  },
});
