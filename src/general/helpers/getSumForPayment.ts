export const getSumForPayment = (sum: number | string, isFormatted = false) =>
  isFormatted ? (Number(sum) / 100).toFixed(2) : Number(sum) * 100;
