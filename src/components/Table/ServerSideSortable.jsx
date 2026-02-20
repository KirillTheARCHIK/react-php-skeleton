import React, { createContext, useContext, useRef, useState } from "react";

import { useDispatch, useSelector } from "store/hooks";
import Paper from "@mui/material/Paper";
import { Box, Checkbox, Table as MuiTable, Typography } from "@mui/material";

import { useTheme } from "@mui/material/styles";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

import { setPagination } from "actions/requestParams";

import { setAllCheckedCheckboxes, setCheckedCheckboxes } from "actions/checkboxes";
import Menu from "components/Menu";
import CircularLoading from "components/CircularLoading";
import { RadioButton } from "components/Radio";
import IconButton from "components/IconButton";
import withAlert from "components/HOC/withAlert";
import { StyledTableCell, StyledTableRow } from "./ServerSideTable";

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
import { showError } from "helpers/error";

import { INITIAL_VALUES_STATE } from "constants/request";
import { HEIGHT_TABLE_CELL } from "constants/styles";

const SortableItem = SortableElement(
  ({
    row,
    total,
    columns,
    outerRef,
    withCheckboxes,
    onView,
    withRadioButtons,
    withShowMoreText,
    expandedText,
    getActionItems,
    customActions,
    onClickShowMoreText,
    onRadioButtonClick,
    getCheckedPage,
    handleChangeChecked,
    withActions,
    activeRadioButton,
    getColumnValue,
    columnsInfo,
    searchParams,
    selectAction,
    activeRow,
  }) => {
    const { getCustomRowSx } = useContext(SortableBodyContainerContext);

    return (
      <StyledTableRow
        id={row.id}
        tabIndex={-1}
        sx={{
          cursor: "pointer",
          opacity: activeRow === row.id ? 0.5 : undefined,
          ...getCustomRowSx(row),
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
              onClick={() => {
                onClickShowMoreText(row.id);
              }}
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
            <RadioButton onClick={() => onRadioButtonClick(row.id)} checked={activeRadioButton === row.id} name={`list-radio-${row.id}`} />
          </TableCell>
        ) : null}

        {columns.map((column) => {
          const value = row[column.id];
          return (
            <StyledTableCell
              key={column.id}
              onDoubleClick={() => (onView ? onView(row.id) : null)}
              onClick={selectAction ? () => selectAction(row) : null}
              sx={{
                wordBreak: "break-word",
              }}
            >
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
            {customActions ? customActions() : null}
            <Menu iconName="more" items={getActionItems(row)} outerRef={outerRef} id={row.id} tagElement={"tr"} />
          </TableCell>
        ) : (
          <TableCell />
        )}
      </StyledTableRow>
    );
  }
);

const SortableBodyContainer = SortableContainer(({ total, data, outerRef, loading, withCheckboxes, columns, ...props }) => (
  <TableBody ref={outerRef} sx={{ filter: loading ? "blur(5px)" : "none" }}>
    {total ? (
      data.map((row, index) => {
        return (
          <SortableItem
            key={row.id}
            index={index}
            row={row}
            total={total}
            columns={columns}
            outerRef={outerRef}
            withCheckboxes={withCheckboxes}
            disabled={loading}
            {...props}
          />
        );
      })
    ) : (
      <StyledTableRow key="no-data">
        <TableCell colSpan={withCheckboxes ? columns.length + 2 : columns.length + 1} align="center" height={HEIGHT_TABLE_CELL}>
          Нет данных
        </TableCell>
      </StyledTableRow>
    )}
  </TableBody>
));

const ServerSideSortable = ({
  url,
  total,
  columns,
  data,
  loadData,
  onView,
  onEdit,
  onDelete,
  loading,
  readOnly,
  fieldName,
  entryValue,
  withActions,
  withToolbar,
  withCheckboxes,
  withRadioButtons,
  isGroup,
  extraActions,
  activeRadioButton,
  onRadioButtonClick,
  styleTableContainer,
  onAllCheckedOpen,
  isAllPagesChecked,
  circularLoadingTop,
  reducerKey,
  withShowMoreText,
  customActions,
  moveAction,
  onOpenAlert,
  withPagination,
  routeId,
  selectAction,
  initialExpandedTableRows,
  activeRow,
  getCustomRowSx,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const outerRef = useRef(null);
  const isResizing = useRef(-1);
  const [allShowMoreText, setAllShowMoreText] = React.useState(false);
  const [expandedText, setExpandedText] = React.useState({});

  const requestParams = useSelector((state) => state.requestParams[reducerKey]);
  const [requestGroupTableParams, setRequestGroupTableParams] = useState(INITIAL_VALUES_STATE);
  const checkedEntries = useSelector((state) => state.checkedCheckboxes.entries);
  const [columnsInfo, setColumnsInfo] = useState({});

  const { paginationParams, filterParams, sortParams, searchParams } = isGroup ? requestGroupTableParams : requestParams;

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
  }, [columns, routeId]);

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

  const getLabelDisplayedRows = ({ from, to, count }) => {
    return `${from}–${to} из ${count}`;
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

  /**
   * Устанавливает новый позиционный номер кортежа с учетом пагинации (например
   * при перемещении кортежа в таблице, событии Drag-and-Drop)
   *
   * **Важно!** Логика работы данной функции изменена, т.к. данные таблицы в
   * каталогах теперь представлены в обратном порядке, т.е. первым элементом
   * первой страницы набора данных является последняя запись.
   *
   * @param {number} oldIndex старый индекс кортежа, лежит в диапазоне
   * [0; paginationParams.limit)
   * @param {number} newIndex новый индекс кортежа, лежит в диапазоне
   * [0; paginationParams.limit)
   * @return {Promise<unknown>}
   */
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (newIndex !== oldIndex) {
      // Получаем элемент, который перемещаем, по старому индексу
      const sortRow = data[oldIndex];

      // Получаем целевой элемент, на который мы перемещаем текущий элемент, по новому индексу
      const targetRow = data[newIndex];
      const targetPositionNumber = targetRow.positionNumber; // Извлекаем его positionNumber

      // Устанавливаем новый positionNumber перемещаемого элемента
      // Он будет равен positionNumber целевого элемента
      const values = { positionNumber: targetPositionNumber };
      return new Promise((resolve) => {
        dispatch(
          moveAction(values, sortRow.id, {
            resolve: () => {
              resolve();
            },
            reject: ({ error }) => {
              resolve();
              showError(onOpenAlert, error);
            },
          })
        );
      });
    }
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
          maxHeight: withToolbar ? "calc(100vh - 294px)" : "calc(100vh - 206px)",
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
                      getAllCheckboxes(checkedEntries).length > 0 && getAllCheckboxes(checkedEntries).length < total && !isAllPagesChecked
                    }
                    checked={(getCheckedPage().length === data.length && data.length !== 0) || isAllPagesChecked}
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
                  }}
                  width={160}
                  className={"tableCell"}
                >
                  {getColumnValue({
                    value: column.label,
                    widthColumn: getWidthColumn(columnsInfo?.[column.id]),
                    isShowMoreText: isShowMoreText,
                    expandedText: expandedText,
                  })}
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
                }}
              />
            </TableRow>
          </TableHead>
          <SortableBodyContainerContext.Provider
            value={{
              getCustomRowSx,
            }}
          >
            <SortableBodyContainer
              total={total}
              data={data}
              outerRef={outerRef}
              loading={loading}
              withCheckboxes={withCheckboxes}
              columns={columns}
              onView={onView}
              withRadioButtons={withRadioButtons}
              withShowMoreText={withShowMoreText}
              expandedText={expandedText}
              customActions={customActions}
              getActionItems={getActionItems}
              onClickShowMoreText={onClickShowMoreText}
              onRadioButtonClick={onRadioButtonClick}
              getCheckedPage={getCheckedPage}
              handleChangeChecked={handleChangeChecked}
              withActions={withActions}
              activeRadioButton={activeRadioButton}
              getColumnValue={getColumnValue}
              onSortEnd={onSortEnd}
              distance={1}
              lockAxis="y"
              columnsInfo={columnsInfo}
              routeId={routeId}
              searchParams={searchParams}
              lockToContainerEdges={true}
              lockOffset={["-120%", "0%"]}
              selectAction={selectAction}
              activeRow={activeRow}
            />
          </SortableBodyContainerContext.Provider>
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

/**
 * Параметр вынесен в контекст, т.к. нет возможности его передать в качестве
 * props'а из-за обертки компонента библиотечным HOC'ом, интерфейс которого не
 * предусматривает расширение набора параметров.
 */
const SortableBodyContainerContext = createContext({
  getCustomRowSx: () => ({}),
});

ServerSideSortable.defaultProps = {
  total: 0,
  data: [],
  columns: [],
  withActions: true,
  withPagination: true,
  withToolbar: false,
  withCheckboxes: false,
  withRadioButtons: false,
  circularLoadingTop: 40,
  styleTableContainer: {},
  withShowMoreText: true,
  getCustomRowSx: () => ({}),
};

export default withAlert(ServerSideSortable);
