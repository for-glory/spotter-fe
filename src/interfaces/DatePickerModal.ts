export type DatePickerModalResult = {
  date: number | null;
  field?: string | null;
};

export type DatePickerModalOptions = {
  value: number | null;
  field?: string | null;
  options?: DatePickerOptions;
};

export type DatePickerOptions = {
  min?: number;
  max?: number;
  title?: string;
  showTitle? :boolean;
};
