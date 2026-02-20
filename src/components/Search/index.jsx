import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Field, Form } from "react-final-form";
import { Stack } from "@mui/material";

import { setPagination, setSearch } from "actions/requestParams";
import Button from "components/Button";
import InputSearch from "components/FormFields/InputSearch";

import { getFilterParams } from "helpers/requestParams";

const Search = ({ loadData, disabled, reducerKey, visibleButton, customSx }) => {
  const dispatch = useDispatch();

  const requestParams = useSelector((state) => state.requestParams[reducerKey]);

  const { paginationParams, filterParams, sortParams, searchParams } = requestParams;

  const onSubmit = (values) => {
    dispatch(setSearch({}, reducerKey));
    const newSearchValues = { ...values, search: values.search.trim() };
    const filter = getFilterParams(filterParams);
    const newPaginationsParams = { ...paginationParams, page: 1 };
    dispatch(
      loadData({
        ...newPaginationsParams,
        ...sortParams,
        ...newSearchValues,
        ...filter,
      })
    );
    dispatch(setSearch(newSearchValues, reducerKey));
    dispatch(setPagination(newPaginationsParams, reducerKey));
  };

  const onReset = (form) => {
    form.reset();
    if (Object.keys(searchParams).length) {
      const filter = getFilterParams(filterParams);
      const newPaginationsParams = { ...paginationParams, page: 1 };
      dispatch(loadData({ ...newPaginationsParams, ...sortParams, ...filter }));
      dispatch(setSearch({}, reducerKey));
      dispatch(setPagination(newPaginationsParams, reducerKey));
    }
  };

  const disabledResetButton = (pristine, submitting) => {
    if (Object.keys(searchParams).length) {
      return false;
    }
    return pristine || submitting;
  };

  return (
    <Form onSubmit={onSubmit}>
      {({ handleSubmit, submitting, pristine, form }) => {
        return (
          <form onSubmit={handleSubmit}>
            <Stack direction="row" spacing={2}>
              <Field name="search">
                {({ input, meta }) => (
                  <InputSearch
                    input={input}
                    meta={meta}
                    variant="outlined"
                    disabled={disabled}
                    placeholder={"Поиск"}
                    sx={customSx ? customSx : { m: 0 }}
                  />
                )}
              </Field>
              {visibleButton ? (
                <>
                  <Button disabled={pristine} loading={submitting} variant="contained" type="submit" color="primary" size="small">
                    Применить
                  </Button>
                  <Button
                    disabled={disabledResetButton(pristine, submitting)}
                    variant="outlined"
                    size="small"
                    color="inherit"
                    onClick={() => onReset(form)}
                  >
                    Сброс
                  </Button>
                </>
              ) : null}
            </Stack>
          </form>
        );
      }}
    </Form>
  );
};
Search.defaultProps = {
  visibleButton: true,
};
export default Search;
