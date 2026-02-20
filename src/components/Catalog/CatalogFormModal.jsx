import React, { useCallback } from "react";
import { useDispatch, useSelector } from "store/hooks";

import Modal, { MODAL_STATE } from "components/Modal";
import DefaultForm from "components/Form";
import withAlert from "components/HOC/withAlert";
import { getTitleModal } from "helpers/modal";
import { modalSlice } from "store/utility/modalSlice";

const CatalogFormModal = ({
  modalName,
  fields,
  createAction,
  updateAction,
  loadFetchDataById,
  renderInitialValuesForm,
  renderSaveValuesForm,
  onEdit,
  readOnly,
  onOpenAlert,
  getSubmitErrorForm,
}) => {
  const dispatch = useDispatch();

  const isView = useSelector((state) => state.modals[modalName] === MODAL_STATE.IS_VIEW);
  const isEdit = useSelector((state) => state.modals[modalName] === MODAL_STATE.IS_EDIT);
  const id = useSelector((state) => state.modals.data);

  const handleClose = useCallback(() => dispatch(modalSlice.actions.modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);

  return (
    <Modal modalName={modalName} title={getTitleModal(isView, isEdit)}>
      <DefaultForm
        id={id}
        fields={fields}
        onEdit={onEdit}
        isView={isView}
        isEdit={isEdit}
        readOnly={readOnly}
        createAction={createAction}
        updateAction={updateAction}
        loadFetchDataById={loadFetchDataById}
        renderInitialValuesForm={renderInitialValuesForm}
        renderSaveValuesForm={renderSaveValuesForm}
        onSuccess={handleClose}
        onOpenAlert={onOpenAlert}
        getSubmitErrorForm={getSubmitErrorForm}
      />
    </Modal>
  );
};

export default withAlert(CatalogFormModal);
