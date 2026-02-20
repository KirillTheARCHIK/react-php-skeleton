import React, { useCallback } from "react";
import { useDispatch } from "react-redux";

import { modalSlice } from "store/utility/modalSlice";

import Modal from "components/Modal";
import withAlert from "components/HOC/withAlert";
import GeneralSettingsForm from "./GeneralSettingsForm";
import type { UserDTO } from "features/auth/user.dto";
import type { AlertColor } from "@mui/material/Alert";

export const MODAL_NAME = "general-settings-modal";

const GeneralSettings = ({
  user,
  modalName = MODAL_NAME,
  onOpenAlert,
}: {
  user?: UserDTO;
  modalName: string;
  onOpenAlert: (severity: AlertColor, message: string | undefined) => void;
}) => {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => dispatch(modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);
  return (
    <Modal modalName={modalName} title={"Настройки пользователя"}>
      <GeneralSettingsForm user={user} onSuccess={handleClose} onOpenAlert={onOpenAlert} />
    </Modal>
  );
};

export default withAlert(GeneralSettings);
