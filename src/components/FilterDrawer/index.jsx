import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Field, Form } from "react-final-form";
import { Box, Chip, Drawer } from "@mui/material";

import { setFilter, setPagination } from "actions/requestParams";
import { setCheckedCheckboxes } from "actions/checkboxes";

import { loadFilterTemplate } from "services/filterTemplates";

import Icon from "components/Icon";
import Button from "components/Button";
import Input from "components/FormFields/Input";
import AsyncSelect from "components/FormFields/AsyncSelect";
import Select from "components/FormFields/Select";
import InputNumber from "components/FormFields/InputNumber";
import InputPhone from "components/FormFields/InputPhone";
import StackButton from "components/StackButton";
import IconButton from "components/IconButton";
import LoadingBlock from "components/LoadingBlock";
import { MODAL_STATE } from "components/Modal";
import FilterTemplatesList from "./FilterTemplatesList";
import FilterTemplateNameFormModal from "./FilterTemplateNameFormModal";

import { isValidDate } from "helpers/formValidators";
import { getFilterParams } from "helpers/requestParams";

import { DATE_RANGE } from "constants/filter";
import { NOT_VISIBLE_FORM_FIELDS } from "constants/formFields";
import DatePickerField from "components/DatePickerField";

export const FILTER_FORM = 0;
export const FILTER_TEMPLATES_LIST = 1;

const FilterDrawer = ({
  open,
  onClose,
  fields,
  loadData,
  withCheckboxes,
  withRadioButtons,
  onRadioButtonClick,
  reducerKey,
  routeId,
  title,
  additionalValuesFilter,
}) => {
  const dispatch = useDispatch();
  const requestParams = useSelector((state) => state.requestParams[reducerKey]);

  const [filterType, setFilterType] = React.useState(FILTER_FORM);
  const [filterTemplate, setFilterTemplate] = React.useState({});
  const [filterTemplateId, setFilterTemplateId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { paginationParams, sortParams, filterParams, searchParams } = requestParams;

  React.useEffect(() => {
    if (filterTemplateId) {
      fetchFilterTemplate();
    }
  }, [filterType]);

  const fetchFilterTemplate = async () => {
    try {
      setLoading(true);
      const response = await loadFilterTemplate(filterTemplateId);
      if (response.error) throw response;
      setFilterTemplate(response);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const onReset = (form, resetFilterTemplate) => {
    const newPaginationsParams = { ...paginationParams, page: 1 };
    dispatch(setPagination(newPaginationsParams, reducerKey));
    if (Object.keys(filterParams).length) {
      dispatch(setFilter({}, reducerKey));
    }
    if (resetFilterTemplate) {
      setFilterTemplate({});
    }
    setFilterTemplateId(null);
    if (form) {
      form.reset({});
    }
    dispatch(
      loadData({
        ...paginationParams,
        ...sortParams,
        ...searchParams,
      })
    );

    if (withCheckboxes) {
      dispatch(setCheckedCheckboxes({}));
    }
    if (withRadioButtons) {
      onRadioButtonClick(null);
    }
  };

  const getValueWithFilterName = (values) => {
    const customValues = {};
    Object.keys(values).forEach((key) => {
      const value = fields.find((item) => item.id === key);
      if (value && value.field?.filterName) {
        customValues[key] = {
          ...values[key],
          filterName: value.field.filterName,
        };
      } else {
        customValues[key] = values[key];
      }
    });
    return customValues;
  };

  const onSubmit = ({ action, ...values }) => {
    const valuesWithFilterName = getValueWithFilterName({
      ...values,
      ...additionalValuesFilter,
    });

    const params = getFilterParams(valuesWithFilterName, fields);

    const newPaginationsParams = { ...paginationParams, page: 1 };
    dispatch(
      loadData({
        ...newPaginationsParams,
        ...sortParams,
        ...searchParams,
        ...params,
      })
    );

    dispatch(setFilter(values, reducerKey));
    dispatch(setPagination(newPaginationsParams, reducerKey));

    if (withCheckboxes) {
      dispatch(setCheckedCheckboxes({}));
    }
    if (withRadioButtons) {
      onRadioButtonClick(null);
    }
  };

  const renderFields = fields.filter((item) => !NOT_VISIBLE_FORM_FIELDS.includes(item.id) && item.field?.visible !== false);

  return (
    <Drawer
      anchor="right"
      onClose={() => {
        setFilterType(FILTER_FORM);
        onClose();
      }}
      open={open}
      PaperProps={{
        style: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
      }}
    >
      <Box
        sx={{
          width: 430,
          height: "100%",
          bgcolor: "background.paper",
          p: "24px 20px",
          overflow: "hidden",
        }}
      >
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box component="div" sx={{ fontSize: 18, fontWeight: 700 }}>
            Фильтрация
          </Box>
          <IconButton
            name="close"
            title="Закрыть"
            color="primary"
            onClick={() => {
              setFilterType(FILTER_FORM);
              onClose();
            }}
          />
        </Box>
        <Box
          component="div"
          sx={{
            display: "flex",
            justifyContent: filterTemplateId ? "space-between" : "flex-end",
            alignItems: "center",
            mt: 1,
            mb: 2,
            pr: "7px",
          }}
        >
          {filterTemplateId ? (
            <Chip
              label={filterTemplate.filterName}
              onDelete={() => {
                onReset();
              }}
            />
          ) : null}
          <Button
            onClick={() => {
              // if (filterType === FILTER_TEMPLATES_LIST) {
              //   setFilterType(FILTER_FORM);
              // } else {
              //   setFilterType(FILTER_TEMPLATES_LIST);
              // }
              onReset(null, "resetFilterTemplate");
            }}
            variant={filterType === FILTER_TEMPLATES_LIST ? "contained" : "outlined"}
            color={filterType === FILTER_TEMPLATES_LIST ? "primary" : "inherit"}
            size="small"
          >
            Шаблоны
          </Button>
        </Box>
        {filterType === FILTER_TEMPLATES_LIST ? (
          <FilterTemplatesList catalogSlug={routeId} setFilterType={setFilterType} setFilterTemplateId={setFilterTemplateId} />
        ) : null}
        {filterType === FILTER_FORM ? (
          <Form initialValues={filterTemplate.filterContent ?? filterParams} onSubmit={onSubmit}>
            {({ handleSubmit, submitting, pristine, valid, form, values }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <LoadingBlock isLoading={loading}>
                    <Box
                      component="div"
                      sx={{
                        height: "calc(100vh - 186px)",
                        overflow: "auto",
                        padding: "7px",
                        "& > div:not(:last-child)": {
                          marginBottom: "20px",
                        },
                        "& > div:last-child": {
                          marginBottom: 0,
                        },
                      }}
                    >
                      {renderFields.map(({ id, label, field = {} }) => {
                        const disabled = field.disabled ? field.disabled(values) : false;
                        switch (field.type || field.typeFilter) {
                          case "asyncselect":
                            return (
                              <Field key={id} name={id}>
                                {({ input, meta }) => (
                                  <AsyncSelect
                                    multiple={field.multiple}
                                    input={input}
                                    meta={meta}
                                    label={label}
                                    loadOptions={field.loadOptions}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    sx={{ mb: 0 }}
                                    disabled={disabled}
                                    InputProps={{
                                      startAdornment: <Icon name="search" color="action" sx={{ fontSize: "16px !important" }} />,
                                    }}
                                  />
                                )}
                              </Field>
                            );
                          case "year":
                          case "date":
                          case "datetime":
                          case "time":
                            return (
                              <>
                                {Object.keys(DATE_RANGE).map((key) => {
                                  return (
                                    <DatePickerField
                                      key={`${id}_${key}`}
                                      name={`${id}.${key}`}
                                      validate={isValidDate}
                                      type={field.type}
                                      label={`${label} (${DATE_RANGE[key]})`}
                                      size="small"
                                      fullWidth
                                    />
                                  );
                                })}
                              </>
                            );
                          case "select":
                            return (
                              <Field key={id} name={id}>
                                {({ input, meta }) => (
                                  <Select
                                    input={input}
                                    meta={meta}
                                    label={label}
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    options={field.options}
                                    icon={<Icon name="search" color="action" sx={{ fontSize: "16px !important" }} />}
                                  />
                                )}
                              </Field>
                            );
                          case "number":
                            return (
                              <Field key={id} name={id}>
                                {({ input, meta }) => (
                                  <InputNumber
                                    input={input}
                                    meta={meta}
                                    component={Input}
                                    label={label}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    decimalScale={field.decimalScale}
                                    InputProps={{
                                      startAdornment: <Icon name="search" color="action" sx={{ fontSize: "16px !important" }} />,
                                    }}
                                  />
                                )}
                              </Field>
                            );
                          case "custom_datetime":
                            return (
                              <DatePickerField
                                key={id}
                                name={id}
                                validate={isValidDate}
                                type="datetime"
                                label={label}
                                size="small"
                                fullWidth
                                disabled={disabled}
                              />
                            );
                          case "tel":
                            return (
                              <Field key={id} name={id}>
                                {({ input, meta }) => <InputPhone input={input} meta={meta} label={label} size="small" fullWidth />}
                              </Field>
                            );
                          default:
                            return (
                              <Field key={id} name={id}>
                                {({ input, meta }) => (
                                  <Input
                                    input={input}
                                    meta={meta}
                                    label={label}
                                    variant="outlined"
                                    size="small"
                                    fullWidth
                                    InputProps={{
                                      startAdornment: <Icon name="search" color="action" sx={{ fontSize: "16px !important" }} />,
                                    }}
                                  />
                                )}
                              </Field>
                            );
                        }
                      })}
                    </Box>
                  </LoadingBlock>
                  <StackButton>
                    <Button
                      disabled={!Object.keys(values).length || !valid}
                      loading={submitting}
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => {
                        dispatch(modalSlice.actions.openModal({ modalName: "filter-template-name-modal", modalState: MODAL_STATE.OPENED }));
                      }}
                      sx={{ width: "auto" }}
                    >
                      {`${filterTemplateId ? "Редактировать" : "Создать"} шаблон`}
                    </Button>
                    <Button
                      disabled={filterTemplate.filterContent ? false : pristine || !valid}
                      loading={submitting}
                      variant="contained"
                      type="submit"
                      color="primary"
                      size="small"
                    >
                      Применить
                    </Button>
                    <Button onClick={() => onReset(form, "resetFilterTemplate")} variant="outlined" color="inherit" size="small">
                      Сбросить
                    </Button>
                  </StackButton>
                  <FilterTemplateNameFormModal
                    catalogSlug={routeId}
                    catalogName={title}
                    filterContent={values}
                    filterTemplate={filterTemplate}
                    filterTemplateId={filterTemplateId}
                    setFilterTemplate={setFilterTemplate}
                    setFilterTemplateId={setFilterTemplateId}
                  />
                </form>
              );
            }}
          </Form>
        ) : null}
      </Box>
    </Drawer>
  );
};

FilterDrawer.defaultProps = {
  open: false,
  columns: [],
  onClose: () => {},
};

export default FilterDrawer;
