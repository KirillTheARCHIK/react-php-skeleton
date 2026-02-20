import { useCallback } from "react";
import { Field, Form } from "react-final-form";
import { Box, Grid } from "@mui/material";
import Select from "components/FormFields/Select";
import Button from "components/Button";
import composeValidators, { dateRequired, isValidDate, required } from "helpers/formValidators";
import DatePickerField from "components/DatePickerField";

export const IntegrationModalForm = ({ integrationInfo = {}, weekOptions, onSubmit, initialValues, intervalsOptions }) => {
  const renderPicker = useCallback(
    (period) => {
      switch (period.value) {
        case "day":
        case "month":
          return (
            <DatePickerField
              name={"date"}
              validate={composeValidators(dateRequired, isValidDate)}
              type={period.value === "day" ? "time" : "datetime"}
              label={"Выбор времени"}
              fullWidth
              disabled={!integrationInfo.enabled}
            />
          );
        case "week":
          return (
            <Grid container spacing={2}>
              <Grid item xs={8}>
                <Field name={"dayOfWeek"} validate={required}>
                  {({ input, meta }) => (
                    <Select
                      input={input}
                      meta={meta}
                      label={"День недели"}
                      variant="outlined"
                      fullWidth
                      size="medium"
                      options={weekOptions}
                      required
                      disabled={!integrationInfo.enabled}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <DatePickerField
                  name={"date"}
                  validate={composeValidators(dateRequired, isValidDate)}
                  type={"time"}
                  label={"Выбор времени"}
                  fullWidth
                  disabled={!integrationInfo.enabled}
                />
              </Grid>
            </Grid>
          );
        default:
          return null;
      }
    },
    [integrationInfo.enabled, weekOptions]
  );
  return (
    <Box sx={{ paddingTop: 5 }}>
      <Form onSubmit={onSubmit} initialValues={initialValues}>
        {({ handleSubmit, submitting, pristine, valid, values }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Field name={"period"} validate={required}>
                {({ input, meta }) => (
                  <Select
                    input={input}
                    meta={meta}
                    label={"Интервал"}
                    variant="outlined"
                    fullWidth
                    size="medium"
                    options={intervalsOptions}
                    required
                    disabled={!integrationInfo.enabled}
                  />
                )}
              </Field>
              {values.period && renderPicker(values.period)}
              <Box component="div" sx={{ pt: "10px" }}>
                <Button disabled={pristine || !valid} loading={submitting} variant="contained" type="submit" color="primary" size="small">
                  Применить
                </Button>
              </Box>
            </form>
          );
        }}
      </Form>
    </Box>
  );
};
