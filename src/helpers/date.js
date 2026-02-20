import Moment from "moment-timezone";
import { extendMoment } from "moment-range";
import "moment/locale/ru";

import { range } from "helpers/structures";
import { maxValue } from "./formValidators";

// TODO: Убрать из зависимостей moment, moment-range, moment-timezone,
//  заменив на date-fns.
export const moment = extendMoment(Moment);

export const momentDate = (value) => {
  if (value) {
    return moment(value);
  }
};

export const momentTime = (value) => {
  if (value) {
    return moment(value, "h:mm a");
  }
};

export const momentFormatTime = (totalSeconds, showHours = false) => {
  if (totalSeconds) {
    const duration = moment.duration(totalSeconds, "seconds");

    const day = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    let format = "mm:ss";
    if (day >= 1) {
      format = "DD HH:mm:ss";
    } else if (hours >= 1 || showHours) {
      format = "HH:mm:ss";
    }

    return moment()
      .date(day)
      .hours(hours)
      .minutes(minutes)
      .seconds(seconds)
      .format(format);
  }
};

export const momentFormat = (value, formatString) => {
  if (value) {
    return moment(value).format(formatString);
  }
};

export const formatYear = (value) => {
  if (value) return moment(value?.year).format("YYYY");

  return null;
};

export const formatDate = (value) => {
  return momentFormat(value, "DD.MM.YYYY");
};

export const formatDateTime = (value) => {
  return momentFormat(value, "DD.MM.YYYY HH:mm");
};

export const formatFullDateTime = (value) => {
  return momentFormat(value, "DD.MM.YYYY HH:mm:ss");
};

export const formatTime = (value) => {
  return momentFormat(value, "HH:mm");
};

export const formatFullTime = (value) => {
  return momentFormat(value, "HH:mm:ss");
};

/**
 * Вернет строковое представление локальной даты в ISO 8601 без часового пояса
 *
 * @param {Moment} date объект даты
 * @return {String}
 */
export const toNaiveISOString = (date) => {
  return date.format("YYYY-MM-DDTHH:mm:ss");
};

export const getMinDate = (values) => {
  return moment.min(values);
};

export const getMaxDate = (values) => {
  return moment.max(values);
};

/**
 * Вернет True, если разница между переданной датой и текущим временем >= minutes
 *
 * @param {Moment} date объект даты
 * @param {Number} minutes количество минут
 * @return {Boolean}
 */
export const compareWithCurrentByMinutes = (date, minutes) => {
  const currentDate = moment();
  const diff = date.diff(currentDate, "minutes");
  if (diff < 0) {
    return false;
  }
  return diff >= minutes;
};

export const betweenDays = (startDate, endDate) => {
  const days = [];
  const start = moment(startDate, "DD.MM.YYYY");
  const end = moment(endDate, "DD.MM.YYYY");
  while (start.isSameOrBefore(end)) {
    days.push(start.clone().format("DD.MM.YYYY"));
    start.add(1, "days");
  }

  return days;
};

export const secondsToFormattedDate = (seconds) => {
  const date = new Date(seconds * 1000); // Преобразуем секунды в миллисекунды

  // Получаем компоненты даты и времени
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const secondsFormatted = String(date.getSeconds()).padStart(2, "0");

  // Форматируем дату и время в нужный вид
  return `${day}.${month}.${year} ${hours}:${minutes}:${secondsFormatted}`;
};

export const betweenMonths = (startDate, endDate) => {
  const months = [];

  if (startDate < endDate) {
    const date = startDate.startOf("month");

    while (date < endDate.endOf("month")) {
      months.push(date.format("YYYY-MM"));
      date.add(1, "month");
    }
  }

  return months;
};

export const addMinutes = (isoStr, minutes, customFormat = null) => {
  if (customFormat) {
    return customFormat(new Date(new Date(isoStr).getTime() + minutes * 60000));
  }
  return new Date(new Date(isoStr).getTime() + minutes * 60000);
};

/**
 * Возвращает функцию для проверки принадлежности даты заданному диапазону,
 * используется для ограничения диапазона выборки дат компонента DatePicker
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @return {function(*): boolean}
 */
export const getDisabledDate = (startDate, endDate) => (current) =>
  !current.isBetween(startDate, endDate, "day", "[]");

/**
 * Возвращает функцию для проверки принадлежности времени заданному диапазону,
 * используется для ограничения диапазона выборки времени компонента DatePicker
 *
 * @param {Moment} startDate
 * @param {Moment} endDate
 * @param {number | null} incrementStartMinutesValue - значение инкремента минут для начальной даты (по умолчанию null или число)
 * @return {(function(*): ({disabledHours: function(): [], disabledMinutes: function(): []}))|*}
 */
export const getDisabledTime =
  (startDate, endDate, incrementStartMinutesValue = null) =>
  (current) => {
    if (!current.isBetween(startDate, endDate, "day", "[]")) {
      return {
        disabledHours: () => range(0, 24),
        disabledMinutes: () => range(0, 60),
      };
    }

    const result = {
      disabledHours: [],
      disabledMinutes: [],
    };

    const incrementedStartDate = incrementStartMinutesValue
      ? startDate.clone().add(incrementStartMinutesValue, "minutes")
      : startDate;

    if (current.isSame(incrementedStartDate, "day")) {
      result.disabledHours.push(...range(0, incrementedStartDate.hour()));
      if (current.isSame(incrementedStartDate, "hour")) {
        result.disabledMinutes.push(
          ...range(0, incrementedStartDate.minutes())
        );
      } else if (current.hour() < startDate.hour()) {
        result.disabledMinutes.push(...range(0, 60));
      }
    }

    if (current.isSame(endDate, "day")) {
      result.disabledHours.push(...range(endDate.hour() + 1, 24));
      if (current.isSame(endDate, "hour")) {
        result.disabledMinutes.push(...range(endDate.minute() + 1, 60));
      } else if (current.hour() > endDate.hour()) {
        result.disabledMinutes.push(...range(0, 60));
      }
    }

    return {
      disabledHours: () => result.disabledHours,
      disabledMinutes: () => result.disabledMinutes,
    };
  };

/**
 * Преобразует значение поля из формы в валидное представление для DatePicker.
 * Функция предназначена для совместного использования с функцией
 * parseDateField в компоненте Field из react-final-form.
 *
 * @param {string|undefined} value строковое представление локальной даты в ISO
 * 8601 без часового пояса или null
 * @return {Moment|null}
 */
export const formatDateField = (value) => {
  if (value) {
    return moment(value);
  }
  return null;
};

/**
 * Преобразует значение из компонента DatePicker в строковое представление
 * значения формы или null.
 * Функция предназначена для совместного использования с функцией
 * formatDateField в компоненте Field из react-final-form.
 *
 * @param {Moment|null} value
 * @return {string|null} строковое представление локальной даты в ISO 8601 без
 * часового пояса или пустая строка
 */
export const parseDateField = (value) => {
  if (value) {
    return toNaiveISOString(value);
  }
  return null;
};

export const getMonthsWithDaysInYear = (year) => {
  const validators = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = moment(`${year}-${month}`, "YYYY-M").daysInMonth();
    const maxDays = daysInMonth * 24;
    validators.push(maxValue(maxDays));
  }
  return validators;
};
