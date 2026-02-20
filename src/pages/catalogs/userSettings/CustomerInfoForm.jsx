import { Field, Form } from "react-final-form";
import Input from "components/FormFields/Input";
import Checkbox from "components/FormFields/Checkbox";
import InputNumber from "components/FormFields/InputNumber";
import StackButton from "components/StackButton";
import Button from "components/Button";
import FormHelperText from "components/FormHelperText";
import { Typography } from "@mui/material";
import { withCheckCommonErrors } from "helpers/form";

export function CustomerInfoForm({ currentOrganization, submitProfile, handleNavigate }) {
  return (
    <Form initialValues={currentOrganization} onSubmit={(values) => withCheckCommonErrors(values, submitProfile)}>
      {({ handleSubmit, pristine, dirtySinceLastSubmit, valid, submitting, submitError, submitErrors = {} }) => {
        const validSaveBtn = valid || dirtySinceLastSubmit;
        const { formHasOnlyCommonErrors } = submitErrors;
        return (
          <form onSubmit={handleSubmit}>
            <Field name="name">{({ input, meta }) => <Input input={input} meta={meta} label="Наименование" disabled fullWidth />}</Field>
            <Field name="shortName">
              {({ input, meta }) => <Input input={input} meta={meta} label="Краткое наименование" fullWidth />}
            </Field>
            <Field name="address">{({ input, meta }) => <Input input={input} meta={meta} label="Адрес" fullWidth />}</Field>
            <Field name="allowedRequest">
              {({ input, meta }) => (
                <Checkbox input={input} meta={meta} label="Разрешение инициировать запросы на перевозку" size="small" disabled />
              )}
            </Field>
            <Field name="inn">{({ input, meta }) => <InputNumber input={input} meta={meta} label="ИНН" fullWidth />}</Field>
            <Field name="reasonCode">{({ input, meta }) => <InputNumber input={input} meta={meta} label="КПП" fullWidth />}</Field>
            <Typography variant="h6" mb={3} fontWeight={"bold"}>
              Сводная аналитика по заявкам
            </Typography>
            <Field name="applicationCount">
              {({ input, meta }) => <Input input={input} meta={meta} label="Всего создано заявок" disabled fullWidth />}
            </Field>
            <Field name="applicationActiveCount">
              {({ input, meta }) => <Input input={input} meta={meta} label="Всего активных заявок" disabled fullWidth />}
            </Field>
            <StackButton>
              <Button
                variant="contained"
                type="button"
                onClick={() => handleNavigate("/logistics/transportation_application")}
                color="primary"
              >
                Реестр заявок на перевозку
              </Button>
              <Button
                disabled={pristine || !validSaveBtn}
                loading={submitting}
                variant="contained"
                type="submit"
                color="primary"
                size="small"
              >
                Сохранить
              </Button>
            </StackButton>
            {formHasOnlyCommonErrors && submitError && !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
          </form>
        );
      }}
    </Form>
  );
}
