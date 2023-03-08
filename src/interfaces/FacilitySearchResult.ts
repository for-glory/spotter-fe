import { Activity, Facility } from "@/generated/graphql";

export type FacilitySearchResult =
  | Pick<Facility, "id" | "name" | "media" | "address" | "score">
  | Pick<Activity, "__typename" | "id" | "media" | "created_at" | "updated_at">;
