// Валидаторы значений, возвращающие boolean

import { moment } from "helpers/date";

export function isISODate(str) {
  return moment(str, moment.ISO_8601).isValid();
}
