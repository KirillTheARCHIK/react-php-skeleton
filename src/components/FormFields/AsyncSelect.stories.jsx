import { Field, Form } from "react-final-form";
import { Button, Stack } from "@mui/material";
import AsyncSelect from "./AsyncSelect";

export default {
  title: "FormFields/AsyncSelect",
  component: AsyncSelect,
  argTypes: {},
};

function ExampleForm({ initialValues, ...props }) {
  return (
    <Form
      onSubmit={(values) => {
        alert(printValue(values.select));
      }}
      initialValues={initialValues}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ width: "300px" }}>
            <Field name="select">
              {({ input, meta }) => (
                <AsyncSelect
                  input={input}
                  meta={meta}
                  style={{ marginBottom: 0 }}
                  loadOptions={loadOptions}
                  {...props}
                />
              )}
            </Field>

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

const printValue = (value) =>
  Array.isArray(value)
    ? value.map((option) => option.displayName)
    : value?.displayName;

const loadOptions = () =>
  new Promise((resolve) => {
    const options = {
      entries: [
        { id: 0, displayName: "0 option" },
        { id: 1, displayName: "1 option" },
        { id: 2, displayName: "2 option" },
        { id: 3, displayName: "3 option" },
        { id: 4, displayName: "4 option" },
      ],
      total: 5,
    };
    resolve(options);
  });

const Template = (args) => <ExampleForm {...args} />;
export const Default = Template.bind({});
Default.args = {
  label: "Default",
};

export const WithPlaceholder = Template.bind({});
WithPlaceholder.args = {
  placeholder: "With placeholder",
};

export const WithInitialValue = Template.bind({});
WithInitialValue.args = {
  initialValues: {
    select: { id: 0, displayName: "0 option" },
  },
  label: "With initial value",
};

export const MultipleWithInitialValue = Template.bind({});
MultipleWithInitialValue.args = {
  initialValues: {
    select: [
      { id: 0, displayName: "0 option" },
      { id: 4, displayName: "4 option" },
    ],
  },
  label: "Multiple with initial value",
  multiple: true,
};
