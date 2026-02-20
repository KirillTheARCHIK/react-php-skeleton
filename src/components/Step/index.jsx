import React from "react";
import { Box } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { LIGHT_THEME } from "constants/themes";

const CustomStepIcon = ({ active, completed, icon, error }) => {
  let contents = (
    <Box component="div" fontSize="small">
      {icon}
    </Box>
  );

  if (completed) {
    contents = error ? <Close /> : <Check />;
  }

  const getBgColor = (theme) => {
    if (error && completed) {
      return theme.palette.error.main;
    }
    return active || completed ? theme.palette.primary.main : "#a9a9a9";
  };

  return (
    <Box
      sx={{
        backgroundColor: (theme) => getBgColor(theme),
        color: (theme) =>
          theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#000000",
        width: "1em",
        height: "1em",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.5rem",
      }}
    >
      {contents}
    </Box>
  );
};

export default CustomStepIcon;
