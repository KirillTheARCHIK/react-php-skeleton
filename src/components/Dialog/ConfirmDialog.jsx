import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const ConfirmDialog = ({ handleOk, handleClose, isOpen, title }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{title}</DialogTitle>
      <DialogActions>
        <Button onClick={handleOk} color="primary">
          Да
        </Button>
        <Button onClick={handleClose} color="primary" autoFocus>
          Отмена
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
