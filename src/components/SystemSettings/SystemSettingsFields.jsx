import React from "react";
import { Field } from "react-final-form";
import { Box } from "@mui/material";

import InputNumber from "components/FormFields/InputNumber";
import Select from "components/FormFields/Select";

import { parseNumber } from "helpers/parse";
import composeValidators, {
  isValidDate,
  required,
} from "helpers/formValidators";
import DatePickerField from "components/DatePickerField";

export const SystemSettingsFields = ({ fields = [] }) => {
  return fields.map((item) => {
    switch (item.field?.type) {
      case "date":
      case "datetime":
      case "time":
        return (
          <Box component="div" key={item.id}>
            <DatePickerField
              name={item.id}
              key={item.id}
              validate={composeValidators(required, isValidDate)}
              type={item.field?.type}
              label={item.label}
              size="small"
              fullWidth
              disabledDate={item.field?.disabledDate}
              disabledTime={item.field?.disabledTime}
            />
          </Box>
        );
      case "select":
        return (
          <Field name={item.id} key={item.id}>
            {({ input, meta }) => (
              <Select
                input={input}
                meta={meta}
                label={item.label}
                variant="outlined"
                fullWidth
                size="small"
                options={item.field.options}
              />
            )}
          </Field>
        );
      default:
        return (
          <Box component="div" key={item.id}>
            <Field name={item.id} validate={item.validate} parse={parseNumber}>
              {({ input, meta }) => (
                <InputNumber
                  input={input}
                  meta={meta}
                  label={item.label}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              )}
            </Field>
          </Box>
        );
    }
  });
};

export default SystemSettingsFields;
