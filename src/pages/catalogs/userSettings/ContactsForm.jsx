import { Field, Form } from "react-final-form";
import InputPhone from "components/FormFields/InputPhone";
import Input from "components/FormFields/Input";
import StackButton from "components/StackButton";
import Button from "components/Button";
import FormHelperText from "components/FormHelperText";

import { phoneNumber } from "helpers/formValidators";
import { withCheckCommonErrors } from "helpers/form";

export function ContactsForm({ currentOrganization, submitProfile }) {
  return (
    <Form initialValues={currentOrganization} onSubmit={(values) => withCheckCommonErrors(values, submitProfile)}>
      {({ handleSubmit, pristine, dirtySinceLastSubmit, valid, submitting, submitError, submitErrors = {} }) => {
        const validSaveBtn = valid || dirtySinceLastSubmit;
        const { formHasOnlyCommonErrors } = submitErrors;

        return (
          <form onSubmit={handleSubmit}>
            <Field name="phoneNumber" validate={phoneNumber}>
              {({ input, meta }) => <InputPhone input={input} meta={meta} label="Телефон" fullWidth />}
            </Field>
            <Field name="email">{({ input, meta }) => <Input input={input} meta={meta} label="Электронная почта" fullWidth />}</Field>
            <Field name="directorName">{({ input, meta }) => <Input input={input} meta={meta} label="ФИО Директора" fullWidth />}</Field>
            <Field name="responsiblePerson">
              {({ input, meta }) => <Input input={input} meta={meta} label="Ответственное лицо" fullWidth />}
            </Field>
            <Field name="additionalPhoneNumber" validate={phoneNumber}>
              {({ input, meta }) => <InputPhone input={input} meta={meta} label="Дополнительный телефон" fullWidth />}
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
