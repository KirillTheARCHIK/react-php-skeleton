import { ConfigProvider } from "antd";
import ruRu from "antd/locale/ru_RU";

import AntDatePicker from "./AntDatePicker";
import moment from "moment";

export default {
  title: "AntDatePicker",
  component: AntDatePicker,
  argTypes: {},
};

const Template = (args) => {
  // eslint-disable-next-line no-console
  const onChange = (date, dateString) => console.log(date, dateString);

  return (
    <ConfigProvider locale={ruRu}>
      <AntDatePicker onChange={onChange} {...args} />
    </ConfigProvider>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: "Placeholder",
};

export const NeedConfirm = Template.bind({});
NeedConfirm.args = {
  needConfirm: true,
};

export const DateTimePickerSizeLarge = Template.bind({});
DateTimePickerSizeLarge.args = {
  showTime: true,
  size: "large",
};

export const DateTimePicker = Template.bind({});
DateTimePicker.args = {
  showTime: true,
};

export const DateTimePickerSizeSmall = Template.bind({});
DateTimePickerSizeSmall.args = {
  showTime: true,
  size: "small",
};

export const DateTimePickerDisabled = Template.bind({});
DateTimePickerDisabled.args = {
  showTime: true,
  disabled: true,
};

export const DateTimePickerReadonly = Template.bind({});
DateTimePickerReadonly.args = {
  showTime: true,
  inputReadOnly: true,
  defaultValue: moment(),
  open: false,
  allowClear: false,
};

export const DateTimePickerFormatted = Template.bind({});
DateTimePickerFormatted.args = {
  defaultValue: moment(),
  format: "DD.MM.YYYY HH:mm:ss",
  showTime: true,
  name: "qwerty",
};

export const DateTimePickerStyled = Template.bind({});
DateTimePickerStyled.args = {
  defaultValue: moment(),
  showTime: true,
  style: { color: "#FF0000" },
};
