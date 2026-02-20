import React from "react";
import InputMask from "react-input-mask";
import Input from "./Input";

const InputPhone = ({ input, meta, ...custom }) => {
  return (
    <InputMask
      mask="+7 (999) 999-99-99"
      placeholder="+7 (___) ___-__-__"
      disabled={custom.disabled}
      {...input}
    >
      {(inputProps) => <Input meta={meta} {...inputProps} {...custom} />}
    </InputMask>
  );
};

export default InputPhone;
