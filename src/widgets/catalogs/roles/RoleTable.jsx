import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "components/IconButton";
import { Checkbox } from "@mui/material";

import { LIGHT_THEME } from "constants/themes";
import { ROLE_VIEW, ROLE_ACTIONS } from "constants/roles";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#202020",
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#F5F5F5" : "#1B1A1A",
  },
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    padding: "9px",
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#F9F9F9" : "#1B1A1A",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    padding: "9px",
  },
}));

const RoleTable = ({ isView, rows = [], rolesForm, setRolesForm, tableId }) => {
  const handleClickCell = (key) => {
    const values = rows.reduce((acc, current) => {
      const roles = current.roles ?? [];
      const roleKey = roles.find((item) => item.includes(key));
      const roleKeyView = roles.find((el) => el.includes(ROLE_VIEW));
      const conditionAction = key === ROLE_VIEW ? roles.includes(roleKey) : roles.includes(roleKey) && rolesForm.includes(roleKeyView);

      if (conditionAction) {
        acc.push(roleKey);
      }
      return acc;
    }, []);

    if (key === ROLE_VIEW) {
      const newRolesForm = rolesForm.filter((el) => rows.some(({ roles = [] }) => roles.includes(el)));
      changeRolesForm([...values, ...newRolesForm]);
    } else {
      changeRolesForm(values);
    }
  };

  const handleClickRow = (values) => {
    changeRolesForm(values);
  };

  const handleChangeCheckbox = (roleKey, actionKey) => {
    if (actionKey === ROLE_VIEW && rolesForm.includes(roleKey)) {
      const newRolesForm = rolesForm.filter((role) => !role.includes(roleKey.replace("_VIEW", "")));
      setRolesForm(newRolesForm);
    } else if (actionKey !== ROLE_VIEW && rolesForm.includes(roleKey)) {
      const newRolesForm = rolesForm.filter((role) => role !== roleKey);
      setRolesForm(newRolesForm);
    } else {
      setRolesForm([...rolesForm, roleKey]);
    }
  };

  const changeRolesForm = (values) => {
    if (values.every((role) => rolesForm.includes(role))) {
      const newRolesForm = rolesForm.reduce((acc, current) => {
        if (!values.includes(current)) {
          acc.push(current);
        }
        return acc;
      }, []);
      setRolesForm(newRolesForm);
    } else {
      setRolesForm([...new Set([...rolesForm, ...values])]);
    }
  };

  const disabledIconButtonCell = () => {
    if (isView) return true;
    return false;
  };

  const disabledCheckbox = (roleKeyView, key) => {
    if (isView) return true;
    if (key === ROLE_VIEW) return false;
    return !rolesForm.includes(roleKeyView);
  };

  const getActions = () => {
    const allRoles = rows.map((row) => row.roles).flat();
    const allActions = allRoles.map((role) => role.split("_").reverse()[0]);
    const filterActions = Object.values(ROLE_ACTIONS).reduce((acc, current) => {
      if (allActions.includes(current.key)) {
        acc.push(current);
      }
      return acc;
    }, []);

    return filterActions;
  };

  const getWidthCheckboxCell = () => {
    switch (tableId) {
      case "registries":
        return 180;
      default:
        return 240;
    }
  };

  return (
    <TableContainer component={Paper} sx={{ maxWidth: "max-content" }}>
      <Table aria-label="role table">
        <TableHead>
          <TableRow>
            <StyledTableCell width={450} sx={{ minWidth: 450 }}>
              Наименование
            </StyledTableCell>
            {getActions().map((action, index) => (
              <StyledTableCell key={index} component="th" width={getWidthCheckboxCell()} sx={{ minWidth: getWidthCheckboxCell() }}>
                <IconButton
                  name={action.name}
                  color="primary"
                  title={action.title}
                  iconProps={{ fontSize: "small" }}
                  disabled={disabledIconButtonCell()}
                  onClick={() => handleClickCell(action.key)}
                />
              </StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(({ key, name, roles = [] }) => {
            return (
              <StyledTableRow key={key}>
                <StyledTableCell
                  component="th"
                  scope="row"
                  onClick={() => {
                    if (!isView) {
                      handleClickRow(roles);
                    }
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  {name}
                </StyledTableCell>
                {getActions().map((action, index) => {
                  const roleKey = roles.find((el) => el.includes(action.key));
                  const roleKeyView = roles.find((el) => el.includes(ROLE_VIEW));
                  return (
                    <StyledTableCell key={index} width={getWidthCheckboxCell()} sx={{ minWidth: getWidthCheckboxCell() }}>
                      {roleKey ? (
                        <Checkbox
                          color="primary"
                          checked={rolesForm.includes(roleKey)}
                          size="small"
                          onChange={() => handleChangeCheckbox(roleKey, action.key)}
                          disabled={disabledCheckbox(roleKeyView, action.key)}
                        />
                      ) : (
                        <IconButton name="remove" disabled />
                      )}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RoleTable;
