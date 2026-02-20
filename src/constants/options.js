import { APPROVED_SLUG, REJECTED_SLUG, WAITING_APPROVE } from "./status";

const MONDAY = "ПН";
const TUESDAY = "ВТ";
const WEDNESDAY = "СР";
const THURSDAY = "ЧТ";
const FRIDAY = "ПТ";
const SATURDAY = "СБ";
const SUNDAY = "ВС";

export const displayModeIdOne = 1;
export const displayModeIdTwo = 2;

export const BOOLEAN_OPTIONS = [
  { label: "Да", id: true },
  { label: "Нет", id: false },
];

export const BOOLEAN_AVAILABILITY_AUTOMATIC_DISTRIBUTION = [
  { label: "Доступна", id: true },
  { label: "Недоступна", id: false },
];

export const TIME_TO_APPROVE_OPTIONS = [
  { label: 1, id: "one" },
  {
    label: 1.5,
    id: "oneHalf",
  },
  { label: 2, id: "two" },
  { label: 2.5, id: "twoHalf" },
  { label: 3, id: "three" },
  { label: 3.5, id: "threeHalf" },
  { label: 4, id: "four" },
];

export const CALENDAR_SHIFT_PAIR_AVAILABLE_MIN_PERIOD_OPTIONS = [
  { label: 1, id: "one" },
  {
    label: 1.5,
    id: "oneHalf",
  },
  { label: 2, id: "two" },
  { label: 2.5, id: "twoHalf" },
  { label: 3, id: "three" },
  { label: 3.5, id: "threeHalf" },
  { label: 4, id: "four" },
];

export const TIME_TO_RECEIVE_APP_BY_DRIVER_OPTIONS = [
  { label: 2, id: "two" },
  { label: 3, id: "three" },
  { label: 4, id: "four" },
  { label: 5, id: "five" },
  { label: 6, id: "six" },
  { label: 7, id: "seven" },
  { label: 8, id: "eight" },
  { label: 9, id: "nine" },
  { label: 10, id: "ten" },
];

export const TIME_TO_APPROVE_SUMMARY_REQUEST_OPTIONS = [
  { label: 30, id: "thirty" },
  {
    label: 45,
    id: "fortyFive",
  },
  { label: 60, id: "sixty" },
];

export const VEHICLE_ADDITIONAL_RELEASE_OPTIONS = [
  {
    label: "Ожидает утверждения",
    id: WAITING_APPROVE,
  },
  {
    label: "Утвержден",
    id: APPROVED_SLUG,
  },
  {
    label: "Отклонен",
    id: REJECTED_SLUG,
  },
];

export const BOOLEAN_TYPE_COLOR = [
  { label: "Hex", id: "HEX" },
  { label: "RGB", id: "RGB" },
];

export const BOOLEAN_AVAILABLE = [
  { label: "Имеется", id: true },
  { label: "Отсутствует", id: false },
];

export const DISPLAY_MODE_TRANSPORTATION_REQUEST = [
  { label: "Все", id: displayModeIdOne },
  { label: "Требующие решения", id: displayModeIdTwo },
];

export const BOOLEAN_AVAILABLE_CALENDARS = [
  { label: "Доступно", id: true },
  { label: "Недоступно", id: false },
];

export const WEEK_DAYS = {
  [MONDAY]: {
    id: MONDAY,
    label: "ПН",
  },
  [TUESDAY]: {
    id: TUESDAY,
    label: "ВТ",
  },
  [WEDNESDAY]: {
    id: WEDNESDAY,
    label: "СР",
  },
  [THURSDAY]: {
    id: THURSDAY,
    label: "ЧТ",
  },
  [FRIDAY]: {
    id: FRIDAY,
    label: "ПТ",
  },
  [SATURDAY]: {
    id: SATURDAY,
    label: "СБ",
  },
  [SUNDAY]: {
    id: SUNDAY,
    label: "ВС",
  },
};
