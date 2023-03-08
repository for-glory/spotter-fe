import { FacilitiesQuery, UsersQuery } from "@/generated/graphql";

export type Review = {
  id: number | string;
  date: string;
  avatarUrl: string;
  fullName: string;
  rating: number;
  text: string;
};

export type Facilities = NonNullable<FacilitiesQuery["facilities"]>["data"];

export type Trainers = NonNullable<UsersQuery["users"]>["data"];

export type UploadPdfFile = {
  path: string;
  pathUrl: string;
  title: string;
  id: string;
};
