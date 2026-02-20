import DatePickerField from "./DatePickerField";
import { Form } from "react-final-form";
import { Button, Stack } from "@mui/material";
import { isValidDate } from "helpers/formValidators";
import Debug from "components/Debug";

export default {
  title: "FormFields/DatePickerField",
  component: DatePickerField,
  argTypes: {},
};

function ExampleForm({ initialValues, ...props }) {
  return (
    <Form
      initialValues={initialValues}
      sx={{ width: "300px" }}
      onSubmit={(values) => {
        alert(values?.date);
      }}
    >
      {({ handleSubmit, values }) => (
        <form onSubmit={handleSubmit}>
          <Debug value={values} />
          <Stack spacing={2} sx={{ width: "300px" }}>
            <DatePickerField name="date" validate={isValidDate} style={{ marginBottom: 0 }} {...props} />
            <Button
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
Default.args = {
  preserveInvalidOnBlur: true,
};

export const WithInitialValues = Template.bind({});
WithInitialValues.args = {
  initialValues: {
    date: "2024-01-31T00:00:00",
  },
  fullWidth: true,
  label: "WithInitialValues",
};

export const Time = Template.bind({});
Time.args = {
  initialValues: {
    date: "2024-01-31T00:00:00",
  },
  fullWidth: true,
  label: "Time",
  type: "time",
};

export const DateTime = Template.bind({});
DateTime.args = {
  initialValues: {
    date: "2024-01-31T00:00:00",
  },
  fullWidth: true,
  label: "DateTime",
  type: "datetime",
};
