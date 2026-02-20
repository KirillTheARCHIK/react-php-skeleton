import React from "react";
import { IconButton } from "@mui/material";

import Icon from "components/Icon";
import { LIGHT_THEME } from "constants/themes";

const CustomIconButton = ({ className, iconName, onClick, disabled }) => {
  return (
    <IconButton
      color="primary"
      className={className}
      onClick={onClick}
      disabled={disabled}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#202020",
        borderRadius: "10px",
        ":hover": {
          backgroundColor: "#f4f4f4",
        },
        "&.Mui-disabled": {
          backgroundColor: (theme) =>
            theme.palette.mode === LIGHT_THEME ? "#CDCDCD" : "#808080",
        },
      }}
    >
      <Icon name={iconName} />
    </IconButton>
  );
};

export default CustomIconButton;
