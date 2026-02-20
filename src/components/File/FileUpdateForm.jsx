import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Box } from "@mui/material";

import Input from "components/FormFields/Input";
import FormHelperText from "components/FormHelperText";
import ButtonsBlock from "widgets/catalogs/accidents/ButtonsBlock";

import { showError } from "helpers/error";
import { withCheckCommonErrors } from "helpers/form";

const FileUpdateForm = ({
  fileData,
  updateAction,
  setIsOpen,
  setFileData,
  onOpenAlert,
}) => {
  const dispatch = useDispatch();

  const validate = useCallback((value) => {
    if (!value) return "Введите значение";
  }, []);

  const onSubmit = useCallback(
    (values) => {
      return new Promise((resolve) => {
        dispatch(
          updateAction(fileData.id, values, {
            resolve: () => {
              resolve();
              setFileData(null);
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
    [dispatch, fileData.id, updateAction, setFileData, setIsOpen, onOpenAlert]
  );

  return (
    <Form
      initialValues={{ id: fileData.id, originalName: fileData.originalName }}
      onSubmit={(values) => withCheckCommonErrors(values, onSubmit)}
    >
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
            <Box sx={{ mb: "25px" }}>Редактирование файла</Box>
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
            <ButtonsBlock
              pristine={pristine}
              valid={valid || dirtySinceLastSubmit}
              submitting={submitting}
              onCancel={() => {
                setIsOpen(false);
                setFileData(null);
              }}
              onReset={(...args) => form.reset(args)}
            />

            {formHasOnlyCommonErrors &&
              submitError &&
              !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
          </form>
        );
      }}
    </Form>
  );
};

export default FileUpdateForm;
