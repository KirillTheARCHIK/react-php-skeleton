import React from "react";
import { Box } from "@mui/material";
import InputLabel from "components/InputLabel";
import IconButton from "components/IconButton";

const InputLabelWithHelp = ({ label, iconName, tooltipTitle, sx }) => {
  return (
    <Box
      component="div"
      sx={{ display: "flex", alignItems: "center", mb: "4px", ...sx }}
    >
      <InputLabel label={label} sx={{ mb: 0, mr: "4px" }} />
      <IconButton
        name={iconName}
        title={tooltipTitle}
        sx={{ p: 0 }}
        sxIcon={{ fontSize: 16 }}
        color="primary"
      />
    </Box>
  );
};

InputLabelWithHelp.defaultProps = {
  label: "",
  iconName: "",
  tooltipTitle: "",
  sx: {},
};

export default InputLabelWithHelp;
