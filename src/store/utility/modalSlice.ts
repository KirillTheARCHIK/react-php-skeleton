import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { MODAL_STATE } from "components/Modal";

const SLICE_NAME = "modal";

interface ModalState {
  open: boolean;
  [modalName: string]: string | boolean;
  data?: any | undefined;
}

const initialState: ModalState = { open: false, data: undefined };

export const modalSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ modalName: string; modalState: string | boolean; data?: any }>) => {
      state[action.payload.modalName] = action.payload.modalState ?? MODAL_STATE.OPENED;
      state.open = true;
      state.data = action.payload.data;
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modalName = action.payload;
      state[modalName] = MODAL_STATE.CLOSED;
      state.open = false;
      state.data = null;
    },
    closeAllModals: (state) => {
      state = initialState;
    },
  },
});
