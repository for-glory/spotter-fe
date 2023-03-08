import { WEEKDAYS } from "@/const/schedule";

export const openHours = () => {
  const hoursRange: string[] = ["09:00-19:00"];

  return Object.keys(WEEKDAYS)
    .slice(0, -2)
    .reduce((acc: { [index: string]: string[] }, cur: string) => {
      acc[cur] = hoursRange;
      return acc;
    }, {});
};
