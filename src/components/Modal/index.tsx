import React, { useCallback } from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Box, Modal as MuiModal, IconButton } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

import { modalSlice } from "store/utility/modalSlice";

export const MODAL_STATE = {
  IS_VIEW: "isView",
  IS_EDIT: "isEdit",
  OPENED: true,
  CLOSED: false,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const Modal = ({ modalName, title, children, onClose = () => {}, customSX = {} }: { modalName: string; [prop: string]: any }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.modals[modalName]);

  const handleClose = useCallback(() => {
    onClose();
    return dispatch(modalSlice.actions.closeModal(modalName));
  }, [dispatch, modalName, onClose]);

  return (
    <MuiModal
      open={Boolean(open)}
      onClose={handleClose}
      slotProps={{
        backdrop: {
          style: {
            opacity: 0,
          },
        },
      }}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <Box sx={{ ...style, ...customSX }}>
        <Box
          component="div"
          position="sticky"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Box
            component="div"
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              fontSize: 18,
              fontWeight: 700,
            }}
            color="primary"
          >
            {title}
          </Box>
          <Box component="span">
            <IconButton onClick={handleClose}>
              <HighlightOffIcon />
            </IconButton>
          </Box>
        </Box>
        <Box component="div">{children}</Box>
      </Box>
    </MuiModal>
  );
};

export default Modal;
