import * as React from "react";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import Icon from "components/Icon";
import { Tooltip } from "@mui/material";

const ToggleViewMode = ({ value, toggleViewMode, disabled }) => {
  const handleChange = (event, newValue) => {
    if (newValue !== null) {
      toggleViewMode(newValue);
    }
  };

  return (
    <Tooltip title="Переключение списка отображения">
      <ToggleButtonGroup
        value={value}
        exclusive
        onChange={handleChange}
        aria-label="text alignment"
        size="small"
        disabled={disabled}
        sx={{
          display: "flex",
          alignItems: "center",
          mr: "10px",
          "& .MuiToggleButton-root": {
            color: "#AAAAAA",
          },
        }}
      >
        <ToggleButton value="table" aria-label="left aligned">
          <Icon name="table" />
        </ToggleButton>
        <ToggleButton value="list" aria-label="right aligned">
          <Icon name="list" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Tooltip>
  );
};

export default ToggleViewMode;
