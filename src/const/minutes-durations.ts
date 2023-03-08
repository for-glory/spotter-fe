import { PickerTypes } from "@/ts/types/scroll-picker-types";

export const minutesDuration = (
  step?: number,
  limit?: number,
  offset?: number
) => {
  return [...Array((limit || 60) / (step || 1))]
    .map((_, i) => i)
    .reduce((acc: Array<PickerTypes>, cur) => {
      const curValue = cur * (step || 1) + (offset ?? 1);
      acc.push({
        text: curValue < 10 ? `0${curValue}` : curValue.toString(),
        value: curValue.toString(),
      });
      return acc;
    }, []);
};
