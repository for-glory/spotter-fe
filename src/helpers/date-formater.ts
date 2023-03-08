import dayjs from "dayjs";

const formateDate = (date: string, format = "DD MMM, h:mm A") => {
  return dayjs(date).format(format);
};

const formateDayMonth = (date: string, format = "DD MMMM") => {
  return dayjs(date).format(format);
};

const timeConvertToHuman = (n: number) => {
  const num = n;
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return `${rhours > 0 ? rhours + " h " : ""}${rminutes} min`;
};

export { formateDate, timeConvertToHuman, formateDayMonth };
