import React, { useRef } from "react";

import Paper from "@mui/material/Paper";
import { Table as MuiTable } from "@mui/material";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import Menu from "components/Menu";
import IconButton from "components/IconButton";
import CircularLoading from "components/CircularLoading";
import CustomShowMoreText from "components/ShowMoreText/CustomShowMoreText";
import { StyledTableCell, StyledTableRow } from "./ServerSideTable";

import { isShowMoreText } from "helpers/showMoreText";
import { HEIGHT_TABLE_CELL } from "constants/styles";
import "./styles.scss";

const Table = ({
  style,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onReturn,
  total = 0,
  data = [],
  columns = [],
  loading = false,
  withActions = true,
  withPagination = true,
  withExpandedText = true,
}) => {
  const [page, setPage] = React.useState(0);
  const [limit, setLimit] = React.useState(10);
  const [isReturnRows, setIsReturnRows] = React.useState({});
  const [expandedText, setExpandedText] = React.useState({});
  const outerRef = useRef(null);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onClickShowMoreText = (id) => {
    setExpandedText({ ...expandedText, [id]: !expandedText[id] });
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setLimit(newRowsPerPage);
    setPage(0);
  };

  const getLabelDisplayedRows = ({ from, to, count }) => {
    return `${from}–${to} из ${count}`;
  };

  const getActionItems = (row, index) => {
    const actionsItems = [];

    if (onDownload) {
      actionsItems.push({
        name: "download",
        label: "Скачать",
        onClick: () => onDownload(row.id),
      });
    }

    if (onView) {
      actionsItems.push({
        name: "view",
        label: "Просмотр",
        onClick: () => onView(row.id),
      });
    }

    if (onEdit) {
      actionsItems.push({
        name: "edit",
        label: "Редактировать",
        onClick: () => onEdit(row.id, row),
      });
    }

    if (onDelete && !isReturnRows[row.id]) {
      actionsItems.push({
        name: "delete",
        label: "Удалить",
        onClick: () => {
          onDelete(row.id, index);
          if (onReturn) setIsReturnRows({ ...isReturnRows, [row.id]: true });
        },
      });
    }

    if (onReturn && isReturnRows[row.id]) {
      actionsItems.push({
        name: "return",
        label: "Вернуть",
        onClick: () => {
          onReturn(row.id);
          setIsReturnRows({ ...isReturnRows, [row.id]: false });
        },
      });
    }

    return actionsItems;
  };

  const getColumnValue = (value, row, index, column) => {
    const columnValue = column.format ? column.format(value, row, index) : value;

    if (isShowMoreText(columnValue)) {
      return <CustomShowMoreText expanded={expandedText?.[row.id]} value={columnValue} />;
    }
    return columnValue;
  };

  const renderRow = (row, index) => {
    return (
      <StyledTableRow id={row.id} tabIndex={-1} key={index}>
        {withExpandedText ? (
          <StyledTableCell
            width={10}
            sx={{
              maxWidth: 10,
            }}
          >
            <IconButton
              name={expandedText?.[row.id] ? "arrowLeft" : "arrowRight"}
              size="small"
              title={expandedText?.[row.id] ? "Скрыть" : "Раскрыть"}
              color="primary"
              sx={{ p: "0px" }}
              onClick={() => onClickShowMoreText(row.id)}
            />
          </StyledTableCell>
        ) : null}

        {columns.map((column) => {
          const value = row[column.id];
          const width = column.width ?? 160;

          return (
            <StyledTableCell
              key={column.id}
              width={width}
              sx={{
                minWidth: width,
                textDecoration: isReturnRows[row.id] ? "line-through" : "none",
              }}
            >
              {getColumnValue(value, row, index, column)}
            </StyledTableCell>
          );
        })}
        {withActions ? (
          <TableCell key="actions" width={50}>
            <Menu iconName="more" items={getActionItems(row, index)} outerRef={outerRef} id={row.id} tagElement={"tr"} />
          </TableCell>
        ) : null}
      </StyledTableRow>
    );
  };

  const renderData = () => {
    if (withPagination) return data.slice(page * limit, page * limit + limit).map(renderRow);
    return data.map(renderRow);
  };

  return (
    <Paper
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid #E0E7ED",
      }}
    >
      {loading ? <CircularLoading top={40} /> : null}
      <TableContainer sx={{ ...style }}>
        <MuiTable size="small" ref={outerRef} stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {withExpandedText && total ? (
                <StyledTableCell
                  key="expanded-text"
                  width={10}
                  sx={{
                    maxWidth: 10,
                  }}
                />
              ) : null}
              {columns.map((column) => {
                const width = column.width ?? 160;
                return (
                  <StyledTableCell key={column.id} sx={{ minWidth: width }} width={width}>
                    {column.label}
                  </StyledTableCell>
                );
              })}
              {withActions && total ? <StyledTableCell key="actions" width={50} /> : null}
            </TableRow>
          </TableHead>
          <TableBody ref={outerRef} sx={{ filter: loading ? "blur(5px)" : "none" }}>
            {total ? (
              renderData()
            ) : (
              <StyledTableRow key="no-data">
                <TableCell colSpan={columns.length + 1} align="center" height={HEIGHT_TABLE_CELL}>
                  Нет данных
                </TableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>
      {withPagination && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={total}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице"
          labelDisplayedRows={getLabelDisplayedRows}
        />
      )}
    </Paper>
  );
};

export default Table;
