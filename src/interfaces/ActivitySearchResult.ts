import { Activity } from "@/generated/graphql";

export type ActivitySearchResult = Pick<Activity, "id">;
// "id" | "name" | "media" | "address"
