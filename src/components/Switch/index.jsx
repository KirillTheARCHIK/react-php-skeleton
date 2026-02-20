import React from "react";
import Switch from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { LIGHT_THEME } from "constants/themes";

const CustomSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 4,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#FFFFFF",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },

    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === LIGHT_THEME ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    color: "#A3A3A3",
    boxSizing: "border-box",
    width: 16,
    height: 16,
  },
  "& .MuiSwitch-track": {
    borderRadius: 24 / 2,
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default CustomSwitch;
