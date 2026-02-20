import { TEXT_ERROR } from "constants/errors";
import { put } from "redux-saga/effects";
import { getFilterParams } from "helpers/requestParams";
import { FORM_ERROR } from "final-form";

export const getTextError = (value) => {
  return value.error ? value.error : TEXT_ERROR;
};

/**
 * @typedef {Object} FieldError
 * @property {string} propertyPath название поля
 * @property {string} message текст ошибки
 */

/**
 * @typedef {Object} ResponseError
 * @property {string} error текст ошибки формы
 * @property {boolean} ok вернет false в случае ошибки
 * @property {FieldError[]} violations массив ошибок полей формы
 * @property {number} status код ошибки
 */

/**
 * Возвращает объект ошибок полей формы в соответствии с требованием React
 * Final Form, т.е. в виде идентичному объекту значений формы. Объект так же
 * содержит общую ошибку формы по атрибуту FORM_ERROR.
 *
 * @param {ResponseError} responseError
 * @return {*|[{message: string}]}
 */
export const getFormErrors = (responseError) => {
  const result = { [FORM_ERROR]: getTextError(responseError) };
  if (Array.isArray(responseError?.violations)) {
    return responseError.violations.reduce((result, violation) => {
      if (result[violation.propertyPath]) {
        result[violation.propertyPath] += ` ${violation.message}`;
      } else {
        result[violation.propertyPath] = violation.message;
      }
      return result;
    }, result);
  }
  return result;
};

export const errorChecking = (value) => {
  return value.ok !== false && Object.keys(value).length;
};

export const loadAction = (loadData, requestParams) => {
  const { paginationParams, filterParams, sortParams, searchParams } =
    requestParams;
  const filter = getFilterParams(filterParams);

  return put(
    loadData({
      ...paginationParams,
      ...sortParams,
      ...searchParams,
      ...filter,
    })
  );
};
