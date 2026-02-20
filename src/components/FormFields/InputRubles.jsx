import React from "react";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";
import { NumericFormat } from "react-number-format";

import { inputStyles } from "./Input";

const InputRubles = ({
  label,
  input,
  meta: { touched, invalid, error, submitError } = {
    touched: false,
    invalid: false,
    error: "",
  },
  ...custom
}) => (
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
      ...custom.InputProps,
    }}
    inputProps={{
      // float может вместить не более 18 знаков
      // при вводе целого числа получим 5 сепараторов (23 символа) - "111 111 111 111 111 111"
      // для дробного с двумя знаками после запятой максимум 4 (22 символа) - "111 111 111 111 111.11"
      maxLength: 23,
    }}
  />
);

const StyledTextField = styled(TextField)(inputStyles);

function MaskedStyledTextField(props) {
  return (
    <NumericFormat
      {...props}
      allowNegative={false}
      allowedDecimalSeparators={[","]}
      customInput={StyledTextField}
      decimalScale={2}
      thousandSeparator=" "
    />
  );
}

export default InputRubles;
