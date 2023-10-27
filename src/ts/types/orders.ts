import { Maybe } from "@/generated/graphql";

export interface OrderHistoryType {
  id: string;
  title: string;
  rating?: Maybe<number> | string;
  date?: Maybe<string> | string | Date;
  start_date?: Maybe<string> | string | Date;
  end_date?: Maybe<string> | string | Date;
  previewUrl?: Maybe<string> | string;
  address?: Maybe<string> | string;
  price?: number | string;
}
