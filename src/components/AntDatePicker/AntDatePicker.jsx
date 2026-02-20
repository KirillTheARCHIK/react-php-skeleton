import { DatePicker as AntdDatePicker } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
import { useTheme } from "@mui/material/styles";
import clsx from "clsx";

import { DARK_THEME } from "constants/themes";
import "./styles.scss";

const CustomDatePicker = AntdDatePicker.generatePicker(momentGenerateConfig);

/**
 * **Важно!** Компонент не предназначен для прямого использования с формами из
 * react-final-form. Скорее всего Вам требуется components/DatePickerField или
 * components/FormFields/DatePicker.
 */
export default function AntDatePicker({ className, ...props }) {
  const {
    palette: { mode },
  } = useTheme();

  return (
    <CustomDatePicker
      className={clsx(className, {
        "ant-picker_dark-theme": mode === DARK_THEME,
      })}
      hourStep={1}
      minuteStep={1}
      secondStep={5}
      {...props}
    />
  );
}
