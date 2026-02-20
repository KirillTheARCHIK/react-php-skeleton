import React from "react";

import Button from "components/Button";
import Icon from "components/Icon";
import { styled } from "@mui/material";
import { LIGHT_THEME } from "constants/themes";

const StyledButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#202020",
    color: theme.palette.mode === LIGHT_THEME ? "#000000" : "#FFFFFF",
  },
}));

const CustomButton = ({ value, iconName, className, disabled, ...props }) => {
  return (
    <StyledButton
      color="primary"
      variant="contained"
      className={className}
      disabled={disabled}
      sx={{
        width: "100%",
        height: 49,
        borderRadius: "10px !important",
        marginRight: "20px",
        ...props.sx,
      }}
      startIcon={
        <Icon
          name={iconName}
          color="primary"
          sx={{ fontSize: "25px !important" }}
        />
      }
      onClick={props.onClick}
    >
      {value}
    </StyledButton>
  );
};
export default CustomButton;
