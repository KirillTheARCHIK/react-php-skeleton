import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "store/hooks";
import { Autocomplete, Box, TextField } from "@mui/material";
import { styled, lighten, darken } from "@mui/system";

import Icon from "components/Icon";
import Modal from "components/Modal";

import { modalSlice } from "store/utility/modalSlice";
import { getStartPages } from "helpers/roles";
import { LIGHT_THEME } from "constants/themes";
import { ROUTES } from "constants/routes";

const GroupHeader = styled("div")(({ theme }) => ({
  position: "sticky",
  top: "-8px",
  padding: "4px 10px",
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === LIGHT_THEME ? lighten(theme.palette.primary.light, 0.85) : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled("ul")({
  padding: 0,
});

const SearchMenu = ({ modalName }) => {
  const dispatch = useDispatch();

  const userRoles = useSelector((state) => state.auth.roles);

  const handleClose = React.useCallback(() => dispatch(modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);

  const getOptions = () => {
    return getStartPages(userRoles).reduce((acc, current) => {
      const route = ROUTES.find((el) => el.routes.some((child) => child.routeId === current.key));
      if (route) {
        acc.push({ ...current, parentId: route.id, parentTitle: route.name });
      }
      return acc;
    }, []);
  };

  return (
    <Modal modalName={modalName} title="Навигационный поиск">
      <Autocomplete
        id="search-box"
        options={getOptions().sort((a, b) => -b.parentTitle.localeCompare(a.parentTitle))}
        groupBy={(option) => option.parentTitle}
        getOptionLabel={(option) => option.name}
        renderOption={(props, option) => (
          <Box
            {...props}
            component={NavLink}
            to={`/${option.parentId}/${option.key}`}
            onClick={handleClose}
            sx={
              option.disabled
                ? {
                    pointerEvents: "none",
                    opacity: 0.5,
                    textDecoration: "none",
                    color: "inherit",
                  }
                : { textDecoration: "none", color: "inherit" }
            }
          >
            {option.name}
          </Box>
        )}
        renderInput={(params) => {
          return (
            <TextField
              {...params}
              autoFocus
              placeholder="Введите наименование..."
              sx={{ mb: 0 }}
              InputProps={{
                ...params.InputProps,
                startAdornment: <Icon name="search" color="action" fontSize="small" />,
              }}
            />
          );
        }}
        renderGroup={(params) => (
          <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
          </li>
        )}
        noOptionsText="Нет совпадений"
      />
    </Modal>
  );
};

SearchMenu.defaultProps = {
  modalName: "search-menu-modal",
};

export default SearchMenu;
