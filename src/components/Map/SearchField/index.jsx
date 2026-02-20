import * as React from "react";
import { useDispatch, useSelector } from "store/hooks";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { clearMapParams } from "actions/mapParams";
import Input from "components/FormFields/Input";
import { URL } from "services/catalogs/monitoring";
import { fetchRequest } from "helpers/fetchRequest";

const INITIAL_SEARCH_VALUE = "";

const SearchFieldMap = ({
  label,
  input,
  meta: { touched, invalid, error },
  readOnly,
  loadOptions,
  required,
  form,
  actionWhenOnChange,
  ...custom
}) => {
  const dispatch = useDispatch();
  const { markerPosition } = useSelector((state) => state.mapParams);

  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [limit, setLimit] = React.useState(10);
  const [inputValue, setInputValue] = React.useState(INITIAL_SEARCH_VALUE);

  const fetchOptions = async () => {
    const params = {};

    if (inputValue !== INITIAL_SEARCH_VALUE) {
      params["text"] = inputValue;
    }

    try {
      setLoading(true);
      const response = await fetchRequest(`${URL}/search?` + new URLSearchParams({ ...params }));
      if (response.error) throw response;
      setOptions(response);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!readOnly && inputValue && inputValue.length > 2) {
      const getOptions = setTimeout(() => fetchOptions(), 1000);

      return () => clearTimeout(getOptions);
    }
  }, [inputValue]);

  const onClose = () => {
    setInputValue("");
    input.onBlur();
  };

  const onChange = (event, newValue, reason) => {
    switch (reason) {
      case "selectOption":
        if (actionWhenOnChange) {
          actionWhenOnChange();
        }
        if (markerPosition) {
          const choice = confirm("Внимание! Уже имеющаяся точка на карте имеет другой адрес. Заменить?");
          if (choice) {
            input.onChange(newValue);
            dispatch(clearMapParams());
            form.change("latitude", newValue.lat);
            form.change("longitude", newValue.lng);
          }
        } else {
          input.onChange(newValue);
          dispatch(clearMapParams());
          form.change("latitude", newValue.lat);
          form.change("longitude", newValue.lng);
        }
        break;
      case "removeOption":
      case "clear":
        input.onChange("");
        dispatch(clearMapParams());
        form.change("latitude", null);
        form.change("longitude", null);
        break;
      default:
        break;
    }
  };

  const onInputChange = (event, newInputValue, reason) => {
    switch (reason) {
      case "input":
        setInputValue(newInputValue);
        break;
      case "reset":
        setInputValue("");
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

  const renderInput = (params) => {
    return (
      <Input
        {...params}
        label={label}
        error={touched && invalid}
        helperText={touched && error}
        required={required}
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading ? <CircularProgress size={20} sx={{ mr: 2 }} /> : null}
              {!readOnly ? params.InputProps.endAdornment : null}
            </>
          ),
        }}
        InputLabelProps={{ shrink: true }}
        sx={{ ...custom.sx }}
      />
    );
  };

  const renderOption = (props, option) => {
    return (
      <Box component="li" {...props} key={option.id}>
        {renderOptionLabel(option)}
      </Box>
    );
  };

  const renderOptionLabel = (option) => {
    if (option.name) {
      return option.name;
    }

    return option;
  };

  const renderOptionDisabled = (option) => {
    return option.name === input.value.name;
  };

  return (
    <StyledSelect
      value={input.value || null}
      id={input.name}
      onClose={onClose}
      onChange={onChange}
      onInputChange={onInputChange}
      ListboxProps={{
        role: "searchbox",
        onScroll: onScroll,
        style: { maxHeight: "15rem" },
        position: "bottom-start",
      }}
      getOptionDisabled={renderOptionDisabled}
      getOptionLabel={renderOptionLabel}
      options={options}
      loading={loading}
      readOnly={readOnly}
      disableClearable={readOnly}
      limitTags={5}
      loadingText="Загрузка..."
      noOptionsText="Нет совпадений"
      clearText="Очистить"
      renderInput={renderInput}
      renderOption={renderOption}
      blurOnSelect
      {...custom}
    />
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

export default SearchFieldMap;
