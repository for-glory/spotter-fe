import { Facility } from "@/generated/graphql";

export type SelectFacilityModalOptions = {
  title?: string;
  selected?: Facility | null;
  filters: any;
};

export type SelectFacilityModalResult = {
  facility: Facility | null;
};
