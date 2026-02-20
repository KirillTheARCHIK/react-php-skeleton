import React, { useCallback } from "react";
import { useDispatch, useSelector } from "store/hooks";

import { modalSlice } from "store/utility/modalSlice";

import Modal, { MODAL_STATE } from "components/Modal";
import withAlert from "components/HOC/withAlert";
import UserForm from "./UserForm";

import { getTitleModal } from "helpers/modal";

export const MODAL_NAME = "user-modal";

const UserFormModal = ({ modalName = MODAL_NAME, onEdit, onOpenAlert, organizationId, initialValuesUserForm }) => {
  const dispatch = useDispatch();

  const isView = useSelector((state) => state.modals[modalName] === MODAL_STATE.IS_VIEW);
  const isEdit = useSelector((state) => state.modals[modalName] === MODAL_STATE.IS_EDIT);

  const data = useSelector((state) => state.modals.data);

  const handleClose = useCallback(() => dispatch(modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);

  return (
    <Modal modalName={modalName} title={getTitleModal(isView, isEdit)}>
      <UserForm
        id={data?.id}
        onEdit={onEdit}
        isView={isView}
        isEdit={isEdit}
        onSuccess={handleClose}
        onOpenAlert={onOpenAlert}
        organizationId={organizationId}
        initialValuesUserForm={initialValuesUserForm}
      />
    </Modal>
  );
};

export default withAlert(UserFormModal);
