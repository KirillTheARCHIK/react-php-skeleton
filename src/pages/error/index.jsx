import React from "react";
import "./styles.scss";

import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import Button from "components/Button";

import { highlightValue } from "helpers/format";

import { LIGHT_THEME } from "constants/themes";
import { STATUS_ERROR } from "constants/errors";
import { modalSlice } from "store/utility/modalSlice";

const ErrorPage = ({ resetErrorBoundary }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const theme = useTheme();

  const errorStatus = history?.location?.state?.status;

  React.useEffect(() => {
    if (errorStatus) {
      dispatch(modalSlice.actions.closeAllModals());
    }
  }, [dispatch, errorStatus]);

  return (
    <Box className="error_page">
      <Box className={`error_page-image_${theme.palette.mode === LIGHT_THEME ? "light" : "dark"}`}></Box>
      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          textAlign: "right",
          mr: "260px",
          mt: "132px",
        }}
      >
        <Box component="span" sx={{ fontSize: "36px" }}>
          {highlightValue(errorStatus ? errorStatus : " ")}{" "}
        </Box>
        <Box component="span" sx={{ fontSize: "24px" }}>
          {highlightValue(errorStatus ? STATUS_ERROR[errorStatus] : "К сожалению, возникла ошибка")}
        </Box>
        <Box sx={{ fontSize: "20px", mt: "22px" }}>Попробуйте обновить страницу или посетить её позже</Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: "22px", width: "203px" }}
          onClick={() => {
            history.goBack();
            if (resetErrorBoundary) {
              resetErrorBoundary();
            }
          }}
        >
          Вернуться назад
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
