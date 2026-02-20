import * as React from "react";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Input from "components/FormFields/Input";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import { getFilterParams } from "helpers/requestParams";
import { useAsync } from "hooks";

const INITIAL_SEARCH_VALUE = "";

const AsyncSelect = ({
  disableClearable,
  label,
  input,
  meta: { touched, invalid, error, submitError },
  readOnly,
  loadOptions,
  required,
  multiple,
  placeholder,
  getOptionDisabled,
  isOptionEqualToValue = (option, value) => option.id === value.id,
  formParams,
  renderOptions,
  isNeedUpdateOnDrop,
  customResetOptions,
  customOnLoadEntitiesOptions,
  ...custom
}) => {
  const [open, setOpen] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [inputValue, setInputValue] = React.useState(INITIAL_SEARCH_VALUE);
  const [inputValueMultiple, setInputValueMultiple] = React.useState(INITIAL_SEARCH_VALUE);

  const values = multiple ? inputValueMultiple : inputValue;

  const {
    loading,
    value: options = [],
    execute: fetchOptions,
    setValue: setOptions,
  } = useAsync(async (resetOptions) => {
    let params = { page: 1, limit: limit };

    if (values !== (getValue()?.displayName || INITIAL_SEARCH_VALUE) && !resetOptions) {
      params["search"] = values;
    }
    if (formParams) {
      params = { ...params, ...getFilterParams(formParams) };
    }
    const response = await loadOptions(params);
    if (response.error) throw response;
    if (renderOptions) {
      return renderOptions(response.entries);
    }
    if (customOnLoadEntitiesOptions) {
      return customOnLoadEntitiesOptions(response.entries);
    }
    return response.entries;
  });

  React.useEffect(() => {
    setInputValue(getValue());
  }, []);

  React.useEffect(() => {
    if (!readOnly && open) {
      fetchOptions();
    }
  }, [limit]);

  React.useEffect(() => {
    if (!readOnly && open) {
      const getOptions = setTimeout(() => fetchOptions(), 1000);

      return () => clearTimeout(getOptions);
    }
  }, [values]);

  const onInputChange = (event, newInputValue) => {
    if (multiple && newInputValue !== "") {
      setInputValueMultiple(newInputValue);
    } else setInputValue(newInputValue);
  };

  React.useEffect(() => {
    setOptions([]);
  }, [formParams, customResetOptions]);

  const onOpen = () => {
    if (!readOnly) {
      setOpen(true);
      if (!options.length || isNeedUpdateOnDrop) {
        fetchOptions();
      }
    }
  };

  const onClose = (event, reason) => {
    setOpen(false);
    switch (reason) {
      case "toggleInput":
      case "escape":
      case "blur":
        syncInputValue();
        break;
      default:
        break;
    }
    input.onBlur();
  };

  const onChange = (event, newValue, reason) => {
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

  const onScroll = (event) => {
    const listboxNode = event.currentTarget;
    const totalHeight = Math.ceil(listboxNode.scrollTop + listboxNode.clientHeight);
    if (totalHeight === listboxNode.scrollHeight) {
      setLimit(limit + 10);
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

  const syncInputValue = () => {
    if (multiple) {
      setInputValueMultiple("");
    } else setInputValue(renderOptionLabel(getValue() ?? ""));
  };

  React.useEffect(() => {
    syncInputValue();
  }, [input.value]);

  const handleKeyDown = (event) => {
    if (event.key === "Backspace" && multiple) {
      setInputValueMultiple((prevValue) => prevValue.slice(0, -1));
      event.preventDefault();
    }
  };

  const renderInput = (params) => {
    return (
      <Input
        {...params}
        label={label}
        error={touched && invalid}
        helperText={touched && (error || submitError)}
        required={required}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress size={20} /> : null}
              {!readOnly ? params.InputProps.endAdornment : null}
              {custom.InputProps?.endAdornment ? custom.InputProps.endAdornment : null}
            </>
          ),
        }}
        InputLabelProps={{ shrink: true }}
        placeholder={placeholder}
        sx={{ ...custom.sx }}
        onKeyDown={handleKeyDown}
      />
    );
  };

  const renderOptionDisabled = (option) => {
    if (multiple) {
      if (Array.isArray(input.value)) {
        return input.value.some((item) => item.id === option.id);
      }
      return false;
    }
    if (option.disabled) {
      return option.disabled;
    }
    return option.id === input.value.id;
  };

  return (
    <StyledSelect
      forcePopupIcon
      multiple={multiple}
      value={getValue()}
      inputValue={values}
      id={input.name}
      onOpen={onOpen}
      onClose={onClose}
      onChange={onChange}
      onInputChange={onInputChange}
      ListboxProps={{
        role: "searchbox",
        onScroll,
        style: { maxHeight: "15rem" },
        position: "bottom-start",
      }}
      getOptionDisabled={getOptionDisabled || renderOptionDisabled}
      getOptionLabel={renderOptionLabel}
      options={options}
      loading={loading}
      readOnly={readOnly}
      disableClearable={disableClearable || readOnly}
      limitTags={5}
      loadingText="Загрузка..."
      noOptionsText="Нет совпадений"
      clearText="Очистить"
      renderInput={renderInput}
      renderOption={renderOption}
      blurOnSelect
      clearOnBlur
      isOptionEqualToValue={isOptionEqualToValue}
      {...custom}
    />
  );
};

const renderOptionLabel = (option) => {
  if (option.displayName) {
    return option.displayName;
  }
  if (option.fullName) {
    return option.fullName;
  }
  if (option.name) {
    return option.name;
  }
  if (option.label) {
    return option.label;
  }
  return option;
};

const renderOption = (props, option) => {
  return (
    <Box component="li" {...props} key={option.id}>
      {renderOptionLabel(option)}
    </Box>
  );
};

function styles() {
  return {
    fontFamily: "'Helvetica', sans-serif",
    marginBottom: "25px",
    "& .MuiOutlinedInput-root.MuiInputBase-sizeSmall": {
      paddingTop: "9px",
      paddingBottom: "9px",
      paddingLeft: "10px",
    },
    "& .MuiTextField-root.MuiFormControl-root": {
      margin: 0,
    },
    "& .MuiInputBase-root": {
      minHeight: "55px",
    },
    "& .MuiInputBase-adornedEnd": {
      "&.MuiInputBase-sizeSmall": {
        paddingRight: 20,
        fontSize: "13px",
        minHeight: "40px",
      },
    },
    "& .MuiOutlinedInput-root.MuiInputBase-adornedEnd": {
      paddingRight: 20,
    },
    "& .MuiInputAdornment-root": {
      margin: `0 5px`,
      height: "unset",
    },
  };
}

const StyledSelect = styled(Autocomplete)(styles);

export default AsyncSelect;
