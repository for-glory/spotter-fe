import { Address, FacilitiesQuery } from "@/generated/graphql";

export type PositionLatLng = {
  lat: number;
  lng: number;
};

export type MapFilters = {
  position: PositionLatLng;
  distance: number;
};

export type MapMarkerItem = Pick<Address, "id" | "lat" | "lng">;

export type LocationType = Pick<
  NonNullable<FacilitiesQuery["facilities"]>["data"][0],
  "id" | "address"
>;
