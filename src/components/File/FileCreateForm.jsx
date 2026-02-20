import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Box } from "@mui/material";

import Input from "components/FormFields/Input";
import FormHelperText from "components/FormHelperText";
import InputFile from "components/FormFields/InputFile";
import ButtonsBlock from "widgets/catalogs/accidents/ButtonsBlock";

import { showError } from "helpers/error";
import { withCheckCommonErrors } from "helpers/form";

const FileCreateForm = ({
  entity,
  dataId,
  createAction,
  setIsOpen,
  onOpenAlert,
}) => {
  const dispatch = useDispatch();
  const [fileFieldKey, setFileFieldKey] = useState(Date.now());

  const validate = useCallback((value) => {
    if (!value) return "Введите значение";
  }, []);

  const validateInput = useCallback((value) => {
    if (!value || value?.length === 0) return "Прикрепите файл";
  }, []);

  const onSubmit = useCallback(
    (values) => {
      const data = new FormData();
      data.set("originalName", values.originalName);
      data.set("file", values.file[0]);
      return new Promise((resolve) => {
        dispatch(
          createAction(entity, dataId, data, {
            resolve: () => {
              resolve();
              setIsOpen(false);
            },
            reject: ({ error }) => {
              resolve({ [FORM_ERROR]: error });
              showError(onOpenAlert, error);
            },
          })
        );
      });
    },
    [entity, dataId, dispatch, createAction, setIsOpen, onOpenAlert]
  );

  return (
    <Form onSubmit={(values) => withCheckCommonErrors(values, onSubmit)}>
      {({
        handleSubmit,
        submitting,
        pristine,
        valid,
        form,
        submitError,
        dirtySinceLastSubmit,
        submitErrors = {},
      }) => {
        const { formHasOnlyCommonErrors } = submitErrors;
        return (
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: "25px" }}>Добавление файла</Box>
            <Field name="originalName" validate={validate}>
              {({ input, meta }) => (
                <Input
                  input={input}
                  meta={meta}
                  label="Название файла"
                  variant="outlined"
                  fullWidth
                  autoFocus
                  required
                />
              )}
            </Field>
            <Field key={fileFieldKey} name="file" validate={validateInput}>
              {({ input, meta }) => (
                <InputFile
                  input={{
                    ...input,
                    onChange: (event) => {
                      input.onChange(event.target.files);
                    },
                  }}
                  meta={meta}
                />
              )}
            </Field>

            {formHasOnlyCommonErrors &&
              submitError &&
              !dirtySinceLastSubmit && <FormHelperText error={submitError} />}

            <ButtonsBlock
              pristine={pristine}
              valid={valid || dirtySinceLastSubmit}
              submitting={submitting}
              onCancel={() => setIsOpen(false)}
              onReset={(...args) => {
                form.reset(args);
                setFileFieldKey(Date.now());
              }}
            />
          </form>
        );
      }}
    </Form>
  );
};

export default FileCreateForm;
