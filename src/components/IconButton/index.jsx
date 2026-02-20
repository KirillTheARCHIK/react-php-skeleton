import React from "react";
import { Tooltip, IconButton as MuiIconButton } from "@mui/material";

import Icon from "components/Icon";

const IconButton = ({ name, title, iconProps, onClick = () => {}, ...props }) => {
  return (
    <Tooltip title={title}>
      <span>
        <MuiIconButton aria-label={title} onClick={onClick} {...props}>
          <Icon name={name} {...iconProps} />
        </MuiIconButton>
      </span>
    </Tooltip>
  );
};

export default IconButton;
