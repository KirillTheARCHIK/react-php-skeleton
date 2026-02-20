import React from "react";
import { Autocomplete, InputAdornment, ListItemText, MenuItem } from "@mui/material";
import { styled } from "@mui/material/styles";
import Input from "components/FormFields/Input";

function renderInput(params, name, placeholder, label, custom, icon, meta, required) {
  const { touched, invalid, error, submitError } = meta;
  params.InputProps.startAdornment = (
    <div className={"start-content"}>
      {icon && <InputAdornment position="start">{icon}</InputAdornment>}
      <span>{params.InputProps.startAdornment}</span>
    </div>
  );
  return (
    <Input
      {...params}
      label={label}
      placeholder={placeholder}
      name={name}
      error={touched && invalid}
      helperText={touched && (error || submitError)}
      required={required}
      InputProps={{
        ...params.InputProps,
        ...custom.InputProps,
      }}
      inputProps={{
        ...params.inputProps,
        autoComplete: "off",
      }}
    />
  );
}

function Select({
  multiple,
  options,
  placeholder,
  label,
  fullWidth,
  size,
  input,
  icon,
  required,
  meta,
  isOptionEqualToValue = (option, value) => option.id === value.id,
  ...custom
}) {
  const handleChange = (e, newValue, reason) => {
    switch (reason) {
      case "selectOption":
        input.onChange(newValue);
        break;
      case "removeOption":
        if (newValue.length) {
          input.onChange(newValue);
        } else {
          input.onChange("");
        }
        break;
      case "clear":
        input.onChange("");
        break;
      default:
        break;
    }
  };

  const getValue = () => {
    if (multiple) {
      if (Array.isArray(input.value)) {
        return input.value;
      }
      return [];
    }
    return input.value || null;
  };

  const renderOptionDisabled = (option) => {
    if (multiple) {
      if (Array.isArray(input.value)) {
        return input.value.some((item) => item.id === option.id || option.disabled);
      }
      return false;
    }
    if (option.disabled) {
      return option.disabled;
    }
    return option.id === input.value.id;
  };

  const isValueEmpty = React.useMemo(
    () => (Array.isArray(input.value) && input.value.length === 0) || input.value?.id === "",
    [input.value]
  );

  return (
    <StyledSelect
      disablePortal
      disableClearable={isValueEmpty}
      size={size}
      id={input.name}
      autoComplete={false}
      noOptionsText={"Ничего не найдено"}
      clearText={"Очистить"}
      options={options}
      multiple={multiple}
      onChange={handleChange}
      onBlur={input.onBlur}
      value={getValue()}
      getOptionDisabled={renderOptionDisabled}
      fullWidth={fullWidth}
      renderOption={(props, option) => {
        return (
          <MenuItem key={option.id} value={option.id} disabled={option.disabled} {...props}>
            <ListItemText primary={option.label} />
          </MenuItem>
        );
      }}
      renderInput={(params) => renderInput(params, input.name, placeholder, label, custom, icon, meta, required, fullWidth)}
      isOptionEqualToValue={isOptionEqualToValue}
      {...custom}
    />
  );
}

function styles() {
  return {
    fontFamily: "'Helvetica', sans-serif",
    marginBottom: "25px",
    "& .start-content": {
      display: "flex",
      alignItems: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
    "& .MuiTextField-root.MuiFormControl-root": {
      margin: 0,
    },
    "& .MuiInputBase-root": {
      minHeight: "55px",
    },
    "& .MuiInputBase-adornedEnd": {
      "&.MuiInputBase-sizeSmall": {
        fontSize: "13px",
        minHeight: "40px",
      },
    },
    "& .MuiInputAdornment-root": {
      margin: `0 5px`,
      height: "unset",
    },
  };
}

const StyledSelect = styled(Autocomplete)(styles);

Select.defaultProps = {
  multiple: false,
  placeholder: "",
  options: [],
  fullWidth: false,
  size: "medium",
  required: false,
  label: "",
  meta: {
    touched: false,
    invalid: false,
    error: "",
  },
};

export default Select;
