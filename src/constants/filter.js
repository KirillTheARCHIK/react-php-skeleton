import { formatFullDateTime } from "helpers/date";
import { BOOLEAN_AVAILABLE_CALENDARS } from "./options";

export const START_DATE_KEY = "start";
export const END_DATE_KEY = "end";

export const DATE_RANGE = {
  [START_DATE_KEY]: "Начало",
  [END_DATE_KEY]: "Окончание",
};

export const STICKY_FILTER_FIELDS = [
  {
    id: "createdAt.start",
    label: "Период с",
    format: formatFullDateTime,
    field: {
      type: "custom_datetime",
      disabled: (values) => Boolean(values.calendarShift),
    },
  },
  {
    id: "createdAt.end",
    label: "Период по",
    format: formatFullDateTime,
    field: {
      type: "custom_datetime",
      disabled: (values) => Boolean(values.calendarShift),
    },
  },
];

export const STICKY_FILTER_FIELDS_FOR_CALENDARS = [
  ...STICKY_FILTER_FIELDS,
  {
    id: "available",
    label: "Показ записей",
    field: {
      type: "select",
      options: BOOLEAN_AVAILABLE_CALENDARS,
    },
  },
];
