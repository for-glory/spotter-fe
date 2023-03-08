import { PickerTypes } from "@/ts/types/scroll-picker-types";

const spacing = 15;

export const distance = () => {
  return [...Array(spacing)]
    .map((_, i) => i)
    .reduce((acc: Array<PickerTypes>, cur) => {
      acc.push({ text: String(cur + 1), value: String(++cur) });
      return acc;
    }, []);
};
