import * as React from "react";
import { Field, Form } from "react-final-form";
import Select from "./Select";
import Icon from "components/Icon";

export default {
  title: "FormFields/Select",
  component: Select,
  argTypes: {
    input: {
      type: "object",
    },
    label: {
      type: "string",
      description: "Подпись поля",
      control: { type: "text" },
    },
    size: {
      description: "Размер поля",
      options: [undefined, "small", "medium"],
      control: { type: "radio" },
    },
    multiple: {
      type: "boolean",
      description: "Является ли селект мультиселектом",
      options: [true, false],
      control: { type: "radio" },
    },
    options: {
      type: "array",
      description: "Массив с опциями селекта",
    },
    placeholder: {
      type: "string",
      description: "Плэйсхолдер поля",
      control: { type: "text" },
    },
    fullWidth: {
      type: "boolean",
      description: "Занимает ли селект всю ширину контейнера",
      options: [true, false],
      control: { type: "radio" },
    },
    required: {
      type: "boolean",
      description: "Обязательно ли поле",
      options: [true, false],
      control: { type: "radio" },
    },
    icon: {
      type: "ReactNode",
      description: "Левая иконка",
    },
  },
};
const exampleOptions = [
  {
    label: "option1",
    id: "1",
  },
  {
    label: "option2",
    id: "2",
  },
  {
    label: "option3",
    id: "3",
  },
  {
    label: "option4",
    id: "4",
  },
  {
    label: "option5",
    id: "5",
  },
  {
    label: "option6",
    id: "6",
  },
];

const CustomForm = (props) => {
  return (
    <Form initialValues={{}} onSubmit={() => {}}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Field name="select">
            {({ input, meta }) => (
              <Select
                {...props}
                input={input}
                meta={meta}
                options={exampleOptions}
              />
            )}
          </Field>
        </form>
      )}
    </Form>
  );
};

const Template = (args) => <CustomForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Select label",
};

export const DefaultWithError = Template.bind({});
DefaultWithError.args = {
  label: "Select label",
  meta: {
    touched: true,
    invalid: true,
    error: "Error",
  },
};

export const DefaultLongValue = Template.bind({});
DefaultLongValue.args = {
  input: {
    value: {
      id: 1,
      label:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
    },
    onChange: () => {},
  },
  label: "Select label",
};

export const DefaultLongLabel = Template.bind({});
DefaultLongLabel.args = {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
};

export const DefaultWithIcon = Template.bind({});
DefaultWithIcon.args = {
  label: "Select label",
  icon: (
    <Icon
      name="search"
      color="action"
      fontSize="small"
      sx={{ width: 14, height: 14 }}
    />
  ),
};

export const Small = Template.bind({});
Small.args = {
  label: "Select label",
  size: "small",
};

export const SmallWithError = Template.bind({});
SmallWithError.args = {
  label: "Select label",
  size: "small",
  meta: {
    touched: true,
    invalid: true,
    error: "Error",
  },
};

export const SmallLongValue = Template.bind({});
SmallLongValue.args = {
  input: {
    value: {
      id: 1,
      label:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
    },
    onChange: () => {},
  },
  label: "Select label",
  size: "small",
};

export const SmallLongLabel = Template.bind({});
SmallLongLabel.args = {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  size: "small",
};

export const SmallWithIcon = Template.bind({});
SmallWithIcon.args = {
  label: "Select label",
  icon: (
    <Icon
      name="search"
      color="action"
      fontSize="small"
      sx={{ width: 14, height: 14 }}
    />
  ),
  size: "small",
};

export const DefaultMulti = Template.bind({});
DefaultMulti.args = {
  label: "Select label",
  multiple: true,
};

export const DefaultWithErrorMulti = Template.bind({});
DefaultWithErrorMulti.args = {
  label: "Select label",
  error: true,
  helperText: "Error",
  meta: {
    touched: true,
    invalid: true,
    error: "Error",
  },
  multiple: true,
};

export const DefaultLongValueMulti = Template.bind({});
DefaultLongValueMulti.args = {
  input: {
    value: [
      {
        id: 1,
        label:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
      },
    ],
    onChange: () => {},
  },
  label: "Select label",
  multiple: true,
};

export const DefaultLongLabelMulti = Template.bind({});
DefaultLongLabelMulti.args = {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  multiple: true,
};

export const DefaultWithIconMulti = Template.bind({});
DefaultWithIconMulti.args = {
  label: "Select label",
  icon: (
    <Icon
      name="search"
      color="action"
      fontSize="small"
      sx={{ width: 14, height: 14 }}
    />
  ),
  multiple: true,
};

export const SmallMulti = Template.bind({});
SmallMulti.args = {
  label: "Select label",
  size: "small",
  multiple: true,
};

export const SmallWithErrorMulti = Template.bind({});
SmallWithErrorMulti.args = {
  label: "Select label",
  size: "small",
  error: true,
  helperText: "Error",
  meta: {
    touched: true,
    invalid: true,
    error: "Error",
  },
  multiple: true,
};

export const SmallLongValueMulti = Template.bind({});
SmallLongValueMulti.args = {
  input: {
    value: [
      {
        id: 1,
        label:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
      },
    ],
    onChange: () => {},
  },
  label: "Select label",
  size: "small",
  multiple: true,
};

export const SmallLongLabelMulti = Template.bind({});
SmallLongLabelMulti.args = {
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  size: "small",
  multiple: true,
};

export const SmallWithIconMulti = Template.bind({});
SmallWithIconMulti.args = {
  label: "Select label",
  icon: (
    <Icon
      name="search"
      color="action"
      fontSize="small"
      sx={{ width: 14, height: 14 }}
    />
  ),
  size: "small",
  multiple: true,
};
