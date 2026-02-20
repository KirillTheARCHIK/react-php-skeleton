import Input from "./Input";
import Icon from "components/Icon";

export default {
  title: "FormFields/Input",
  component: Input,
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
      options: [undefined, "small"],
      control: { type: "radio" },
    },
  },
};

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  input: {
    value: "Test text",
  },
  label: "Input label",
  meta: {
    touched: false,
  },
};

export const DefaultWithError = Template.bind({});
DefaultWithError.args = {
  input: {
    value: "Test text",
  },
  label: "Input label",
  error: true,
  helperText: "Error",
};

export const DefaultLongValue = Template.bind({});
DefaultLongValue.args = {
  input: {
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  },
  label: "Input label",
};

export const DefaultLongLabel = Template.bind({});
DefaultLongLabel.args = {
  input: {
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  },
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
};

export const DefaultWithStartAdornet = Template.bind({});
DefaultWithStartAdornet.args = {
  input: {
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  label: "Input label",
  InputProps: {
    startAdornment: <Icon name="search" />,
  },
};

export const DefaultWithEndAdornet = Template.bind({});
DefaultWithEndAdornet.args = {
  input: {
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  label: "Input label",
  InputProps: {
    endAdornment: <Icon name="search" />,
  },
};

export const DefaultWithoutShrink = Template.bind({});
DefaultWithoutShrink.args = {
  input: {
    value: "",
  },
  label: "Input label",
  InputLabelProps: {
    shrink: false,
  },
};

export const Small = Template.bind({});
Small.args = {
  input: {
    value: "Test text",
  },
  label: "Input label",
  size: "small",
};

export const SmallWithError = Template.bind({});
SmallWithError.args = {
  input: {
    value: "Test text",
  },
  label: "Input label",
  size: "small",
  error: true,
  helperText: "Error",
};

export const SmallLongValue = Template.bind({});
SmallLongValue.args = {
  input: {
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  },
  label: "Input label",
  size: "small",
};

export const SmallLongLabel = Template.bind({});
SmallLongLabel.args = {
  input: {
    value:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  },
  label:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque finibus tellus id faucibus convallis. In diam eros, dapibus non quam et, varius aliquet metus.",
  size: "small",
};

export const SmallWithStartAdornet = Template.bind({});
SmallWithStartAdornet.args = {
  input: {
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  label: "Input label",
  InputProps: {
    startAdornment: <Icon name="search" />,
  },
  size: "small",
};

export const SmallWithEndAdornet = Template.bind({});
SmallWithEndAdornet.args = {
  input: {
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  label: "Input label",
  InputProps: {
    endAdornment: <Icon name="search" />,
  },
  size: "small",
};

export const SmallWithoutShrink = Template.bind({});
SmallWithoutShrink.args = {
  input: {
    value: "",
  },
  label: "Input label",
  InputLabelProps: {
    shrink: false,
  },
  size: "small",
};

export const SmallWithoutShrinkWithIcon = Template.bind({});
SmallWithoutShrinkWithIcon.args = {
  input: {
    value: "",
  },
  label: "Input label",
  InputProps: {
    startAdornment: <Icon name="search" />,
  },
  size: "small",
};
