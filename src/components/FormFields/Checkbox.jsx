import React from "react";
import { Box, Checkbox as MuiCheckbox, FormControlLabel } from "@mui/material";

const Checkbox = ({ input, label, customSxLabel = {}, ...custom }) => (
  <Box component="div" sx={{ mb: "25px", ...custom.style }}>
    <FormControlLabel
      sx={{
        ".MuiFormControlLabel-label": {
          fontSize: 14,
          ...customSxLabel,
        },
      }}
      control={
        <MuiCheckbox
          checked={input.value ? true : false}
          onChange={input.onChange}
          {...custom}
        />
      }
      label={label}
    />
  </Box>
);

export default Checkbox;
