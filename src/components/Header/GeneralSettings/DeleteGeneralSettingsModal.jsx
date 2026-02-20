import React, { useCallback } from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Box } from "@mui/material";

import { modalSlice } from "store/utility/modalSlice";
import { deleteUserSetting } from "actions/catalogs/userSettings";

import Modal from "components/Modal";
import withAlert from "components/HOC/withAlert";
import StackButton from "components/StackButton";
import Button from "components/Button";
import { MODAL_NAME } from "./GeneralSettingsModal";

import { showError } from "helpers/error";

const DeleteGeneralSettingsModal = ({ modalName, onOpenAlert }) => {
  const dispatch = useDispatch();

  const handleClose = useCallback(() => dispatch(modalSlice.actions.closeModal(modalName)), [dispatch, modalName]);
  const handleCloseGeneralSettingsModal = useCallback(() => dispatch(modalSlice.actions.closeModal(MODAL_NAME)), [dispatch, MODAL_NAME]);

  const id = useSelector((state) => state.modals.data);

  const onSave = () => {
    return new Promise((resolve) => {
      dispatch(
        deleteUserSetting(id, {
          resolve: () => {
            resolve();
            handleClose();
            handleCloseGeneralSettingsModal();
          },
          reject: ({ error }) => {
            resolve();
            showError(onOpenAlert, error);
          },
        })
      );
    });
  };

  return (
    <Modal modalName={modalName} title={`Удаление записи № ${id}`} customSX={{ width: 850 }}>
      <Box sx={{ padding: "0  42px" }}>
        <Box
          component="div"
          sx={{
            color: "primary.main",
            marginBottom: "15px",
            fontWeight: "700",
          }}
        >
          Вы уверены что хотите удалить запись?
        </Box>
        <Box component="div">При удалении данной записи кол-во отображаемых строк в таблице будет 10</Box>
      </Box>

      <StackButton>
        <Button variant="contained" size="small" color="primary" onClick={onSave} sx={{ width: "auto" }}>
          Применить
        </Button>
        <Button variant="outlined" size="small" color="inherit" onClick={handleClose} sx={{ width: "auto" }}>
          Отмена
        </Button>
      </StackButton>
    </Modal>
  );
};

DeleteGeneralSettingsModal.defaultProps = {
  modalName: "delete-general-settings-modal",
};

export default withAlert(DeleteGeneralSettingsModal);
