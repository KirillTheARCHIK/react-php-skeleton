import {
  OPEN_MODAL,
  CLOSE_MODAL,
  CLOSE_ALL_MODALS,
} from "actions/modals/types";
import { MODAL_STATE } from "components/Modal";

const initialState = { open: false };

const modals = (state = initialState, { type, payload }) => {
  switch (type) {
    case OPEN_MODAL: {
      const { modalName, modalState } = payload;
      return {
        ...state,
        [modalName]: modalState || MODAL_STATE.OPENED,
        open: true,
        data: payload.data,
      };
    }
    case CLOSE_MODAL: {
      const { modalName } = payload;
      return {
        ...state,
        [modalName]: MODAL_STATE.CLOSED,
        open: false,
        data: null,
      };
    }
    case CLOSE_ALL_MODALS: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default modals;
