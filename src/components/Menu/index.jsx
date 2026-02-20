import React from "react";
import { Menu as MuiMenu, MenuItem, Typography } from "@mui/material";

import IconButton from "components/IconButton";
import Icon from "components/Icon";
import { DARK_MAIN_COLOR } from "constants/themes";
import useContextMenu from "hooks/useContextMenu";

const Menu = ({ iconName, items, outerRef, id, tagElement, disabled = false }) => {
  const { contextMenu, setContextMenu } = useContextMenu(outerRef, tagElement);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl) || Boolean(contextMenu?.[id]);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
    setContextMenu(null);
  };

  return (
    <div>
      <IconButton
        name={iconName}
        aria-label="more"
        id="icon-button"
        aria-controls={open ? "menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{ color: DARK_MAIN_COLOR }}
        disabled={disabled}
      />
      <MuiMenu
        id="menu"
        anchorEl={anchorEl}
        elevation={2}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "button",
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        anchorReference={contextMenu?.[id] ? "anchorPosition" : undefined}
        anchorPosition={
          contextMenu?.[id]
            ? {
                top: contextMenu?.[id]?.mouseY,
                left: contextMenu?.[id]?.mouseX,
              }
            : undefined
        }
        PaperProps={{ style: { width: 200, borderRadius: 5 } }}
      >
        {items.map((item, index) => (
          <MenuItem
            key={index}
            onClick={(event) => {
              item.onClick();
              handleClose(event);
            }}
            disabled={item.disabled}
          >
            <Icon
              name={item.name}
              color="primary"
              sx={{
                width: 15,
                height: 15,
              }}
            />
            <Typography sx={{ fontSize: 14, ml: "10px", whiteSpace: "pre-wrap" }}>{item.label}</Typography>
          </MenuItem>
        ))}
      </MuiMenu>
    </div>
  );
};

export default Menu;
