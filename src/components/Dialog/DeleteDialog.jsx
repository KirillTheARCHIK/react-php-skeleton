import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

const DeleteDialog = ({
  handleCloseOk,
  handleClose,
  name,
  isOpen,
  description,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{`Вы действительно хотите удалить ${name}? ${description}`}</DialogTitle>

      <DialogActions>
        <Button onClick={handleCloseOk} color="primary">
          Да
        </Button>

        <Button onClick={handleClose} color="primary" autoFocus>
          Нет
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
