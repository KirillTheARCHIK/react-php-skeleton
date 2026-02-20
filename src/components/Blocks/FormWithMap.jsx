import { Box } from "@mui/material";
import { STYLE_CONTENT_FORM } from "constants/styles";
import React from "react";

const FormWithMap = ({ formFields, map, customSxFormFields }) => {
  return (
    <Box component="div" sx={{ display: "flex" }}>
      <Box
        component="div"
        sx={{
          ...STYLE_CONTENT_FORM,
          ...customSxFormFields,
          width: "100%",
          maxHeight: "calc(100vh - 214px)",
          mr: 1,
        }}
      >
        {formFields}
      </Box>
      {map}
    </Box>
  );
};

export default FormWithMap;
