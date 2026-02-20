import React from "react";
import { Stack } from "@mui/material";

const StackButton = ({ children }) => {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={1}
      paddingTop={2}
    >
      {children}
    </Stack>
  );
};

export default StackButton;
