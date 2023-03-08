export const humanizeString = (string: string) => {
  string = string
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  string = string.charAt(0).toUpperCase() + string.slice(1);

  return string;
};

export const getUnifiedString = (
  items: Array<string | null | undefined>,
  delimiter: string
): string => {
  return items.filter(Boolean).join(delimiter);
};

export const getFirstLetters = (str: string, delimiter: string): string =>
  str
    .split(delimiter)
    .map((word) => word[0])
    .join("");
