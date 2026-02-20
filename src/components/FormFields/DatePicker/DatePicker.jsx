import { useState } from "react";
import AntDatePicker from "components/AntDatePicker";
import AntTimePicker from "components/AntTimePicker";
import clsx from "clsx";
import useId from "hooks/useId";
import { useTheme } from "@mui/material/styles";
import { DARK_THEME } from "constants/themes";

import "./styles.scss";

const TYPES = {
  DATE: "date",
  TIME: "time",
  DATETIME: "datetime",
  ONLY_YEAR: "year",
  ONLY_MONTH: "month",
};

const INPUT_FORMATS = {
  [TYPES.DATE]: "DD.MM.YYYY",
  [TYPES.TIME]: "HH:mm",
  [TYPES.DATETIME]: "DD.MM.YYYY HH:mm",
  [TYPES.ONLY_YEAR]: "YYYY",
  [TYPES.ONLY_MONTH]: "MM.YYYY",
};

const INPUT_PLACEHOLDER = {
  [TYPES.DATE]: "дд.мм.гггг",
  [TYPES.TIME]: "чч:мм",
  [TYPES.DATETIME]: "дд.мм.гггг чч:мм",
  [TYPES.ONLY_YEAR]: "гггг",
  [TYPES.ONLY_MONTH]: "мм.гггг",
};

function getReadOnlyProps(readOnly) {
  if (!readOnly) return {};
  return {
    allowClear: false,
    inputReadOnly: true,
    open: false,
  };
}

function renderDatePicker({ type, ...props }) {
  switch (type) {
    case TYPES.TIME:
      return <AntTimePicker {...props} />;
    case TYPES.DATE:
      return <AntDatePicker {...props} />;
    case TYPES.DATETIME:
      return <AntDatePicker {...props} showTime />;
    case TYPES.ONLY_YEAR:
      return <AntDatePicker {...props} picker={TYPES.ONLY_YEAR} />;
    case TYPES.ONLY_MONTH:
      return <AntDatePicker {...props} picker={TYPES.ONLY_MONTH} />;
    default:
      return null;
  }
}

function DatePickerLabel({ id, label }) {
  if (!label) return null;
  return (
    <label htmlFor={id} className={"date-picker__label"}>
      {label}
    </label>
  );
}

function LegendContent({ text }) {
  if (!text) return null;
  return <div className={"date-picker__legend-content"}>{text}</div>;
}

function DatePickerError({ error }) {
  if (!error) return null;
  return <div className={"date-picker__error"}>{error}</div>;
}

/**
 * @callback blurCallback
 * @param {SyntheticFocusEvent} e
 *
 * @callback changeCallback
 * @param {SyntheticInputEvent} e
 *
 * @callback focusCallback
 * @param {SyntheticFocusEvent} e
 */

/**
 * Компонент DatePicker для работы со значениями даты и времени. Предназначен
 * для непосредственного использования в формах из react-final-form.
 *
 * P.S. Обратите внимание на компонент components/DatePickerField. Скорее всего
 * Вам требуется он.
 *
 * @param {Object} props объект параметров компонента
 * @param {"date"|"time"|"datetime"|"year"|"month"} [props.type] определяет
 * представление компонента, неявно формат отображаемых данных (может быть
 * переопределен атрибутом format)
 * @param {string} props.className дополнительный классы css для кастомизации
 * @param {boolean} props.disabled выключен ли компонент
 * @param {boolean} props.fullWidth определяет ширину занимаемого
 * пространства
 * @param {string} props.format определяет формат представления данных
 * @param {string} props.id идентификатор
 * @param {string} props.input.name название поля
 * @param {null|moment} props.input.value значение поля
 * @param {blurCallback} props.input.onBlur обработчик события потери фокуса
 * @param {changeCallback} props.input.onChange обработчик события ввода
 * @param {focusCallback} props.input.onFocus обработчик события получения
 * фокуса
 * @param {string} props.label подпись поля
 * @param {boolean} props.needConfirm требуется ли подтверждение для изменения
 * значение, по умолчанию false, для true компонент отобразит соответствующую
 * кнопку
 * @param {string} props.meta.error ошибка
 * @param {boolean} props.meta.touched был ли фокус на поле
 * @param {string} placeholder подпись поля при условии отсутствия значения
 * @param {boolean} props.readOnly включен ли режим "только для чтения"
 * @param {(undefined|"small")} props.size определяет размер поля, при
 * отсутствии значения, размер поля будет обычным (компоненту AntDatePicker
 * будет передано значение "middle")
 * @param {Object} props.style объект кастомных стилей, css-свойства
 * записываются в camelCase нотации в виде названия свойств объекта,
 * например, { marginTop: "5px" }
 * @param {Object} props.custom объект всех остальных свойств, свойства будут
 * переданы компоненту AntDatePicker или AntTimePicker (зависит от параметра
 * type)
 * @return {JSX.Element}
 */
export default function DatePicker({
  type = TYPES.DATE,
  className,
  disabled = false,
  fullWidth = false,
  format = INPUT_FORMATS[type],
  id,
  input: { name, value, onBlur, onChange, onFocus },
  label = "",
  needConfirm = false,
  meta: { error, touched, submitError },
  placeholder = INPUT_PLACEHOLDER[type],
  readOnly = false,
  size,
  style,
  ...custom
}) {
  const {
    palette: { mode },
  } = useTheme();

  const randomId = useId();
  id ??= randomId;

  const [isActive, setIsActive] = useState(false);
  const focusHandler = (...args) => {
    setIsActive(true);
    onFocus?.(...args);
  };
  const blurHandler = (...args) => {
    setIsActive(false);
    onBlur?.(...args);
  };
  const calendarChange = (event) => {
    onChange(event);
  };

  return (
    <div
      className={clsx("date-picker", className, {
        "date-picker_full-width": fullWidth,
        "date-picker_dark-theme": mode === DARK_THEME,
        "date-picker_size-small": size === "small",
        "date-picker_active": isActive,
        "date-picker_disabled": disabled,
        "date-picker_error": touched && (error || submitError),
      })}
      style={style}
    >
      <DatePickerLabel id={id} label={label} />
      <div className={"date-picker__body"}>
        {renderDatePicker({
          className,
          disabled,
          format,
          id,
          name,
          needConfirm,
          placeholder,
          size,
          type,
          value,
          onChange,
          ...custom,
          ...getReadOnlyProps(readOnly),
          onBlur: blurHandler,
          onFocus: focusHandler,
          onCalendarChange: calendarChange,
        })}
        <fieldset>
          <legend>
            <LegendContent text={label} />
          </legend>
        </fieldset>
      </div>
      <DatePickerError error={touched && (error || submitError)} />
    </div>
  );
}
