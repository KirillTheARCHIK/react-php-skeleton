import React from "react";
import { Form, Field } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Box, FormHelperText, InputAdornment, Typography } from "@mui/material";

import Icon from "components/Icon";
import Input from "components/FormFields/Input";
import InputPassword from "components/FormFields/InputPassword";
import Button from "components/Button";
import withAlert from "components/HOC/withAlert";

import { showError } from "helpers/error";
import { LIGHT_THEME } from "constants/themes";
import { login } from "features/auth/redux";
import { useDispatch } from "store/hooks";

const validate = (values) => {
  const errors: Record<string, string> = {};
  if (!values.username) {
    errors.username = "Введите логин";
  }
  if (!values.password) {
    errors.password = "Введите пароль";
  }
  return errors;
};

const LoginForm = ({ onOpenAlert }) => {
  const dispatch = useDispatch();

  const onSubmit = (values) => {
    return new Promise((resolve) => {
      return dispatch(
        login({
          arg: values,
          onResolve: () => {
            resolve({});
          },
          onReject: ({ status, error }) => {
            switch (status) {
              case 401:
                resolve({ [FORM_ERROR]: "Вы ввели неверные учетные данные" });
                showError(onOpenAlert, error);
                break;
              case 403:
                resolve({
                  [FORM_ERROR]: "Доступ в личный кабинет ограничен. Пожалуйста обратитесь к администратору",
                });
                showError(onOpenAlert, error);
                break;
              default:
                resolve({ [FORM_ERROR]: "Ошибка" });
                showError(onOpenAlert, error);
                break;
            }
          },
        })
      );
    });
  };

  return (
    <Box
      component="div"
      className="login_form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: 480,
        padding: 2,
        background: (theme) => (theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#333333"),
        borderRadius: "15px",
      }}
    >
      <Typography
        sx={{
          fontSize: 32,
          fontWeight: 700,
          mb: "20px",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Авторизация
      </Typography>
      <Form onSubmit={onSubmit} validate={validate}>
        {({ handleSubmit, submitting, submitError }) => {
          return (
            <form onSubmit={handleSubmit}>
              {submitError && (
                <FormHelperText error sx={{ textAlign: "center", mb: "20px" }}>
                  {submitError}
                </FormHelperText>
              )}
              <Field name="username">
                {({ input }) => (
                  <Input
                    input={input}
                    // meta={meta}
                    label="Имя пользователя"
                    placeholder="Имя пользователя"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Icon name="loginPerson" fontSize="small" sx={{ fill: "none" }} />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{ required: false }}
                    fullWidth
                    required
                  />
                )}
              </Field>
              <Field name="password">
                {({ input, meta }) => (
                  <InputPassword
                    input={input}
                    meta={meta}
                    label="Пароль"
                    placeholder="Пароль"
                    variant="outlined"
                    InputLabelProps={{ required: false }}
                    fullWidth
                    required
                  />
                )}
              </Field>
              <Button loading={submitting} variant="contained" type="submit" fullWidth sx={{ height: 55 }}>
                Вход
              </Button>
            </form>
          );
        }}
      </Form>
    </Box>
  );
};

export default withAlert(LoginForm);
