import { Field, Form } from "react-final-form";
import { Typography } from "@mui/material";
import Input from "components/FormFields/Input";
import Checkbox from "components/FormFields/Checkbox";
import InputNumber from "components/FormFields/InputNumber";
import StackButton from "components/StackButton";
import Button from "components/Button";
import FormHelperText from "components/FormHelperText";
import DatePickerField from "components/DatePickerField";

import composeValidators, { isValidDate } from "helpers/formValidators";
import { withCheckCommonErrors } from "helpers/form";

export function CommonInfoForm({ currentOrganization, submitProfile, handleNavigate }) {
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
            <Field name="contractorAccountActive">
              {({ input, meta }) => <Checkbox input={input} meta={meta} label="Состояние договора" size="small" disabled />}
            </Field>
            <DatePickerField
              name="createdAt"
              validate={composeValidators(isValidDate)}
              type="datetime"
              label="Дата начала договора"
              fullWidth
              size="small"
              disabled
            />
            <DatePickerField
              name="contractorAccountUntil"
              validate={composeValidators(isValidDate)}
              type="datetime"
              label="Дата окончания договора"
              fullWidth
              size="small"
              disabled
            />
            <Typography variant="h6" mb={3} fontWeight={"bold"}>
              Сводная аналитика
            </Typography>
            <Field name="applicationCount">
              {({ input, meta }) => <Input input={input} meta={meta} label="Количество водителей" disabled fullWidth />}
            </Field>
            <Field name="applicationActiveCount">
              {({ input, meta }) => <Input input={input} meta={meta} label="Количество транспортных средств" disabled fullWidth />}
            </Field>
            <Field name="applicationCount">
              {({ input, meta }) => <Input input={input} meta={meta} label="Всего создано заявок" disabled fullWidth />}
            </Field>
            <Field name="applicationActiveCount">
              {({ input, meta }) => <Input input={input} meta={meta} label="Всего активных заявок" disabled fullWidth />}
            </Field>
            <StackButton>
              <Button variant="contained" type="button" onClick={() => handleNavigate("/monitoring/contract_vehicle")} color="primary">
                Реестр ТС организации
              </Button>
              <Button variant="contained" type="button" onClick={() => handleNavigate("/staff/contract_driver")} color="primary">
                Реестр водителей организации
              </Button>
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
