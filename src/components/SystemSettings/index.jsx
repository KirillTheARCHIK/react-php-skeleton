import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { Form } from "react-final-form";
import { Box } from "@mui/material";
import { FORM_ERROR } from "final-form";

import { updateSystemSettings } from "actions/catalogs/settings";

import Button from "components/Button";
import LoadingBlock from "components/LoadingBlock";
import StackButton from "components/StackButton";
import withAlert from "components/HOC/withAlert";
import FormHelperText from "components/FormHelperText";
import SystemSettingsColor from "./SystemSettingsColor";
import SystemSettingsFields from "./SystemSettingsFields";

import { formatTime, momentTime, toNaiveISOString } from "helpers/date";
import { showError } from "helpers/error";
import { getColorHex } from "helpers/format";
import { withCheckCommonErrors } from "helpers/form";

import { ALL_FIELDS } from "constants/systemSettings";
import { BOOLEAN_TYPE_COLOR, TIME_TO_APPROVE_OPTIONS } from "constants/options";
import { STYLE_CONTENT_FORM } from "constants/styles";

const SystemSettings = ({ onClose = () => {}, fields = [], onOpenAlert, moduleKey }) => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.systemSettings);
  const [initialValues, setInitialValues] = React.useState({});

  React.useEffect(() => {
    if (data.values) getInitialValues();
  }, [data]);

  const getInitialValues = () => {
    const techTaxi = data.values.tech_taxi ?? {};
    setInitialValues({
      ...techTaxi.availability_colors,
      ...techTaxi.timer_application_statuses,
      ...techTaxi,
      ...data.values.repairs,
      time_period_request: toNaiveISOString(momentTime(techTaxi.time_period_request)),
      time_accept_app_next_day: toNaiveISOString(momentTime(techTaxi.time_accept_app_next_day)),
      start_work_time: toNaiveISOString(momentTime(techTaxi.start_work_time)),
      colorType: BOOLEAN_TYPE_COLOR[0],
      time_to_approve: TIME_TO_APPROVE_OPTIONS.find((element) => element.label === techTaxi.time_to_approve),
    });
  };

  const getValues = (values) => {
    const newValues = {
      repairs: {},
      tech_taxi: { availability_colors: {}, timer_application_statuses: {} },
    };
    ALL_FIELDS.forEach((filter) => {
      const { id, type } = filter;
      const value = values[id];
      switch (type) {
        case "temporaries":
        case "constantPresets":
          if (value) {
            newValues.repairs[id] = value;
          }
          break;
        case "colorSegments":
          filter.children.forEach((item) => {
            const { id: childId } = item;
            const childValue = values[childId];
            if (childValue) {
              newValues.tech_taxi.availability_colors[childId] = getColorHex(childValue);
            }
          });
          break;
        case "TimersApplicationStatuses":
          newValues.tech_taxi.timer_application_statuses[id] = value;
          break;

        case "temporariesTaxi":
          if (value) {
            newValues.tech_taxi[id] = value.label || value;
          }
          break;
        default:
          break;
      }
    });
    return newValues;
  };

  const onSubmit = (values) => {
    const buildValues = getValues(values);

    const newValues = {
      ...buildValues,
      tech_taxi: {
        ...buildValues.tech_taxi,
        time_period_request: formatTime(values.time_period_request),
        time_accept_app_next_day: formatTime(values.time_accept_app_next_day),
        start_work_time: formatTime(values.start_work_time),
      },
    };

    return new Promise((resolve) => {
      dispatch(
        updateSystemSettings(newValues, {
          resolve: () => {
            resolve();
            onClose();
          },
          reject: ({ error }) => {
            resolve({ [FORM_ERROR]: error });
            showError(onOpenAlert, error);
          },
        })
      );
    });
  };

  const renderContent = (form, values) => {
    switch (moduleKey) {
      case "colorSegments":
        return <SystemSettingsColor fields={fields} form={form} data={data} values={values} />;
      case "temporaries":
      case "constantPresets":
      case "temporariesTaxi":
      case "TimersApplicationStatuses":
        return <SystemSettingsFields fields={fields} />;
      default:
        return null;
    }
  };

  return (
    <Form initialValues={{ ...initialValues }} onSubmit={(values) => withCheckCommonErrors(values, onSubmit)}>
      {({ handleSubmit, submitting, pristine, valid, form, values, submitError, dirtySinceLastSubmit, submitErrors = {} }) => {
        const { formHasOnlyCommonErrors } = submitErrors;

        return (
          <form onSubmit={handleSubmit}>
            <Box component="div" sx={{ ...STYLE_CONTENT_FORM, maxHeight: "calc(100vh - 280px)" }}>
              <LoadingBlock isLoading={data.loading}>
                <Box component="div">
                  {formHasOnlyCommonErrors && submitError && !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
                </Box>
              </LoadingBlock>
              {renderContent(form, values)}
            </Box>
            <StackButton>
              <Button disabled={!valid} loading={submitting} variant="contained" type="submit" color="primary" size="small">
                Сохранить
              </Button>
              <Button disabled={pristine || submitting} variant="outlined" size="small" onClick={form.reset} color="inherit">
                Сброс
              </Button>
            </StackButton>
          </form>
        );
      }}
    </Form>
  );
};

export default withAlert(SystemSettings);
