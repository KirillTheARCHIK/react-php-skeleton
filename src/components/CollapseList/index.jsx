import React, { useRef } from "react";

import { useDispatch, useSelector } from "store/hooks";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  styled,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

import { setPagination } from "actions/requestParams";

import Menu from "components/Menu";
import Icon from "components/Icon";
import CircularLoading from "components/CircularLoading";

import { getFilterParams } from "helpers/requestParams";
import { renderHighlightedText } from "helpers/highlightedText";

import { LIGHT_THEME } from "constants/themes";
import ServerSideTable from "components/Table/ServerSideTable";
import { setAllCheckedCheckboxes, setCheckedCheckboxes } from "actions/checkboxes";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    padding: "16px 20px 16px 0",
    borderBottom: `1px solid ${theme.palette.secondary.main}`,
  },
}));

const CollapseList = ({
  url,
  total,
  entryTotal,
  data,
  entryData,
  loadData,
  loadEntryData,
  columns,
  onView,
  onEdit,
  onDelete,
  onViewTable,
  loading,
  entryLoading,
  readOnly,
  fieldName,
  isGroup,
  accordionDetails,
  withActions,
  withActionsTable,
  extraActions,
  extraActionsTable,
  isCheckBoxMode,
  isCollapseListPaginated,
  styleTableContainer,
  styleListContainer,
  reducerKey,
  group,
  routeId,
  renderCustomButton,
  customTitle,
  countExpandedRowsAutomatically,
  isListDisplay,
  getCustomRowSx,
}) => {
  const dispatch = useDispatch();

  const [expandedRows, setExpandedRows] = React.useState([]);

  React.useEffect(() => {
    if (countExpandedRowsAutomatically) getExpandedRows();
  }, [data]);

  const [groupPage, setGroupPage] = React.useState(1);
  const [groupLimit, setGroupLimit] = React.useState(10);

  const requestParams = useSelector((state) => state.requestParams[reducerKey]);
  const outerRef = useRef(null);

  const { paginationParams, filterParams, sortParams, searchParams } = requestParams;
  const checkedEntries = useSelector((state) => state.checkedCheckboxes.entries);
  const isSearch = Object.keys(searchParams).length;

  const getCheckedPage = () => {
    return checkedEntries?.[paginationParams.page] || [];
  };
  const getExpandedRows = () => {
    const expandedRowsValue = data.slice(0, countExpandedRowsAutomatically).map((item) => {
      if (isListDisplay) {
        loadEntryData(item);
      }
      return item.id;
    });

    setExpandedRows(expandedRowsValue);
  };

  const handleChangeChecked = (checked, rowId) => {
    if (!checked) {
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

  const handleChange = (row, checked) => (event, isExpanded) => {
    if (isCheckBoxMode) {
      handleChangeChecked(checked, row?.id);
    } else {
      const value = row?.id || row[fieldName]?.key || row[fieldName];
      if (isExpanded) {
        if (isGroup) {
          dispatch(setPagination({ page: 1, limit: 10 }, reducerKey));
          dispatch(loadEntryData({ url, fieldName, value, page: 1, limit: 10 }));
        }
        if (isListDisplay) {
          loadEntryData(row);
        }
        setExpandedRows((prev) => [...prev, value]);
      } else {
        setExpandedRows((prevArray) => {
          const copyArray = [...prevArray];
          const deletedIndex = copyArray.indexOf(value);
          copyArray.splice(deletedIndex, 1);
          return copyArray;
        });
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    if (isGroup) {
      dispatch(
        loadData({
          url,
          fieldName,
          page: newPage + 1,
          limit: groupLimit,
        })
      );
      setGroupPage(newPage + 1);
    } else {
      const pagination = { ...paginationParams, page: newPage + 1 };
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

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    if (isGroup) {
      dispatch(loadData({ url, fieldName, page: 1, limit: newRowsPerPage }));
      setGroupPage(1);
      setGroupLimit(newRowsPerPage);
    } else {
      const filter = getFilterParams(filterParams, columns);
      const pagination = {
        ...paginationParams,
        page: 1,
        limit: newRowsPerPage,
      };
      dispatch(loadData({ ...pagination, ...sortParams, ...searchParams, ...filter }));
      dispatch(setPagination({ page: 1, limit: newRowsPerPage }, reducerKey));
    }
  };

  const getLabelDisplayedRows = ({ from, to, count }) => {
    return `${from}–${to} из ${count}`;
  };

  const getTableCellValue = (row, column) => {
    const columnValue = column.format ? column.format(row[column.id], row) : row[column.id];

    if (Object.keys(searchParams).length) {
      return renderHighlightedText(columnValue, searchParams.search);
    }
    return columnValue;
  };

  const getActionItems = (row) => {
    const actionsItems = [];

    if (onView) {
      actionsItems.push({
        name: "view",
        label: "Просмотр",
        onClick: () => onView(row.id),
      });
    }

    if (!readOnly && onEdit && row.canEdit !== false) {
      actionsItems.push({
        name: "edit",
        label: "Редактировать",
        onClick: () => onEdit(row.id),
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

  const getGroupValue = (row) => {
    if (row.id) {
      return row;
    }
    return row[fieldName];
  };

  const renderValue = (value) => {
    if (value === null) {
      return "Без группы";
    }
    return value;
  };

  const renderTitle = (data, row) => {
    if (isGroup) {
      const column = columns.find((item) => item.id === fieldName);
      return column.format ? column.format(getGroupValue(data), row) : renderValue(data[fieldName]);
    }
    if (customTitle) {
      return customTitle(row);
    }
    return data.displayName;
  };

  const getLimit = () => {
    if (isGroup) {
      return groupLimit;
    }
    return paginationParams.limit;
  };

  const getPage = () => {
    if (isGroup) {
      return groupPage - 1;
    }
    return paginationParams.page - 1;
  };

  const renderAccordionDetails = (row) => {
    switch (accordionDetails) {
      case "server-side-table": {
        const value = row?.id || row[fieldName]?.key || row[fieldName];
        let loading;
        let total;
        let data;
        if (isGroup) {
          loading = group[value]?.entryLoading ?? false;
          total = group[value]?.entryTotal ?? 0;
          data = group[value]?.entry ?? [];
        } else if (isListDisplay) {
          loading = group[row.id]?.entryLoading;
          data = group[row.id]?.entry ?? [];
          total = data.length ?? 0;
        } else {
          loading = entryLoading;
          total = entryTotal;
          data = entryData;
        }

        return (
          <AccordionDetails>
            <ServerSideTable
              url={url}
              total={total}
              columns={columns}
              data={data}
              loadData={loadEntryData}
              loading={loading}
              readOnly={readOnly}
              fieldName={fieldName}
              entryValue={value}
              withToolbar={false}
              withCheckboxes={false}
              isGroup={isGroup}
              isListDisplay={isListDisplay}
              withActions={withActionsTable}
              styleTableContainer={{
                maxHeight: "100%",
                ...styleTableContainer,
              }}
              onView={onViewTable}
              extraActions={extraActionsTable}
              reducerKey={reducerKey}
              routeId={routeId}
              getCustomRowSx={getCustomRowSx}
            />
          </AccordionDetails>
        );
      }
      default:
        return (
          <div id={row.id}>
            <AccordionDetails id={row.id} sx={{ width: "55%", pl: { xs: 10, md: 21 }, pt: 0 }}>
              <Table size="small" aria-label="purchases" sx={{ borderCollapse: "separate" }}>
                <TableBody>
                  {columns.map((column) => (
                    <TableRow key={column.id} sx={getCustomRowSx(column)}>
                      <StyledTableCell component="th" scope="row" sx={{ width: 230, fontWeight: 700 }}>
                        {column.label}
                      </StyledTableCell>
                      <StyledTableCell>{getTableCellValue(row, column)}</StyledTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionDetails>
          </div>
        );
    }
  };
  return (
    <>
      {loading ? <CircularLoading /> : null}
      <TableContainer
        ref={outerRef}
        sx={{
          maxHeight: "calc(100vh - 206px)",
          pr: 1,
          filter: loading ? "blur(5px)" : "none",
          ...styleListContainer,
        }}
      >
        {total ? (
          data.map((row, index) => {
            const value = row?.id || row[fieldName]?.key || row[fieldName];
            const checked = getCheckedPage().includes(row.id);
            let expandIcon;
            if (isCheckBoxMode) {
              expandIcon = checked ? <Icon name="checkCircle" color="primary" /> : <Icon name="emptyCircle" color="primary" />;
            } else
              expandIcon =
                isSearch || expandedRows.includes(value) ? (
                  <Icon name="expandLess" color="primary" />
                ) : (
                  <Icon name="expandMore" color="primary" />
                );

            return (
              <Accordion
                expanded={isSearch || (!isCheckBoxMode && expandedRows.includes(value))}
                onChange={handleChange(row, checked)}
                sx={{
                  position: "inherit",
                  width: "100%",
                  mb: "20px",
                  bgcolor: (theme) => (theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#333333"),
                  borderRadius: "10px !important",
                  boxShadow: (theme) => `0px 10px 1px -1px ${theme.palette.mode === LIGHT_THEME ? "rgba(237, 237, 246, 0.8)" : "#232323"}`,
                }}
                key={index}
              >
                <AccordionSummary
                  expandIcon={expandIcon}
                  aria-controls="panel1bh-content"
                  id={row.id}
                  sx={{
                    flexDirection: "row-reverse",
                    pl: "50px",
                  }}
                >
                  <Box id={row.id} component="div" display="flex" width="100%" justifyContent="space-between">
                    <Typography sx={{ fontWeight: 700, ml: "15px", alignSelf: "center" }}>{renderTitle(row, data[index])}</Typography>
                    {renderCustomButton ? renderCustomButton(row) : null}
                    {!isGroup && !isCheckBoxMode && withActions && getActionItems(row).length ? (
                      <Menu iconName="more" items={getActionItems(row)} outerRef={outerRef} id={row.id} tagElement={"div"} />
                    ) : null}
                  </Box>
                </AccordionSummary>
                {renderAccordionDetails(row)}
              </Accordion>
            );
          })
        ) : (
          <Typography sx={{ display: "flex", justifyContent: "center" }}>Нет данных</Typography>
        )}
      </TableContainer>
      {isCollapseListPaginated && (
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={total}
          rowsPerPage={getLimit()}
          page={getPage()}
          labelRowsPerPage="Строк на странице"
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelDisplayedRows={getLabelDisplayedRows}
        />
      )}
    </>
  );
};

CollapseList.defaultProps = {
  total: 0,
  data: [],
  columns: [],
  withActions: true,
  isCollapseListPaginated: true,
  styleListContainer: {},
  styleTableContainer: {},
  getCustomRowSx: () => ({}),
};

export default CollapseList;
