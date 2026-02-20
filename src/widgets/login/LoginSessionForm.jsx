import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";

import { Box } from "@mui/material";

import { loginSession } from "actions/login";

import { getUser } from "services/login";

import StackButton from "components/StackButton";
import Button from "components/Button";
import FormHelperText from "components/FormHelperText";
import withAlert from "components/HOC/withAlert";
import Modal, { MODAL_STATE } from "components/Modal";
import InputPassword from "components/FormFields/InputPassword";

import { getDisplayName, highlightValue } from "helpers/format";
import { showError } from "helpers/error";
import { required } from "helpers/formValidators";
import { modalSlice } from "store/utility/modalSlice";

export const MODAL_NAME = "login-modals";

const LoginSessionForm = ({ onOpenAlert }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.currentUser);

  // Проверка сессии
  const checkSession = async () => {
    try {
      const response = await getUser();

      if (response.status === 401) {
        dispatch(modalSlice.actions.openModal({ modalName: MODAL_NAME, modalState: MODAL_STATE.OPENED }));
      }
    } catch {}
  };

  // Запуск периодического опроса
  useEffect(() => {
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClose = useCallback(() => dispatch(modalSlice.actions.closeModal(MODAL_NAME)), [dispatch]);

  const onSubmit = ({ password }) => {
    const newValues = {
      username: currentUser.login,
      password: password,
    };

    return new Promise((resolve) => {
      return dispatch(
        loginSession(newValues, {
          resolve: () => {
            resolve();
            handleClose();
          },
          reject: ({ error }) => {
            resolve({ [FORM_ERROR]: "Вы ввели неверные учетные данные" });
            showError(onOpenAlert, error);
          },
        })
      );
    });
  };

  const onEndSession = () => {
    window.location.reload();
  };

  return (
    <Modal modalName={MODAL_NAME} title={"Время действия сессии истекло"} onClose={onEndSession}>
      <Form onSubmit={onSubmit}>
        {({ handleSubmit, pristine, dirtySinceLastSubmit, valid, submitting, submitError }) => {
          const validSaveBtn = valid || dirtySinceLastSubmit;
          return (
            <form onSubmit={handleSubmit}>
              <Box component="div" sx={{ mb: 2 }}>
                Вы вошли в систему как: {highlightValue(getDisplayName(currentUser))}. Введите пароль, чтобы продолжить.
              </Box>

              <Field name="password" validate={required}>
                {({ input, meta }) => (
                  <InputPassword
                    input={input}
                    meta={meta}
                    label="Пароль"
                    placeholder="Пароль"
                    variant="outlined"
                    fullWidth
                    required
                    sx={{ mb: 0 }}
                  />
                )}
              </Field>
              <StackButton>
                <Button
                  disabled={pristine || !validSaveBtn}
                  loading={submitting}
                  variant="contained"
                  type="submit"
                  color="primary"
                  size="small"
                >
                  Продолжить
                </Button>
                <Button variant="outlined" size="small" color="inherit" onClick={onEndSession} sx={{ width: "auto" }}>
                  Завершить сессию
                </Button>
              </StackButton>
              {submitError && !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
            </form>
          );
        }}
      </Form>
    </Modal>
  );
};

export default withAlert(LoginSessionForm);
