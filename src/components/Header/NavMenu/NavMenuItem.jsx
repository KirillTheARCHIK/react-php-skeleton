import React from "react";
import { NavLink } from "react-router-dom";

import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import { Box } from "@mui/material";
import Popover from "@mui/material/Popover";
import {
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";

import Icon from "components/Icon";
import {
  DARK_MAIN_COLOR,
  LIGHT_MAIN_COLOR,
  LIGHT_THEME,
} from "constants/themes";

const NavMenuItem = ({ id, childs = [], path, mode, name, disabled }) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: `nav-menu-item-${id}`,
  });
  const [arrowPosition, setArrowPosition] = React.useState(null);

  const handleClickClose = () => {
    popupState.close();
  };
  const renderIconName = (route) => {
    const icon = route?.icon;
    if (icon) {
      return icon.name;
    }
    return id;
  };
  const renderMenuItems = (routes) => {
    return routes.map((route) => {
      return (
        <MenuItem
          key={route.key}
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: 14,
            whiteSpace: "pre-wrap",
            p: "12.5px 0px",
            minWidth: "max-content",
            "&:hover": {
              backgroundColor: "transparent",
              color: mode === LIGHT_THEME ? LIGHT_MAIN_COLOR : DARK_MAIN_COLOR,
            },
          }}
          activeClassName={`nav-link__item_active_${mode}`}
          component={NavLink}
          to={`${path}/${route.key}`}
          onClick={handleClickClose}
          disabled={route.disabled}
        >
          {route.name}
        </MenuItem>
      );
    });
  };

  const renderMenuContent = (routes) => {
    return routes.map((route, index) => {
      return (
        <Box key={index} sx={{ display: "flex" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box>{renderMenuItems(route.childs)}</Box>
          </Box>
          {index !== routes.length - 1 ? (
            <Divider orientation="vertical" sx={{ mr: 5, ml: 5 }} />
          ) : null}
        </Box>
      );
    });
  };

  return (
    <>
      <Box
        id={id}
        sx={
          disabled
            ? { ...mainItemStyles, pointerEvents: "none", opacity: 0.5 }
            : mainItemStyles
        }
        component={NavLink}
        to={path}
        activeClassName="nav-link_active"
        {...bindTrigger(popupState)}
        onClick={(event) => {
          const trigger = bindTrigger(popupState);
          trigger.onClick(event);
          setArrowPosition(event.clientX - 30);
          event.preventDefault();
        }}
      >
        {name}
        <Icon name="arrow" sx={{ width: 10, height: 6, ml: "5px" }} />
      </Box>

      <Popover
        {...bindPopover(popupState)}
        onClose={handleClickClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 4.5,
            borderRadius: "15px",
            display: "flex",
            "&:before": {
              content: '""',
              display: "block",
              position: "sticky",
              left: arrowPosition,
              width: 30,
              height: 28,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box component="div" sx={{ display: "flex", p: 5, pl: 1, pt: 2 }}>
          {renderMenuContent(childs)}
        </Box>
      </Popover>
    </>
  );
};

export const mainItemStyles = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  color: "inherit",
  opacity: 0.7,
  mr: { xl: "25px" },
  p: 0,
  "&:hover": {
    opacity: 1,
  },
};

export default NavMenuItem;
