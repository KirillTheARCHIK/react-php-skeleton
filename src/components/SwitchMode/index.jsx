import React, { useContext } from "react";
import { ColorModeContext } from "providers";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CustomSwitch from "components/Switch";
import Icon from "components/Icon";

import { DARK_THEME, LIGHT_THEME } from "constants/themes";

const label = { inputProps: { "aria-label": "Switch mode" } };

const checkedSwitch = {
  [LIGHT_THEME]: false,
  [DARK_THEME]: true,
};

const SwitchMode = () => {
  const theme = useTheme();
  const { toggleColorMode } = useContext(ColorModeContext);

  return (
    <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
      <Icon name="light" fontSize="small" />
      <CustomSwitch
        {...label}
        onChange={toggleColorMode}
        checked={checkedSwitch[theme.palette.mode]}
        sx={{ mr: 1, ml: 1 }}
      />
      <Icon name="dark" fontSize="small" />
    </Box>
  );
};

export default SwitchMode;
