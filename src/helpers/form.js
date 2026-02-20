import { FORM_ERROR } from "final-form";

export const getFieldProps = ({ format, parse, validate }) => {
  const fieldProps = {};
  if (format) {
    fieldProps["format"] = format;
  }
  if (parse) {
    fieldProps["parse"] = parse;
  }
  if (validate) {
    fieldProps["validate"] = validate;
  }
  return fieldProps;
};

export const withCheckCommonErrors = async (values, onSubmit) => {
  const result = await onSubmit(values);

  const formHasOnlyCommonErrors =
    result && result[FORM_ERROR] && Object.keys(result).length === 1;

  return {
    ...result,
    formHasOnlyCommonErrors,
  };
};
