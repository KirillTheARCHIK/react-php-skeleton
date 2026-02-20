import { forwardRef } from "react";
import AntDatePicker from "components/AntDatePicker";

/**
 * **Важно!** Компонент не предназначен для прямого использования с формами из
 * react-final-form. Скорее всего Вам требуется components/DatePickerField или
 * components/FormFields/DatePicker.
 */
const TimePicker = forwardRef((props, ref) => (
  <AntDatePicker {...props} picker="time" mode={undefined} ref={ref} />
));

export default TimePicker;
