import React from "react";
import { FormHelperText as MuiFormHelperText } from "@mui/material";

const FormHelperText = ({ error }) => {
  const getMessage = () => {
    if (typeof error === "string") {
      return error.split(":")?.[1] || error;
    }
    return "Ошибка при записи в БД";
  };

  return (
    <MuiFormHelperText sx={{ mt: 1, wordBreak: "break-word" }} error>
      {getMessage()}
    </MuiFormHelperText>
  );
};

export default FormHelperText;
