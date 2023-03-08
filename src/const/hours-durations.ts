import { PickerTypes } from "@/ts/types/scroll-picker-types";

const hours = 12;

export const hoursDuration = () => {
  return [...Array(hours)]
    .map((_, i) => i)
    .reduce((acc: Array<PickerTypes>, cur) => {
      acc.push({ text: cur.toString(), value: cur.toString() });
      return acc;
    }, []);
};
