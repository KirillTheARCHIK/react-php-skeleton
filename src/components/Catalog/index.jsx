import React, { useEffect } from "react";
import { useDispatch, useSelector } from "store/hooks";

import { setAllCheckedCheckboxes } from "actions/checkboxes";
import { initParams, resetParams } from "actions/requestParams";

import { MODAL_STATE } from "components/Modal";
import IntegrationModal from "components/Modals/Integration/IntegrationModal";

import CatalogContent from "./CatalogContent";
import CatalogFormModal from "./CatalogFormModal";

import { getInitialValuesStatePage } from "helpers/requestParams";
import { modalSlice } from "store/utility/modalSlice";

const Catalog = ({
  routeId,
  routeName,
  reducerKey,
  columns,
  fields,
  url,
  loadData,
  createAction,
  updateAction,
  moveAction,
  deleteAction,
  loadFetchDataById,
  renderInitialValuesForm,
  renderSaveValuesForm,
  readOnly,
  withExport,
  withIntegration,
  getIntegrationInfo,
  setIntegrationSchedule,
  changeIntegration,
  extraActions,
  withSortable,
  getSubmitErrorForm,
  withSettingsTable,
  withToggleViewMode,
  withGroup,
  withCheckboxes,
  selectAction,
  activeRow,
}) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state[reducerKey]);
  const requestParams = useSelector((state) => state.requestParams[reducerKey]);

  useEffect(() => {
    dispatch(loadData(getInitialValuesStatePage()));
  }, [dispatch, loadData]);

  useEffect(() => {
    dispatch(initParams(reducerKey));
    return () => dispatch(resetParams());
  }, [dispatch, reducerKey]);

  const onAdd = () => {
    dispatch(modalSlice.actions.openModal({ modalName: routeId, modalState: MODAL_STATE.OPENED }));
    dispatch(setAllCheckedCheckboxes(false));
  };

  const onView = (id) => {
    dispatch(modalSlice.actions.openModal({ modalName: routeId, modalState: MODAL_STATE.IS_VIEW, data: id }));
  };
  const onEdit = (id) => {
    dispatch(modalSlice.actions.openModal({ modalName: routeId, modalState: MODAL_STATE.IS_EDIT, data: id }));
  };
  const onDelete = (id, isAll) => {
    dispatch(deleteAction(id, isAll));
    dispatch(setAllCheckedCheckboxes(false));
  };

  const onOpenIntegrationModal = () => {
    dispatch(modalSlice.actions.openModal({ modalName: "integrationModal", modalState: MODAL_STATE.OPENED }));
  };

  if (requestParams)
    return (
      <>
        <CatalogContent
          routeId={routeId}
          columns={columns}
          data={data}
          onAdd={createAction && onAdd}
          onView={onView}
          onEdit={updateAction && onEdit}
          onDelete={deleteAction && onDelete}
          moveAction={moveAction}
          onOpenIntegrationModal={onOpenIntegrationModal}
          title={routeName}
          loadData={loadData}
          url={url}
          withExport={withExport}
          withIntegration={withIntegration}
          readOnly={readOnly}
          reducerKey={reducerKey}
          extraActions={extraActions}
          withSortable={withSortable}
          withSettingsTable={withSettingsTable}
          withToggleViewMode={withToggleViewMode}
          withGroup={withGroup}
          withCheckboxes={withCheckboxes}
          selectAction={selectAction}
          activeRow={activeRow}
        />
        <CatalogFormModal
          modalName={routeId}
          fields={fields.length ? fields : columns}
          createAction={createAction}
          updateAction={updateAction}
          loadFetchDataById={loadFetchDataById}
          renderInitialValuesForm={renderInitialValuesForm}
          renderSaveValuesForm={renderSaveValuesForm}
          onEdit={onEdit}
          readOnly={readOnly}
          getSubmitErrorForm={getSubmitErrorForm}
        />
        {withIntegration && (
          <IntegrationModal
            modalName={"integrationModal"}
            changeIntegration={changeIntegration}
            getIntegrationInfo={getIntegrationInfo}
            setIntegrationSchedule={setIntegrationSchedule}
            reducerKey={reducerKey}
          />
        )}
      </>
    );
  return null;
};

Catalog.defaultProps = {
  columns: [],
  fields: [],
  withExport: true,
  withIntegration: false,
  withToggleViewMode: true,
  withGroup: true,
  withCheckboxes: true,
};

export default Catalog;
