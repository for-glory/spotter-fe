import { City, State } from "@/generated/graphql";
import { CheckboxValueType } from "@/ts/types/checkbox-value";
import { newEventStoreTypes } from "@/ts/types/store";
import { NativeGeocoderResult } from "@awesome-cordova-plugins/native-geocoder";
import { defineStore } from "pinia";

export const useNewEventStore = defineStore("new-event", {
  state: (): newEventStoreTypes => {
    return {
      photos: [],
      title: "",
      description: "",
      address: {
        state: null,
        city: null,
        address: null,
      },
      start_date: null,
      end_date: null,
      start_time: "",
      end_time: "",
      equipments: [],
      amenities: [],
      max_participants: null,
      price: null,
    };
  },
  actions: {
    addPhoto(photo: any, index?: number) {
      index ? (this.photos[index] = photo) : this.photos.push(photo);
    },
    setPhotos(photos: any[]) {
      this.photos = photos;
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
    setStartDate(timestamp: number | null) {
      this.start_date = timestamp;
    },
    setEndDate(timestamp: number | null) {
      this.end_date = timestamp;
    },
    setStartTime(time?: string) {
      this.start_time = time ?? "";
    },
    setEndTime(time?: string) {
      this.end_time = time ?? "";
    },
    setEquipments(equipments: CheckboxValueType[]) {
      this.equipments = equipments;
    },
    setAmenities(amenities: CheckboxValueType[]) {
      this.amenities = amenities;
    },
    setMaxParticipants(maxParticipants: number | null) {
      this.max_participants = maxParticipants;
    },
    setPrice(price: number | null) {
      this.price = price;
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
      this.start_date = null;
      this.end_date = null;
      this.start_time = "";
      this.end_time = "";
      this.equipments = [];
      this.amenities = [];
      this.max_participants = null;
      this.price = null;
    },
  },
});
