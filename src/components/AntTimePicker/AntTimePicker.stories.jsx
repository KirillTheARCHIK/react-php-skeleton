import { ConfigProvider } from "antd";
import ruRu from "antd/locale/ru_RU";
import moment from "moment";
import AntTimePicker from "./AntTimePicker";

export default {
  title: "AntTimePicker",
  component: AntTimePicker,
  argTypes: {},
};

const Template = (args) => {
  // eslint-disable-next-line no-console
  const onChange = (date, dateString) => console.log(date, dateString);

  return (
    <ConfigProvider locale={ruRu}>
      <AntTimePicker onChange={onChange} {...args} />
    </ConfigProvider>
  );
};

export const Default = Template.bind({});
Default.args = {};

export const Small = Template.bind({});
Small.args = {
  size: "small",
};

export const TimePickerFormatted = Template.bind({});
TimePickerFormatted.args = {
  defaultValue: moment(),
  format: "HH:mm",
};
