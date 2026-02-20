import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { NumericFormat } from "react-number-format";

import { inputStyles } from "./Input";

const InputNumber = ({
  label,
  input,
  meta: { touched, invalid, error, submitError } = {
    touched: false,
    invalid: false,
    error: "",
    submitError,
  },
  maxLength,
  InputProps,
  ...custom
}) => {
  return (
    <MaskedStyledTextField
      label={label}
      error={touched && invalid}
      helperText={touched && (error || submitError)}
      {...input}
      InputLabelProps={{
        shrink: true,
      }}
      {...custom}
      InputProps={{
        ...InputProps,
      }}
      inputProps={{
        maxLength: maxLength,
      }}
    />
  );
};

const StyledTextField = styled(TextField)(inputStyles);
function MaskedStyledTextField({ decimalScale, allowNegative, ...props }) {
  return (
    <NumericFormat
      {...props}
      allowNegative={allowNegative}
      allowedDecimalSeparators={[","]}
      decimalScale={decimalScale}
      customInput={StyledTextField}
    />
  );
}

InputNumber.defaultProps = {
  allowNegative: false,
  maxLength: 10,
  decimalScale: 0,
};

export default InputNumber;
