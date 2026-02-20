import React from "react";
import { useHistory, NavLink } from "react-router-dom";
import "./styles.scss";

import { useTheme } from "@mui/material/styles";
import { Box, MenuItem } from "@mui/material";

import NavMenuItem from "./NavMenuItem";

import { buildMenu } from "helpers/menu";

const NavMenu = ({ routes }) => {
  const theme = useTheme();
  const history = useHistory();

  return (
    <>
      <MenuItem
        activeClassName="nav-link_active"
        key={"default"}
        sx={{
          display: "flex",
          alignItems: "center",
          fontSize: 16,
          whiteSpace: "pre-wrap",
          p: "12.5px 0px",
          minWidth: "max-content",
          opacity: 0.7,
        }}
        component={NavLink}
        to={"/default"}
      >
        {"Главная страница"}
      </MenuItem>
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        {buildMenu(routes, "menu").map((item) => {
          return (
            <NavMenuItem
              key={item.id}
              path={`/${item.id}`}
              {...item}
              mode={theme.palette.mode}
              disabled={item.disabled}
              history={history}
            />
          );
        })}
      </Box>
    </>
  );
};

export default NavMenu;
