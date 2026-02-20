// Валидаторы значений форм, возвращающие ошибку (обычно строку) или undefined

import { isISODate } from "helpers/validators";
import { moment } from "./date";

export const isValue = (value) => {
  if (value === null || value === undefined || value === "") return "Введите значение";
};

export const isPositiveNumber = (value) => {
  if (Number(value) <= 0) return "Значение должно быть больше нуля";
};

export const isNegativeNumber = (value) => {
  if (Number(value) >= 0) return "Значение должно быть меньше нуля";
};

export const isZeroNumber = (value) => {
  if (Number(value) !== 0) return "Значение должно быть нулем";
};

export const countLength = (count) => (value) => {
  return String(value) && String(value).length < count ? `Поле должно содержать ${count} символов` : undefined;
};

export const countLength4 = countLength(4);
export const countLength6 = countLength(6);

export const maxValue = (maxValue) => (value) => {
  return value > maxValue ? `Значение не может быть больше числа ${maxValue}` : undefined;
};
const minValue = (minValue) => (value) => {
  return value < minValue ? `Значение должно быть больше или равно ${minValue}` : undefined;
};

export const minValue0 = minValue(0);
export const minValue1 = minValue(1);
export const minValue3 = minValue(3);
export const minValue15 = minValue(15);
export const minValue91 = minValue(91);
export const minValueNegative80 = minValue(-80);

export const maxValue0 = maxValue(0);
export const maxValue1 = maxValue(1);
export const maxValue10 = maxValue(10);
export const maxValue24 = maxValue(24);
export const maxValue60 = maxValue(60);
export const maxValue70 = maxValue(70);
export const maxValue80 = maxValue(80);
export const maxValue99 = maxValue(99);
export const maxValue100 = maxValue(100);
export const maxValue120 = maxValue(120);
export const maxValue480 = maxValue(480);
export const maxValueInt = maxValue(2147483647);

export const required = (value) => {
  if (Array.isArray(value) && !value.length) return "Обязательное поле";
  if (value === false) return;
  if (value === 0) return;
  if (!value) return "Обязательное поле";

  return undefined;
};

/**
 * Валидатор обязательного ввода метки даты и времени.
 *
 * В случае отсутствия значения в поле даты, фактическое значение поля будет null.
 * @param {moment|null|string|undefined} value значение поля
 * @returns {string|undefined}
 */
export const dateRequired = (value) => {
  if (!value) return "Обязательное поле";
};

export const email = (value) =>
  value && !/^[A-ZА-Я0-9._%+-]+@[A-ZА-Я0-9.-]+\.[A-ZА-Я]{2,4}$/i.test(value)
    ? "Неверный формат email. Пример: username@inbox.org"
    : undefined;

export const phoneNumber = (value) => {
  let lengthPhone = 0;
  if (typeof value === "string") {
    lengthPhone = (value.match(/_/g) || []).length;
  }
  return value && lengthPhone !== 10 && !/^((8|\+7)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/i.test(value)
    ? "Неверный формат. Пример: +7 (999) 999-99-99"
    : undefined;
};

/**
 * Валидатор метки даты и времени.
 *
 * @param {moment|null|string} value значение поля
 * @returns {string|undefined}
 */
export const isValidDate = (value) => {
  if ((typeof value === "string" && !isISODate(value)) || (value instanceof moment && !value.isValid())) {
    return "Значение должно быть валидной меткой времени или даты";
  }
};

/**
 * Возвращает новый валидатор, собранный из нескольких валидаторов,
 * валидаторы будут применяться к значению до первой ошибки
 * @param validators валидаторы
 * @returns {(function(*): (*|undefined))|*}
 */
export default function composeValidators(...validators) {
  return function composedValidator(value) {
    for (let i = 0; i < validators.length; i++) {
      if (validators[i]) {
        const error = validators[i](value);

        if (error) return error;
      }
    }
  };
}
