import { Stack } from "@mui/material";
import { Field, Form } from "react-final-form";
import Select from "components/FormFields/Select";
import React from "react";

export default function CalendarViewControls({
  range,
  rangeOptions,
  step,
  stepOptions,
  setRange,
  setStep,
}) {
  return (
    <Form initialValues={{ step, range }} onSubmit={() => {}}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Stack direction="row" spacing={1}>
            <Field name="step" value={step}>
              {({ input, meta }) => (
                <Select
                  disableClearable
                  input={input}
                  meta={meta}
                  options={stepOptions}
                  size={"small"}
                  label={"Шаг"}
                  sx={{ width: "150px", mb: "0 !important" }}
                  clearIcon={null}
                  onChange={(event, value) => {
                    input.onChange(value);
                    setStep(value);
                  }}
                />
              )}
            </Field>
            <Field name="range" value={range}>
              {({ input, meta }) => (
                <Select
                  disableClearable
                  input={input}
                  meta={meta}
                  options={rangeOptions}
                  size={"small"}
                  label={"Интервал"}
                  sx={{ width: "150px", mb: "0 !important" }}
                  clearIcon={null}
                  onChange={(event, value) => {
                    input.onChange(value);
                    setRange(value);
                  }}
                />
              )}
            </Field>
          </Stack>
        </form>
      )}
    </Form>
  );
}
