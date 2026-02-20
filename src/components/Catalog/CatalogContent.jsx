import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "store/hooks";
import { Badge, Box, Stack } from "@mui/material";

import { setAllCheckedCheckboxes, setCheckedCheckboxes } from "actions/checkboxes";
import { loadGroupData, loadGroupEntryData } from "actions/group";
import { initParams, setFilter } from "actions/requestParams";

import ServerSideTable from "components/Table/ServerSideTable";
import IconButton from "components/IconButton";
import withDeleteDialog from "components/HOC/withDeleteDialog";
import { withAllCheckedDialog } from "components/HOC/withAllCheckedDialog";
import SettingsTable from "components/SettingsTable";
import ToggleViewMode from "components/ToggleViewMode";
import GroupPopover from "components/Group";
import CollapseList from "components/CollapseList";
import Search from "components/Search";
import withExportDownload from "components/HOC/withExportDownload";
import FilterDrawer from "components/FilterDrawer";
import CustomChips from "components/Chips/FilterChip";
import ServerSideSortable from "components/Table/ServerSideSortable";
import Icon from "components/Icon";
import withAlert from "components/HOC/withAlert";

import { getFilterParams } from "helpers/requestParams";

import { DARK_MAIN_COLOR, LIGHT_THEME } from "constants/themes";
import { LOCAL_STORAGE_KEY_EXPANDED_TABLE_ROWS, LOCAL_STORAGE_KEY_VISIBLE_COLUMNS } from "constants/table";

const CatalogContent = ({
  routeId,
  title,
  columns,
  data,
  loadData,
  onAdd,
  onView,
  onEdit,
  onDelete,
  readOnly,
  onOpenDeleteDialog,
  withToggleViewMode,
  withToolbar,
  withCheckboxes: withCheckboxesProp,
  withRadioButtons,
  withSettingsTable,
  activeRadioButton,
  reset,
  withExport,
  withSearch,
  withFilter,
  withGroup,
  withGoBack,
  extraActions,
  onOpenExportDownload,
  onRadioButtonClick,
  onOpenIntegrationModal,
  withIntegration,
  url,
  handleAllCheckedOpen,
  reducerKey,
  visibleButton,
  customSx,
  withShowMoreText,
  customActions,
  getCustomStyleContainer,
  withSortable,
  moveAction,
  onGetToolbar,
  CustomTable,
  LeftContent,
  withTitle,
  withHelpInfo,
  withPagination,
  withRefresh,
  sxOnGetToolbar,
  withActions,
  stickyFilterFields,
  selectAction,
  activeRow,
  disableChecked,
  additionalValuesFilter,
  getCustomRowSx,
  rowSpanOptions,
  withSortableTableCell,
}) => {
  const withCheckboxes = withCheckboxesProp && !readOnly;
  const checkedEntries = useSelector((state) => state.checkedCheckboxes.entries);
  const isSomeoneChecked = useMemo(
    () =>
      Object.values(checkedEntries).some((value) => {
        if (Array.isArray(value)) {
          return value.length !== 0;
        }
        return false;
      }),
    [checkedEntries]
  );

  const history = useHistory();
  const dispatch = useDispatch();
  const filterParams = useSelector((state) => state.requestParams[reducerKey]?.filterParams);
  const requestParams = useSelector((state) => state.requestParams[reducerKey]);
  const { sortParams, searchParams } = requestParams;

  const groupParams = useSelector((state) => state.requestParams[reducerKey]?.groupParams);
  const paginationParams = useSelector((state) => state.requestParams[reducerKey]?.paginationParams);
  const group = useSelector((state) => state.group);
  const isAllPagesChecked = useSelector((state) => state.checkedCheckboxes.isAllChecked);
  const currentUser = useSelector((state) => state.auth.currentUser);

  const allColumnsVisible = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_VISIBLE_COLUMNS));
  const allExpandedTableRows = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EXPANDED_TABLE_ROWS));
  const initialSettingsColumns = columns.map((item) => item.id);
  const initialCheckedColumns = allColumnsVisible?.[routeId] || initialSettingsColumns;
  const initialExpandedTableRows = allExpandedTableRows?.[routeId] || false;

  const [viewMode, setViewMode] = React.useState("table");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [isGroup, setIsGroup] = React.useState(false);
  const [visibleSettingTable, setVisibleSettingsTable] = React.useState(false);

  const [checkedColumns, setCheckedColumns] = React.useState(initialCheckedColumns);
  const [expandedTableRows, setExpandedTableRows] = React.useState(initialExpandedTableRows);

  const handleDeleteChip = (chip) => {
    const newFilterParams = {};
    Object.keys(filterParams).forEach((element) => {
      if (element !== chip.id) {
        newFilterParams[element] = filterParams[element];
      }
    });

    const params = getFilterParams(newFilterParams, columns);

    dispatch(setFilter(newFilterParams, reducerKey));
    dispatch(
      loadData({
        ...params,
        ...paginationParams,
        ...sortParams,
        ...searchParams,
      })
    );

    if (withCheckboxes) {
      dispatch(setCheckedCheckboxes({}));
    }
    if (withRadioButtons) {
      onRadioButtonClick(null);
    }
  };

  const [isCheckBoxMode, setCheckBoxMode] = React.useState(false);
  const handleSetCheckBoxMode = () => {
    setCheckBoxMode((prev) => !prev);
  };
  React.useEffect(() => {
    if (isAllPagesChecked) {
      const newCheckedValues = data.entries.map((item) => item.id);
      dispatch(
        setCheckedCheckboxes({
          ...checkedEntries,
          [paginationParams.page]: newCheckedValues,
        })
      );
    }
  }, [paginationParams.page, isAllPagesChecked, data.entries]);

  React.useEffect(() => {
    return () => {
      if (reset) {
        dispatch(initParams(reducerKey));
        dispatch(setAllCheckedCheckboxes(false));
        dispatch(setCheckedCheckboxes({}));
        setIsGroup(false);
      }
    };
  }, [dispatch]);

  const refreshData = () => {
    const filter = getFilterParams(filterParams, columns);
    dispatch(
      loadData({
        ...paginationParams,
        ...filter,
        ...sortParams,
        ...searchParams,
      })
    );
  };

  const handleDelete = (id) => {
    onOpenDeleteDialog(() => onDelete([id], false));
  };

  const handleGroupDelete = () => {
    const idArray = Object.values(checkedEntries).flat();
    onOpenDeleteDialog(() => onDelete(idArray, isAllPagesChecked), idArray.length === 1 ? "этот объект" : "эти объекты");
  };

  const renderHandleDelete = () => {
    if (onDelete) {
      return handleDelete;
    }
    return null;
  };

  // Переключение режима просмотра
  const toggleViewMode = (value) => {
    setViewMode(value);
  };

  // Окно фильтрации
  const onOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const onCloseFilter = () => {
    setOpenFilter(null);
  };

  // Настройки таблицы
  const openSettingsTable = () => {
    setVisibleSettingsTable(!visibleSettingTable);
  };

  const onCloseVisibleSettingTable = () => {
    setCheckedColumns(initialCheckedColumns);
    setExpandedTableRows(initialExpandedTableRows);
    setVisibleSettingsTable(false);
  };

  const onClickSettingsTable = (columnKey) => {
    if (checkedColumns.includes(columnKey)) {
      const newSettingColumns = checkedColumns.filter((el) => el !== columnKey);
      setCheckedColumns(newSettingColumns);
    } else {
      setCheckedColumns([...checkedColumns, columnKey]);
    }
  };

  const onClickExpandedTableRows = () => {
    setExpandedTableRows((prevState) => !prevState);
  };

  const onSaveSettingsTable = () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEY_VISIBLE_COLUMNS,
      JSON.stringify({
        ...allColumnsVisible,
        [routeId]: checkedColumns,
      })
    );
    localStorage.setItem(
      LOCAL_STORAGE_KEY_EXPANDED_TABLE_ROWS,
      JSON.stringify({
        ...allExpandedTableRows,
        [routeId]: expandedTableRows,
      })
    );
    setVisibleSettingsTable(false);
  };
  const getStyleContainer = () => {
    const withChips = Object.keys(filterParams).length !== 0;
    if (withChips) {
      if (getCustomStyleContainer && getCustomStyleContainer.withChips) {
        return getCustomStyleContainer.withChips;
      }
      return {
        maxHeight: `calc(100vh - 285px)`,
      };
    }

    if (currentUser.inImpersonate) {
      return {
        maxHeight: `calc(100vh - 305px)`,
      };
    }

    if (getCustomStyleContainer && getCustomStyleContainer.default) {
      return {
        ...getCustomStyleContainer.default,
      };
    }
  };
  const getColumns = () => {
    const localStorageColumns = allColumnsVisible?.[routeId];
    if (localStorageColumns) {
      return columns.filter((column) => localStorageColumns?.includes(column.id));
    }
    return columns;
  };

  const getFields = () => {
    if (stickyFilterFields) {
      return [...stickyFilterFields, ...columns];
    }
    return columns;
  };

  const renderContent = () => {
    if (isGroup) {
      return (
        <CollapseList
          url={url}
          total={group.total}
          columns={getColumns()}
          data={group.entries}
          fieldName={groupParams.fieldName}
          loadData={loadGroupData}
          loadEntryData={loadGroupEntryData}
          onView={onView}
          onEdit={onEdit}
          onDelete={renderHandleDelete()}
          loading={group.loading}
          readOnly={readOnly}
          accordionDetails="server-side-table"
          withActions={false}
          withActionsTable={false}
          isGroup
          reducerKey={reducerKey}
          group={group}
          routeId={routeId}
          getCustomRowSx={getCustomRowSx}
        />
      );
    }
    if (viewMode === "list") {
      return (
        <CollapseList
          total={data.total}
          columns={getColumns()}
          data={data.entries}
          loadData={loadData}
          onView={onView}
          onEdit={onEdit}
          onDelete={renderHandleDelete()}
          loading={data.loading}
          readOnly={readOnly}
          extraActions={extraActions}
          isCheckBoxMode={isCheckBoxMode}
          reducerKey={reducerKey}
          styleListContainer={getStyleContainer()}
          getCustomRowSx={getCustomRowSx}
        />
      );
    }
    if (withSortable) {
      return (
        <ServerSideSortable
          total={data.total}
          columns={getColumns()}
          data={data.entries}
          loadData={loadData}
          onView={onView}
          onEdit={onEdit}
          onDelete={renderHandleDelete()}
          loading={data.loading}
          readOnly={readOnly}
          styleTableContainer={getStyleContainer()}
          withToolbar={withToolbar}
          withCheckboxes={withCheckboxes}
          withRadioButtons={withRadioButtons}
          onRadioButtonClick={onRadioButtonClick}
          activeRadioButton={activeRadioButton}
          extraActions={extraActions}
          onAllCheckedOpen={handleAllCheckedOpen}
          isAllPagesChecked={isAllPagesChecked}
          reducerKey={reducerKey}
          withShowMoreText={withShowMoreText}
          customActions={customActions}
          moveAction={moveAction}
          withPagination={withPagination}
          initialExpandedTableRows={initialExpandedTableRows}
          routeId={routeId}
          selectAction={selectAction}
          activeRow={activeRow}
          getCustomRowSx={getCustomRowSx}
        />
      );
    }

    if (CustomTable) {
      return (
        <CustomTable
          total={data.total}
          columns={getColumns()}
          data={data.entries}
          loadData={loadData}
          loading={data.loading}
          reducerKey={reducerKey}
          routeId={routeId}
          getCustomRowSx={getCustomRowSx}
        />
      );
    }

    return (
      <ServerSideTable
        total={data.total}
        columns={getColumns()}
        data={data.entries}
        loadData={loadData}
        onView={onView}
        onEdit={onEdit}
        onDelete={renderHandleDelete()}
        loading={data.loading}
        readOnly={readOnly}
        styleTableContainer={getStyleContainer()}
        withToolbar={withToolbar}
        withCheckboxes={withCheckboxes}
        withRadioButtons={withRadioButtons}
        onRadioButtonClick={onRadioButtonClick}
        activeRadioButton={activeRadioButton}
        extraActions={extraActions}
        onAllCheckedOpen={handleAllCheckedOpen}
        isAllPagesChecked={isAllPagesChecked}
        reducerKey={reducerKey}
        withShowMoreText={withShowMoreText}
        customActions={customActions}
        withPagination={withPagination}
        withSortableTableCell={withSortableTableCell}
        routeId={routeId}
        withActions={withActions}
        initialExpandedTableRows={initialExpandedTableRows}
        selectAction={selectAction}
        activeRow={activeRow}
        disableChecked={disableChecked}
        getCustomRowSx={getCustomRowSx}
        rowSpanOptions={rowSpanOptions}
      />
    );
  };

  return (
    <>
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        {LeftContent ? <LeftContent /> : null}
        <Box component="div" sx={{ display: "flex", alignItems: "center" }}>
          {withGoBack ? (
            <IconButton
              name="arrowBack"
              title="Вернуться назад"
              color="secondary"
              onClick={() => {
                history.goBack();
              }}
            />
          ) : null}

          {withTitle ? (
            <Box component="span" sx={{ fontWeight: 700, mr: "15px" }}>
              {`${title} (${data.total ?? 0})`}
            </Box>
          ) : null}
          {withHelpInfo ? (
            <Icon name="questionHelp" fontSize="small" color="secondary" title={"Перевозчик: АТУ ММК"} sx={{ mr: "15px" }} />
          ) : null}

          {withSearch ? (
            <Search loadData={loadData} disabled={isGroup} reducerKey={reducerKey} visibleButton={visibleButton} customSx={customSx} />
          ) : null}
        </Box>
        <Stack
          direction="row"
          sx={{
            height: "54px",
            padding: "6px",
            borderRadius: "7px",
            bgcolor: (theme) => (theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#333333"),
          }}
        >
          {withToggleViewMode ? <ToggleViewMode value={viewMode} toggleViewMode={toggleViewMode} disabled={isGroup} /> : null}
          {!readOnly && onAdd && (
            <IconButton name="add" title="Создать" color="secondary" size="small" onClick={onAdd} disabled={isGroup} />
          )}
          {!readOnly && onDelete && (
            <IconButton
              name="delete"
              title="Удалить"
              color="secondary"
              size="small"
              onClick={handleGroupDelete}
              disabled={!isSomeoneChecked}
            />
          )}
          {!readOnly && onDelete && viewMode === "list" && (
            <IconButton
              name="checkCircle"
              title="Выбрать"
              color={isCheckBoxMode ? "default" : "secondary"}
              size="small"
              onClick={handleSetCheckBoxMode}
              disabled={isGroup}
            />
          )}

          {withFilter ? (
            <Badge
              badgeContent={Object.keys(filterParams).length}
              color="secondary"
              sx={{
                "& .MuiBadge-badge": {
                  right: 10,
                  top: 8,
                },
              }}
            >
              <IconButton
                name="filter"
                title="Фильтрация"
                size="small"
                sx={{
                  color: (theme) => (Object.keys(filterParams).length ? DARK_MAIN_COLOR : theme.palette.secondary.main),
                }}
                onClick={onOpenFilter}
                disabled={isGroup}
              />
              <FilterDrawer
                open={openFilter}
                onClose={onCloseFilter}
                fields={getFields()}
                loadData={loadData}
                withCheckboxes={withCheckboxes}
                withRadioButtons={withRadioButtons}
                onRadioButtonClick={onRadioButtonClick}
                additionalValuesFilter={additionalValuesFilter}
                reducerKey={reducerKey}
                routeId={routeId}
                title={title}
              />
            </Badge>
          ) : null}
          {withRefresh ? <IconButton name="refresh" title="Обновить" color="secondary" size="small" onClick={refreshData} /> : null}
          {withExport && <IconButton name="export" title="Экспорт" color="secondary" size="small" onClick={onOpenExportDownload} />}
          {withGroup ? (
            <GroupPopover
              url={url}
              columns={getColumns()}
              loadData={loadData}
              isGroup={isGroup}
              setIsGroup={setIsGroup}
              reducerKey={reducerKey}
            />
          ) : null}
          {withSettingsTable ? (
            <>
              <IconButton name="settingsTable" title="Настройки таблицы" color="secondary" size="small" onClick={openSettingsTable} />
              <SettingsTable
                open={visibleSettingTable}
                columns={columns}
                checkedColumns={checkedColumns}
                expandedTableRows={expandedTableRows}
                onClick={onClickSettingsTable}
                onClose={onCloseVisibleSettingTable}
                onSave={onSaveSettingsTable}
                onClickExpandedTableRows={onClickExpandedTableRows}
              />
            </>
          ) : null}
          {withIntegration && (
            <IconButton
              name="schedule"
              title="Интеграция"
              color={"secondary"}
              size="small"
              onClick={onOpenIntegrationModal}
              disabled={isGroup}
            />
          )}
        </Stack>
      </Box>
      {onGetToolbar ? (
        <Box component="div" sx={{ mb: 1, ...sxOnGetToolbar }}>
          {onGetToolbar({ isSomeoneChecked })}
        </Box>
      ) : null}
      <CustomChips availableChips={filterParams} fields={getFields()} handleDeleteChip={handleDeleteChip} />
      {renderContent()}
    </>
  );
};

CatalogContent.defaultProps = {
  title: "",
  activeRadioButton: null,
  columns: [],
  readOnly: false,
  withSearch: true,
  withFilter: true,
  withGroup: true,
  withCheckboxes: true,
  withRadioButtons: false,
  withToggleViewMode: true,
  withSettingsTable: true,
  withGoBack: false,
  withHelpInfo: false,
  withTitle: true,
  withPagination: true,
  withRefresh: false,
  reset: true,
  LeftContent: null,
  disableChecked: false,
  onRadioButtonClick: () => {},
  getCustomRowSx: () => ({}),
};

export default withAlert(withDeleteDialog(withExportDownload(withAllCheckedDialog(CatalogContent))));
