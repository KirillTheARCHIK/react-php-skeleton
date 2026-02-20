import React from "react";
import { Box } from "@mui/material";

const InputLabel = ({ label, sx }) => {
  return (
    <Box
      component="div"
      sx={{
        fontSize: 14,
        color: (theme) => theme.palette.primary.main,
        mb: "4px",
        ...sx,
      }}
    >
      {label}
    </Box>
  );
};

InputLabel.defaultProps = {
  label: "",
  sx: {},
};

export default InputLabel;
