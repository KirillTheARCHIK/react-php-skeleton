import DatePicker from "./DatePicker";
import { Field, Form } from "react-final-form";
import { Button, Stack } from "@mui/material";
import composeValidators, { isValidDate } from "helpers/formValidators";
import moment from "moment";
import { range } from "helpers/structures";
import Debug from "components/Debug";

export default {
  title: "FormFields/DatePicker",
  component: DatePicker,
  argTypes: {},
};

function ExampleForm(props) {
  return (
    <Form
      onSubmit={(values) => {
        alert(values["datepicker"]?.toISOString());
      }}
    >
      {({ handleSubmit, valid, pristine, values }) => (
        <form onSubmit={handleSubmit}>
          <Debug value={values} />
          <Stack spacing={2} sx={{ width: "300px" }}>
            <Field name="datepicker" validate={composeValidators(isValidDate)}>
              {({ input, meta }) => (
                <DatePicker
                  input={input}
                  meta={meta}
                  style={{ marginBottom: 0 }}
                  {...props}
                />
              )}
            </Field>

            <Button
              disabled={!valid || pristine}
              variant="contained"
              sx={{ width: "140px" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </form>
      )}
    </Form>
  );
}

const Template = (args) => <ExampleForm {...args} />;
export const Default = Template.bind({});
Default.args = {};

export const Small = Template.bind({});
Small.args = {
  size: "small",
};

export const FullWidth = Template.bind({});
FullWidth.args = {
  fullWidth: true,
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  label: "Label",
  fullWidth: true,
};

export const SmallWithLabel = Template.bind({});
SmallWithLabel.args = {
  label: "Label",
  size: "small",
  fullWidth: true,
};

export const WithLongLabel = Template.bind({});
WithLongLabel.args = {
  label: "Long test string custom super label to infinity and beyond",
  fullWidth: true,
};

export const SmallWithLongLabel = Template.bind({});
SmallWithLongLabel.args = {
  label: "Long test string custom super label to infinity and beyond",
  fullWidth: true,
  size: "small",
};

export const Time = Template.bind({});
Time.args = {
  label: "Time",
  fullWidth: true,
  type: "time",
};

export const DateTime = Template.bind({});
DateTime.args = {
  label: "DateTime",
  fullWidth: true,
  type: "datetime",
};

export const DateTimeNeedConfirm = Template.bind({});
DateTimeNeedConfirm.args = {
  label: "NeedConfirm",
  fullWidth: true,
  type: "datetime",
  needConfirm: true,
};

export const Year = Template.bind({});
Year.args = {
  label: "Year",
  fullWidth: true,
  type: "year",
};

export const Month = Template.bind({});
Month.args = {
  label: "Month",
  fullWidth: true,
  type: "month",
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: "Disabled",
  fullWidth: true,
  disabled: true,
};

export const Readonly = Template.bind({});
Readonly.args = {
  label: "Readonly",
  fullWidth: true,
  readOnly: true,
};

export const NotCleanOnBlur = Template.bind({});
NotCleanOnBlur.args = {
  label: "NotCleanOnBlur",
  fullWidth: true,
  preserveInvalidOnBlur: true,
};

const getDisabledDate = (current) => {
  return current && current < moment().startOf("day");
};

const getDisabledTime = (current) => {
  return {
    disabledHours: () => {
      if (current.isSame(moment(), "day")) {
        return range(0, 24).splice(4, 20);
      }
      return [];
    },
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
  };
};

export const DisabledDateTime = Template.bind({});
DisabledDateTime.args = {
  label: "DisabledDateTime",
  fullWidth: true,
  type: "datetime",
  disabledDate: getDisabledDate,
  disabledTime: getDisabledTime,
};
