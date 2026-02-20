import React from "react";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Stack, Table as MuiTable, Tooltip, Typography } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import Icon from "components/Icon";
import Menu from "components/Menu";
import Table from "components/Table/Table";
import { getStatusMessageTemplate } from "helpers/format";

const renderItems = (row, onView, onEdit, onDelete) => {
  const actions = [];
  if (onView) {
    actions.push({
      name: "view",
      label: "Просмотр",
      onClick: () => onView(row.id),
    });
  }
  if (onEdit) {
    actions.push({
      name: "edit",
      label: "Редактировать",
      onClick: () => onEdit(row.id),
    });
  }

  if (onDelete) {
    actions.push({
      name: "delete",
      label: "Удалить",
      onClick: () => onDelete(row.id),
    });
  }

  return actions;
};

const Row = ({
  row,
  columns,
  dataEntry,
  collapseContent,
  loadDataEntry,
  dataEntryKey,
  onView,
  onEdit,
  onDelete,
}) => {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);

  const entry = dataEntry?.[row.id] || {};
  const values = entry?.[dataEntryKey] || [];

  React.useEffect(() => {
    if (open) {
      dispatch(loadDataEntry(row.id));
    }
  }, [dispatch, open]);

  const renderCollapseContent = () => {
    switch (collapseContent) {
      case "table":
        return (
          <Table
            total={values.length}
            columns={columns}
            data={values}
            style={{ maxHeight: "calc(100vh - 415px)" }}
            withActions={false}
          />
        );
      case "message-templates":
        return (
          <Stack direction="column">
            <Typography
              fontSize={14}
            >{`Наименование шаблона: ${entry.name}`}</Typography>
            <Typography
              fontSize={14}
            >{`Текст шаблона сообщения: ${entry.content}`}</Typography>
            <Typography
              fontSize={14}
            >{`Статус шаблона сообщения: ${getStatusMessageTemplate(
              entry.active
            )}`}</Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell width={45} sx={{ p: 1, maxWidth: 45 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
          >
            {open ? (
              <Icon name="expandLess" color="primary" />
            ) : (
              <Icon name="expandMore" color="primary" />
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ p: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography fontSize={14}>{row.name}</Typography>
            {row?.active ? (
              <Tooltip title="Активный">
                <CheckCircleOutlineOutlinedIcon color="success" />
              </Tooltip>
            ) : null}
          </Stack>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ p: 1 }}></TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ p: 1 }}
          key="actions"
          width={50}
        >
          <Menu
            iconName="more"
            items={renderItems(row, onView, onEdit, onDelete)}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }}
          colSpan={4}
          sx={{ maxWidth: 60 }}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>{renderCollapseContent()}</Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const CollapsibleTable = ({
  id,
  columns,
  data,
  dataEntry,
  loadDataEntry,
  dataEntryKey,
  collapseContent,
  onView,
  onEdit,
  onDelete,
}) => {
  const history = useHistory();
  return (
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: "calc(100vh - 180px)",
        borderRadius: "10px",
      }}
    >
      <MuiTable aria-label="collapsible table">
        <TableBody>
          {data.map((row) => (
            <Row
              key={row.id}
              id={id}
              row={row}
              columns={columns}
              dataEntry={dataEntry}
              loadDataEntry={loadDataEntry}
              history={history}
              dataEntryKey={dataEntryKey}
              collapseContent={collapseContent}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
};

export default CollapsibleTable;
