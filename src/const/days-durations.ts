import { PickerTypes } from "@/ts/types/scroll-picker-types";


export const daysDuration = (days = 31) => {
  return [...Array(days)]
    .map((_, i) => i)
    .reduce((acc: Array<PickerTypes>, cur) => {
      acc.push({ text: cur.toString(), value: cur.toString() });
      return acc;
    }, []);
};
