import InputSearch from "./InputSearch";

export default {
  title: "FormFields/InputSearch",
  component: InputSearch,
};

const Template = (args) => <InputSearch {...args} />;

export const Default = Template.bind({});
Default.args = {
  input: {
    value: "Test text",
  },
};

export const WithLabel = Template.bind({});
WithLabel.args = {
  input: {
    value: "Test text",
  },
  label: "InputSearch",
};

export const WithLongLabel = Template.bind({});
WithLongLabel.args = {
  input: {
    value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  label: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};
