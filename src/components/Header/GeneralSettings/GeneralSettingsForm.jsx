import React from "react";
import { useDispatch } from "react-redux";
import { FORM_ERROR } from "final-form";
import { Field, Form } from "react-final-form";

import { createUserSetting, updateUserSetting } from "actions/catalogs/userSettings";

import { URL } from "services/catalogs/userSettings";
import Button from "components/Button";
import StackButton from "components/StackButton";
import LoadingBlock from "components/LoadingBlock";
import { MODAL_STATE } from "components/Modal";
import DeleteElemenModal from "./DeleteGeneralSettingsModal";

import { fetchRequest } from "helpers/fetchRequest";
import { showError } from "helpers/error";
import { required } from "helpers/formValidators";
import Select from "components/FormFields/Select";
import Input from "components/FormFields/Input";
import InputFile from "components/FormFields/InputFile";
import { Avatar, Stack } from "@mui/material";
import { modalSlice } from "store/utility/modalSlice";

const GeneralSettingsForm = ({ user, onSuccess, onOpenAlert }) => {
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = React.useState({
    value: numberRowsTableOptions[0],
    name: "Иван",
    patronymic: "Иванов",
    lastName: "Иванович",
    role: "Администратор, оператор",
  });
  const [loading, setLoading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  React.useEffect(() => {
    if (user.id) fetchInitialValues();
  }, []);

  const fetchInitialValues = async () => {
    try {
      setLoading(true);

      const response = await fetchRequest(
        `${URL}?` +
          new URLSearchParams({
            "where[name]": "numberRowsTable",
            "where[user]": user?.id,
          })
      );
      if (response.error) throw response;

      if (response.entries.length !== 0) {
        const numberRowsTable = response.entries[0];
        setInitialValues({
          ...numberRowsTable,
          value: { label: numberRowsTable.value, id: numberRowsTable.value },
        });
        setIsEdit(true);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (values) => {
    const newValues = {
      value: values.value.id,
      name: "numberRowsTable",
    };
    onSuccess();
    // if (isEdit) {
    //   return new Promise((resolve) => {
    //     dispatch(
    //       updateUserSetting(initialValues.id, newValues, {
    //         resolve: () => {
    //           resolve();
    //           onSuccess();
    //         },
    //         reject: ({ error }) => {
    //           resolve({ [FORM_ERROR]: error });
    //           showError(onOpenAlert, error);
    //         },
    //       })
    //     );
    //   });
    // }
    // return new Promise((resolve) => {
    //   dispatch(
    //     createUserSetting(newValues, {
    //       resolve: () => {
    //         resolve();
    //         onSuccess();
    //       },
    //       reject: ({ error }) => {
    //         resolve({ [FORM_ERROR]: error });
    //         showError(onOpenAlert, error);
    //       },
    //     })
    //   );
    // });
  };

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit, submitting, pristine, valid, dirtySinceLastSubmit }) => {
        const validSaveBtn = valid || dirtySinceLastSubmit;
        return (
          <form onSubmit={handleSubmit}>
            <LoadingBlock isLoading={loading}>
              <Stack sx={{ display: "flex", alignItems: "center" }}>
                {" "}
                <Avatar sx={{ width: 80, height: 80, marginBottom: "10px" }} />{" "}
                <Field key={2} name="file">
                  {({ input, meta }) => (
                    <InputFile
                      input={{
                        ...input,
                        onChange: (event) => {
                          input.onChange(event.target.files);
                        },
                      }}
                      meta={meta}
                      label={"Изменить фотографию"}
                      sx={{ width: "200px" }}
                    />
                  )}
                </Field>
              </Stack>
              <Field name="patronymic" validate={required}>
                {({ input, meta }) => {
                  return <Input input={input} meta={meta} fullWidth size="small" label={"Фамилия"} />;
                }}
              </Field>
              <Field name="name" validate={required}>
                {({ input, meta }) => {
                  return <Input input={input} meta={meta} fullWidth size="small" label={"Имя"} />;
                }}
              </Field>
              <Field name="lastName" validate={required}>
                {({ input, meta }) => {
                  return <Input input={input} meta={meta} fullWidth size="small" label={"Отчество"} options={numberRowsTableOptions} />;
                }}
              </Field>
              <Field name="role" validate={required}>
                {({ input, meta }) => {
                  return <Input input={input} meta={meta} fullWidth size="small" label={"Роли"} options={numberRowsTableOptions} />;
                }}
              </Field>
              <Field name="value" validate={required}>
                {({ input, meta }) => {
                  return (
                    <Select
                      input={input}
                      meta={meta}
                      fullWidth
                      size="small"
                      label={"Кол-во строк в таблице"}
                      options={numberRowsTableOptions}
                    />
                  );
                }}
              </Field>
            </LoadingBlock>
            <StackButton>
              <Button
                disabled={pristine || !validSaveBtn}
                loading={submitting}
                variant="contained"
                type="submit"
                color="primary"
                size="small"
              >
                Применить
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  dispatch(
                    modalSlice.actions.openModal({
                      modalName: "delete-general-settings-modal",
                      modalState: MODAL_STATE.OPENED,
                      data: initialValues.id,
                    })
                  );
                }}
                color="inherit"
                disabled={!initialValues.id}
              >
                Удалить
              </Button>
            </StackButton>
            <DeleteElemenModal />
          </form>
        );
      }}
    </Form>
  );
};

const numberRowsTableOptions = [
  { label: "10", id: "10" },
  { label: "25", id: "25" },
  { label: "100", id: "100" },
];

export default GeneralSettingsForm;
