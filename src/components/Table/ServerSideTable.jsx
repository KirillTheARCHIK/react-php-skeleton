import React, { useRef, useState } from "react";

import { useDispatch, useSelector } from "store/hooks";
import Paper from "@mui/material/Paper";
import { Box, Checkbox, styled, Table as MuiTable, TableSortLabel, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";

import { setPagination, setSort } from "actions/requestParams";

import { setAllCheckedCheckboxes, setCheckedCheckboxes } from "actions/checkboxes";
import CircularLoading from "components/CircularLoading";
import { RadioButton } from "components/Radio";
import IconButton from "components/IconButton";

import { getFilterParams } from "helpers/requestParams";
import { renderHighlightedText } from "helpers/highlightedText";

import {
  getAllCheckboxes,
  getColumnValue,
  getWidthColumn,
  handleOnMouseMove,
  handleOnMouseUp,
  loadColumnInfoLocalStorage,
  onClickResizeColumn,
} from "helpers/table";
import { isShowMoreText } from "helpers/showMoreText";
import { getLabelDisplayedRows } from "helpers/pagination";
import { INITIAL_VALUES_STATE } from "constants/request";
import { LIGHT_THEME } from "constants/themes";
import { HEIGHT_TABLE_CELL } from "constants/styles";

import LightSortIcon from "images/svg/icons/light_sort_icon.svg";
import DarkSortIcon from "images/svg/icons/dark_sort_icon.svg";
import { getRowsWithSpan } from "helpers/tableRowSpan";

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
    fontSize: 17,
    fontWeight: 700,
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#F9F9F9" : "#1B1A1A",
    padding: "16px",
  },
  [`&.${tableCellClasses.body}`]: {
    whiteSpace: "pre-line",
    fontSize: 18,
    padding: "10px 16px",
  },
  [`&.${tableCellClasses.body} a`]: {
    color: theme.palette.mode === LIGHT_THEME ? undefined : "#FFFFFF",
  },
}));

const ServerSideTable = ({
  total = 0,
  data = [],
  columns = [],
  withActions = true,
  withPagination = true,
  withToolbar = false,
  withCheckboxes = false,
  withRadioButtons = false,
  circularLoadingTop = 40,
  styleTableContainer = {},
  withShowMoreText = true,
  withSortableTableCell = true,
  disableChecked = false,
  getCustomRowSx = () => ({}),
  url,
  loadData,
  onView,
  onEdit,
  onDelete,
  loading,
  readOnly,
  fieldName,
  entryValue,
  isGroup,
  isListDisplay,
  extraActions,
  activeRadioButton,
  onRadioButtonClick,
  onAllCheckedOpen,
  isAllPagesChecked,
  reducerKey,
  customActions,
  initialExpandedTableRows,
  routeId,
  selectAction,
  rowSpanOptions,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const isResizing = useRef(-1);
  const outerRef = useRef(null);

  const [expandedText, setExpandedText] = React.useState({});
  const [allShowMoreText, setAllShowMoreText] = React.useState(false);

  const requestParams = useSelector((state) => state.requestParams[reducerKey]);
  const [requestGroupTableParams, setRequestGroupTableParams] = useState(INITIAL_VALUES_STATE);
  const checkedEntries = useSelector((state) => state.checkedCheckboxes.entries);
  const [columnsInfo, setColumnsInfo] = useState({});

  const { paginationParams, filterParams, sortParams, searchParams } = isGroup || isListDisplay ? requestGroupTableParams : requestParams;

  React.useEffect(() => {
    loadColumnInfoLocalStorage(routeId, setColumnsInfo, columns);
    document.onmousemove = (e) => {
      handleOnMouseMove(e, isResizing, columns, setColumnsInfo, routeId);
    };
    document.onmouseup = () => {
      handleOnMouseUp(isResizing, columns, routeId);
    };
    return () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }, [routeId, columns]);

  React.useEffect(() => {
    if (initialExpandedTableRows && total) {
      const newExpandedText = {};
      data.forEach((obj) => {
        newExpandedText[obj.id] = true;
      });
      setAllShowMoreText(true);
      setExpandedText({ ...expandedText, ...newExpandedText });
    } else {
      setAllShowMoreText(false);
      setExpandedText({});
    }
  }, [initialExpandedTableRows, total]);

  React.useEffect(() => {
    if (requestParams && allShowMoreText) {
      const newExpandedText = {};
      data.forEach((obj) => {
        newExpandedText[obj.id] = true;
      });
      setAllShowMoreText(true);
      setExpandedText(newExpandedText);
    }
  }, [requestParams, allShowMoreText, data]);

  const handleChangePage = (event, newPage) => {
    const pagination = { ...paginationParams, page: newPage + 1 };
    if (isGroup) {
      dispatch(
        loadData({
          url,
          fieldName,
          value: entryValue,
          ...pagination,
          ...sortParams,
        })
      );
      setRequestGroupTableParams((prev) => ({
        ...prev,
        paginationParams: { ...prev.paginationParams, page: newPage + 1 },
      }));
    } else {
      const filter = getFilterParams(filterParams, columns);
      dispatch(
        loadData({
          ...pagination,
          ...sortParams,
          ...searchParams,
          ...filter,
        })
      );
      dispatch(setPagination({ ...paginationParams, page: newPage + 1 }, reducerKey));
    }
  };

  const onClickShowMoreText = (id, allExpandedText) => {
    if (allExpandedText) {
      const newExpandedText = {};
      data.forEach((obj) => {
        newExpandedText[obj.id] = !allShowMoreText;
      });
      setAllShowMoreText(!allShowMoreText);
      setExpandedText({ ...expandedText, ...newExpandedText });
    } else {
      setExpandedText({ ...expandedText, [id]: !expandedText[id] });
      setAllShowMoreText(false);
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const initialPage = 1;
    const pagination = {
      ...paginationParams,
      page: initialPage,
      limit: newRowsPerPage,
    };

    if (isListDisplay) {
      loadData({
        value: entryValue,
        ...pagination,
      });
      setRequestGroupTableParams((prev) => ({
        ...prev,
        paginationParams: { page: initialPage, limit: newRowsPerPage },
      }));
    } else if (isGroup) {
      dispatch(
        loadData({
          url,
          fieldName,
          value: entryValue,
          ...pagination,
          ...sortParams,
        })
      );
      setRequestGroupTableParams((prev) => ({
        ...prev,
        paginationParams: { page: initialPage, limit: newRowsPerPage },
      }));
    } else {
      const filter = getFilterParams(filterParams, columns);
      dispatch(loadData({ ...pagination, ...sortParams, ...searchParams, ...filter }));
      dispatch(setPagination({ page: initialPage, limit: newRowsPerPage }, reducerKey));
      dispatch(
        setCheckedCheckboxes({
          [initialPage]: checkedEntries[initialPage],
        })
      );
    }
  };

  const handleClickSort = (event, property) => {
    const isAsc = sortParams.column === property && sortParams.sort === "asc";
    const newOrder = isAsc ? "desc" : "asc";
    if (isGroup) {
      dispatch(
        loadData({
          url,
          fieldName,
          value: entryValue,
          ...paginationParams,
          column: property,
          sort: newOrder,
          ...searchParams,
        })
      );
    } else {
      const filter = getFilterParams(filterParams, columns);
      dispatch(
        loadData({
          ...paginationParams,
          column: property,
          sort: newOrder,
          ...searchParams,
          ...filter,
        })
      );
    }
    dispatch(setSort({ column: property, sort: newOrder }, reducerKey));
  };

  const handleChangeAllChecked = (event, checked) => {
    if (checked) {
      const newCheckedValues = data.map((item) => item.id);
      onAllCheckedOpen();
      dispatch(
        setCheckedCheckboxes({
          ...checkedEntries,
          [paginationParams.page]: newCheckedValues,
        })
      );
    } else {
      dispatch(setAllCheckedCheckboxes(false));
      dispatch(
        setCheckedCheckboxes({
          ...checkedEntries,
          [paginationParams.page]: [],
        })
      );
    }
  };

  const handleChangeChecked = (event, checked, rowId) => {
    if (checked) {
      dispatch(
        setCheckedCheckboxes({
          ...checkedEntries,
          [paginationParams.page]: [...getCheckedPage(), rowId],
        })
      );
    } else {
      dispatch(setAllCheckedCheckboxes(false));
      dispatch(
        setCheckedCheckboxes({
          ...checkedEntries,
          [paginationParams.page]: getCheckedPage().filter((item) => item !== rowId),
        })
      );
    }
  };

  const getCheckedPage = () => {
    return checkedEntries?.[paginationParams.page] || [];
  };

  const getActionItems = (row) => {
    const actionsItems = [];

    if (onView) {
      actionsItems.push({
        name: "view",
        label: "Просмотр",
        onClick: () => onView(row.id, row),
      });
    }

    if (!readOnly && onEdit && row.canEdit !== false) {
      actionsItems.push({
        name: "edit",
        label: "Редактировать",
        onClick: () => onEdit(row.id, row),
      });
    }

    if (!readOnly && onDelete && row.canDelete !== false) {
      actionsItems.push({
        name: "delete",
        label: "Удалить",
        onClick: () => onDelete(row.id),
      });
    }
    if (extraActions) {
      return [...actionsItems, ...extraActions(row.id, row)];
    }
    return actionsItems;
  };

  const getColSpan = () => {
    if (withCheckboxes) {
      return columns.length + 2;
    }
    return columns.length + 1;
  };

  const renderData = () => {
    if (rowSpanOptions) {
      return getRowsWithSpan(data, rowSpanOptions, theme.palette.mode);
    }
    return data;
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
      {loading ? <CircularLoading top={circularLoadingTop} /> : null}
      {withToolbar ? (
        <Toolbar>
          <Typography>
            {getAllCheckboxes(checkedEntries).length ? `Выбрано значений: ${getAllCheckboxes(checkedEntries).length}` : "Выберите значения"}
          </Typography>
        </Toolbar>
      ) : null}
      <TableContainer
        sx={{
          maxHeight: withToolbar ? "calc(100vh - 294px)" : "calc(100vh - 270px)",
          ...styleTableContainer,
        }}
      >
        <MuiTable size="small" ref={outerRef} stickyHeader aria-label="sticky table" className={"table"}>
          <TableHead className={"tableHead"}>
            <TableRow>
              {total && withShowMoreText ? (
                <StyledTableCell
                  key="expanded-text"
                  width={50}
                  sx={{
                    position: "sticky",
                    left: 0,
                    backgroundColor: "inherit",
                    zIndex: 999,
                  }}
                >
                  <IconButton
                    name={allShowMoreText ? "arrowLeft" : "arrowRight"}
                    size="small"
                    title={allShowMoreText ? "Скрыть" : "Раскрыть"}
                    color="primary"
                    sx={{ p: "0px" }}
                    onClick={() => onClickShowMoreText(null, true)}
                  />
                </StyledTableCell>
              ) : null}
              {withCheckboxes ? (
                <StyledTableCell padding="checkbox" sx={{ width: "50px !important" }}>
                  <Checkbox
                    color="primary"
                    indeterminate={
                      !disableChecked &&
                      getAllCheckboxes(checkedEntries).length > 0 &&
                      getAllCheckboxes(checkedEntries).length < total &&
                      !isAllPagesChecked
                    }
                    checked={!disableChecked && ((getCheckedPage().length === data.length && data.length !== 0) || isAllPagesChecked)}
                    onChange={handleChangeAllChecked}
                  />
                </StyledTableCell>
              ) : null}
              {withRadioButtons && <StyledTableCell padding="checkbox" />}
              {columns.map((column, index) => (
                <StyledTableCell
                  key={column.id}
                  align="center"
                  sx={{
                    wordBreak: "break-word",
                    fontSize: 50,
                  }}
                  className={"tableCell"}
                >
                  <TableSortLabel
                    sx={{
                      ".MuiTableSortLabel-icon": {
                        minWidth: 24,
                      },
                      pointerEvents: withSortableTableCell ? "auto" : "none",
                    }}
                    active={sortParams.column === column.id && withSortableTableCell}
                    direction={sortParams.column === column.id ? sortParams.sort : "asc"}
                    IconComponent={theme.palette.mode === LIGHT_THEME ? LightSortIcon : DarkSortIcon}
                    onClick={(event) => handleClickSort(event, column.id)}
                  >
                    {getColumnValue({
                      value: column.label,
                      widthColumn: getWidthColumn(columnsInfo?.[column.id]),
                      isShowMoreText: isShowMoreText,
                      expandedText: expandedText,
                    })}
                  </TableSortLabel>
                  <Box
                    id={`${routeId}_resizeLine_${index}`}
                    className={`resizeLine resizeLine_${theme.palette.mode}`}
                    onMouseDown={() => onClickResizeColumn(index, isResizing)}
                  />
                </StyledTableCell>
              ))}
              <StyledTableCell
                key="actions"
                width={70}
                sx={{
                  maxWidth: 100,
                  position: "sticky",
                  right: 0,
                  backgroundColor: "inherit",
                  width: customActions ? "100px" : undefined,
                }}
              />
            </TableRow>
          </TableHead>
          <TableBody ref={outerRef} sx={{ filter: loading ? "blur(5px)" : "none" }}>
            {total ? (
              renderData(data).map((row) => {
                const customRowSx = getCustomRowSx(row);
                return (
                  <StyledTableRow
                    key={row.id}
                    id={row.id}
                    tabIndex={-1}
                    sx={{
                      cursor: "pointer",
                      backgroundColor: row.bgColorRow ?? row.bgColorSpanRow,
                      ...customRowSx,
                    }}
                  >
                    {withShowMoreText ? (
                      <StyledTableCell
                        width={10}
                        sx={{
                          maxWidth: 10,
                          position: "sticky",
                          left: 0,
                          backgroundColor: "inherit",
                          zIndex: 99,
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

                    {withCheckboxes ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={getCheckedPage().includes(row.id)}
                          onChange={(event, checked) => handleChangeChecked(event, checked, row.id)}
                          inputProps={{
                            "aria-labelledby": row.id,
                          }}
                        />
                      </TableCell>
                    ) : null}
                    {withRadioButtons ? (
                      <TableCell>
                        <RadioButton
                          onClick={() => onRadioButtonClick(row.id)}
                          checked={activeRadioButton === row.id}
                          name={`list-radio-${row.id}`}
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => {
                      const value = row[column.id];
                      const withTooltip = Boolean(column.tooltipFormat);

                      if (rowSpanOptions && !row.rowSpan && rowSpanOptions.spanningColumns.includes(column.id)) return null;
                      return (
                        <StyledTableCell
                          key={column.id}
                          onDoubleClick={() => (onView ? onView(row.id, row) : null)}
                          onClick={selectAction ? () => selectAction(row) : null}
                          sx={{
                            wordBreak: "break-word",
                            backgroundColor:
                              rowSpanOptions && row.rowSpan && row.rowSpan > 1 && rowSpanOptions.spanningColumns.includes(column.id)
                                ? row.bgColorSpanRow
                                : undefined,
                          }}
                          rowSpan={rowSpanOptions && rowSpanOptions.spanningColumns.includes(column.id) ? row.rowSpan : undefined}
                        >
                          {withTooltip
                            ? column.tooltipFormat(
                                row,
                                <div>
                                  {getColumnValue({
                                    column: column,
                                    value: value,
                                    widthColumn: getWidthColumn(columnsInfo?.[column.id]),
                                    row: row,
                                    searchParams: searchParams,
                                    renderHighlightedText: renderHighlightedText,
                                    isShowMoreText: isShowMoreText,
                                    expandedText: expandedText,
                                  })}
                                </div>
                              )
                            : getColumnValue({
                                column: column,
                                value: value,
                                widthColumn: getWidthColumn(columnsInfo?.[column.id]),
                                row: row,
                                searchParams: searchParams,
                                renderHighlightedText: renderHighlightedText,
                                isShowMoreText: isShowMoreText,
                                expandedText: expandedText,
                              })}
                        </StyledTableCell>
                      );
                    })}
                    {total && withActions && getActionItems(row).length ? (
                      <TableCell
                        key="actions"
                        width={50}
                        sx={{
                          maxWidth: 100,
                          position: "sticky",
                          right: 0,
                          backgroundColor: "inherit",
                          padding: "0px 16px",
                          width: customActions ? "100%" : undefined,
                          display: customActions ? "flex" : undefined,
                        }}
                      >
                        {onView(row.id, row)}
                      </TableCell>
                    ) : (
                      <TableCell />
                    )}
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow key="no-data">
                <TableCell colSpan={getColSpan()} align="center" height={HEIGHT_TABLE_CELL}>
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
          rowsPerPage={paginationParams.limit}
          page={paginationParams.page - 1}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Строк на странице"
          labelDisplayedRows={getLabelDisplayedRows}
        />
      )}
    </Paper>
  );
};

export default ServerSideTable;
