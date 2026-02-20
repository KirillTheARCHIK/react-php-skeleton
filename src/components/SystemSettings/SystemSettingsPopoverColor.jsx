import React from "react";
import { Field } from "react-final-form";
import { Box, InputAdornment, Popover } from "@mui/material";
import {
  usePopupState,
  bindTrigger,
  bindPopover,
} from "material-ui-popup-state/hooks";

import Button from "components/Button";
import Input from "components/FormFields/Input";
import ColorPicker from "components/FormFields/ColorPicker";
import Select from "components/FormFields/Select";
import InputNumber from "components/FormFields/InputNumber";

import { getColorRgbWithTransparency } from "helpers/format";
import composeValidators, {
  maxValue100,
  minValue0,
} from "helpers/formValidators";
import { BOOLEAN_TYPE_COLOR } from "constants/options";
import { getContrastTextColor } from "helpers/colors";

const customSxColorInput = {
  width: "100%",
  height: "24px",
  "& .MuiOutlinedInput-root": {
    height: "24px !important",
  },
};

export const SystemSettingsPopoverColor = ({
  id,
  form,
  values = {},
  availabilityColors,
  value,
}) => {
  const popupState = usePopupState({
    variant: "popover",
    popupId: id,
  });

  return (
    <>
      <Button
        {...bindTrigger(popupState)}
        variant="contained"
        size="small"
        sx={{
          width: "80px",
          backgroundColor: values[value.id],
          "&:hover": {
            backgroundColor: values[value.id],
          },
          color: getContrastTextColor(values[value.id]),
        }}
      >
        {value.shortValue}
      </Button>
      <Popover
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ padding: "16px", width: "264px" }}>
          <Field name={value.id}>
            {({ input }) => <ColorPicker input={input} />}
          </Field>
          <Field name="colorType">
            {({ input }) => (
              <Select
                input={input}
                variant="outlined"
                fullWidth
                required
                onChange={(event, value) => {
                  input.onChange(value);
                  form.change("color", "");
                }}
                options={BOOLEAN_TYPE_COLOR}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    minHeight: "24px !important",
                    padding: 0,
                  },
                  marginRight: "8px",
                }}
              />
            )}
          </Field>
          <Box sx={{ display: "flex" }}>
            <Field name="color">
              {({ input, meta }) => (
                <Input
                  input={input}
                  meta={meta}
                  onChange={(event) => {
                    input.onChange(event.target.value);
                    form.change(
                      value.id,
                      values.colorType?.id === "RGB"
                        ? getColorRgbWithTransparency(
                            `rgba(${event.target.value})`,
                            values.transparencyColor
                          )
                        : getColorRgbWithTransparency(
                            `#${event.target.value}`,
                            values.transparencyColor
                          )
                    );
                  }}
                  sx={{
                    ...customSxColorInput,
                    marginRight: "8px",
                  }}
                  InputProps={
                    values.colorType?.id !== "RGB"
                      ? {
                          startAdornment: (
                            <InputAdornment position="start">#</InputAdornment>
                          ),
                        }
                      : null
                  }
                />
              )}
            </Field>
            <Field
              name="transparencyColor"
              validate={composeValidators(minValue0, maxValue100)}
            >
              {({ input, meta }) => (
                <InputNumber
                  input={input}
                  meta={meta}
                  onChange={(event) => {
                    input.onChange(event.target.value);
                    form.change(
                      value.id,
                      getColorRgbWithTransparency(
                        values[value.id],
                        event.target.value
                      )
                    );
                  }}
                  sx={{
                    ...customSxColorInput,
                  }}
                />
              )}
            </Field>
          </Box>
          <Box component="span">Недавние цвета</Box>
          <Box sx={{ marginTop: "10px" }}>
            {availabilityColors.map((presetColor) => (
              <Button
                sx={{
                  background: presetColor,
                  width: "24px",
                  height: "24px",
                  margin: "4px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  minWidth: "20px",
                  "&:hover": {
                    backgroundColor: presetColor,
                  },
                }}
                onClick={() => form.change(value.id, presetColor)}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};
