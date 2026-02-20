import React from "react";
import { useDispatch } from "react-redux";
import { FORM_ERROR } from "final-form";
import { Field, Form } from "react-final-form";
import { Box } from "@mui/material";

import Input from "components/FormFields/Input";
import Button from "components/Button";
import StackButton from "components/StackButton";
import FormHelperText from "components/FormHelperText";
import LoadingBlock from "components/LoadingBlock";
import AsyncSelect from "components/FormFields/AsyncSelect";
import Select from "components/FormFields/Select";
import InputNumber from "components/FormFields/InputNumber";
import InputPhone from "components/FormFields/InputPhone";
import InputColor from "components/FormFields/InputColor";
import Checkbox from "components/FormFields/Checkbox";
import DatePickerField from "components/DatePickerField";

import { getFieldProps, withCheckCommonErrors } from "helpers/form";
import { showError } from "helpers/error";
import { getColorHex } from "helpers/format";
import { STYLE_CONTENT_FORM } from "constants/styles";

const DefaultForm = ({
  id,
  isView,
  isEdit,
  loadFetchDataById,
  renderInitialValuesForm,
  renderSaveValuesForm,
  createAction,
  updateAction,
  onSuccess,
  onEdit,
  fields,
  readOnly,
  onOpenAlert,
  getSubmitErrorForm,
}) => {
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) fetchInitialValues();
  }, []);

  const fetchInitialValues = async () => {
    try {
      setLoading(true);
      const response = await loadFetchDataById(id);
      if (response.error) throw response;
      if (renderInitialValuesForm) {
        setInitialValues(renderInitialValuesForm(response));
      } else {
        setInitialValues(response);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const checkEditClick = () => {
    onSuccess();
    onEdit(id);
  };

  const onSubmit = (values) => {
    let newValues = values;
    if (getSubmitErrorForm && getSubmitErrorForm(values) !== null) {
      return {
        [FORM_ERROR]: getSubmitErrorForm(values),
      };
    }
    if (renderSaveValuesForm) {
      newValues = renderSaveValuesForm(values);
    }
    if (isEdit) {
      return new Promise((resolve) => {
        dispatch(
          updateAction(newValues, id, {
            resolve: () => {
              resolve();
              onSuccess();
            },
            reject: ({ error }) => {
              resolve({ [FORM_ERROR]: error });
              showError(onOpenAlert, error);
            },
          })
        );
      });
    }
    return new Promise((resolve) => {
      dispatch(
        createAction(newValues, {
          resolve: () => {
            resolve();
            onSuccess();
          },
          reject: ({ error }) => {
            resolve({ [FORM_ERROR]: error });
            showError(onOpenAlert, error);
          },
        })
      );
    });
  };

  const renderButtons = (form, pristine, submitting, validSaveBtn) => {
    if (readOnly) {
      return null;
    }

    if (isView && onEdit) {
      return (
        <Button variant="contained" color="primary" size="small" onClick={checkEditClick}>
          Редактировать
        </Button>
      );
    }

    if (!isView) {
      return (
        <>
          <Button
            disabled={pristine || !validSaveBtn || isView}
            loading={submitting}
            variant="contained"
            type="submit"
            color="primary"
            size="small"
          >
            Применить
          </Button>
          <Button disabled={isView || pristine || submitting} variant="outlined" size="small" onClick={form.reset} color="inherit">
            Сброс
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <Form initialValues={initialValues} onSubmit={(values) => withCheckCommonErrors(values, onSubmit)}>
      {({ handleSubmit, submitting, pristine, valid, form, submitError, dirtySinceLastSubmit, submitErrors = {} }) => {
        const validSaveBtn = valid || dirtySinceLastSubmit;
        const { formHasOnlyCommonErrors } = submitErrors;
        return (
          <form onSubmit={handleSubmit}>
            <LoadingBlock isLoading={loading}>
              <Box component="div" sx={STYLE_CONTENT_FORM}>
                {fields.map(({ id, label, field = {} }) => {
                  const fieldProps = getFieldProps(field);
                  switch (field.type) {
                    case "asyncselect":
                      return (
                        <Field key={id} name={id} {...fieldProps}>
                          {({ input, meta }) => (
                            <AsyncSelect
                              input={input}
                              meta={meta}
                              label={label}
                              loadOptions={field.loadOptions}
                              variant="outlined"
                              fullWidth
                              disabled={isView}
                            />
                          )}
                        </Field>
                      );
                    case "number":
                      return (
                        <Field name={id} key={id} {...fieldProps}>
                          {({ input, meta }) => (
                            <InputNumber
                              input={input}
                              meta={meta}
                              label={label}
                              variant="outlined"
                              disabled={isView}
                              maxLength={field.maxLenght}
                              decimalScale={field.decimalScale}
                              allowNegative={field.allowNegative}
                              fullWidth
                            />
                          )}
                        </Field>
                      );
                    case "date":
                    case "datetime":
                    case "time":
                      return (
                        <DatePickerField key={id} name={id} type={field.type} label={label} fullWidth disabled={isView} {...fieldProps} />
                      );
                    case "select":
                      return (
                        <Field key={id} name={id} {...fieldProps}>
                          {({ input, meta }) => (
                            <Select
                              input={input}
                              meta={meta}
                              label={label}
                              variant="outlined"
                              fullWidth
                              options={field.options}
                              disabled={isView}
                            />
                          )}
                        </Field>
                      );
                    case "tel":
                      return (
                        <Field key={id} name={id} {...fieldProps}>
                          {({ input, meta }) => (
                            <InputPhone input={input} meta={meta} label={label} variant="outlined" fullWidth disabled={isView} />
                          )}
                        </Field>
                      );
                    case "color":
                      return (
                        <Field
                          key={id}
                          name={id}
                          beforeSubmit={() => {
                            form.change(id, getColorHex(form.getFieldState(id).value));
                          }}
                          {...fieldProps}
                        >
                          {({ input }) => <InputColor label={label} input={input} disabled={isView} />}
                        </Field>
                      );
                    case "checkBox":
                      return (
                        <Field key={id} name={id} {...fieldProps}>
                          {({ input, meta }) => <Checkbox input={input} meta={meta} label={label} variant="outlined" disabled={isView} />}
                        </Field>
                      );
                    default:
                      return (
                        <Field key={id} name={id} {...fieldProps}>
                          {({ input, meta }) => (
                            <Input input={input} meta={meta} label={label} variant="outlined" fullWidth disabled={isView} />
                          )}
                        </Field>
                      );
                  }
                })}
              </Box>
            </LoadingBlock>
            <StackButton>{renderButtons(form, pristine, submitting, validSaveBtn)}</StackButton>
            {formHasOnlyCommonErrors && submitError && !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
          </form>
        );
      }}
    </Form>
  );
};

DefaultForm.defaultProps = {
  fields: [],
  onSuccess: () => {},
  isView: false,
  isEdit: false,
  readOnly: false,
};

export default DefaultForm;
