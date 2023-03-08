import { getSumForPayment } from "@/general/helpers/getSumForPayment";
import { Orderable } from "@/generated/graphql";
import { OrderHistoryType } from "@/ts/types/orders";
import dayjs from "dayjs";

export const getHistoryOrdersData = (item: Orderable, price: number) => {
  const ordersData: OrderHistoryType[] = [];

  switch (item?.__typename) {
    case "TrainerRate":
      item.user &&
        ordersData.push({
          id: item.user.id,
          date: dayjs(item.user.created_at).format("DD MMM"),
          rating: item.user.score?.toFixed(1),
          title: `${item.user?.first_name} ${item.user?.last_name}`,
          previewUrl: item.user?.avatarUrl,
          address: item.user?.facilities?.length
            ? item.user?.facilities[0]?.address?.street
            : "Training at client's location",
          price: item.front_price,
        });
      break;
    case "FacilityItem":
      ordersData.push({
        id: item.facility.id,
        title: item.facility.name || "",
        rating: item.facility.score?.toFixed(1),
        date: item.facility.productItems?.length
          ? dayjs(item.facility.productItems[0]?.created_at).format("DD MMM")
          : "",
        previewUrl: item?.facility?.media?.length
          ? item?.facility?.media[0]?.pathUrl
          : "",
        address: item?.facility?.address?.street || "",
        price: getSumForPayment(price, true),
      });
      break;
    case "Event":
      ordersData.push({
        id: item.id,
        title: item.title,
        rating: "0.0",
        date: dayjs(item.start_date).format("DD MMM"),
        previewUrl: item.media?.length ? item.media[0]?.pathUrl : "",
        address: item.address?.street,
        price: getSumForPayment(price, true),
      });
      break;
    case "Workout":
      ordersData.push({
        id: item.id,
        title: item.title,
        previewUrl: item.previewUrl,
        price: getSumForPayment(price, true),
      });
      break;
    default:
      break;
  }
  return ordersData;
};
