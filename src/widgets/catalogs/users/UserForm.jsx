import React from "react";
import { useDispatch } from "react-redux";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Box } from "@mui/material";

import { createUser, updateUser } from "actions/catalogs/users";

import { loadUser } from "services/catalogs/users";

import Input from "components/FormFields/Input";
import Button from "components/Button";
import StackButton from "components/StackButton";
import FormHelperText from "components/FormHelperText";
import InputPassword from "components/FormFields/InputPassword";

import LoadingBlock from "components/LoadingBlock";
import withAlert from "components/HOC/withAlert";
import InputPhone from "components/FormFields/InputPhone";

import DatePickerField from "components/DatePickerField";
import Select from "components/FormFields/Select";

import { showError } from "helpers/error";
import { parseEnglishLettersAndNumber, parsePhone } from "helpers/parse";
import composeValidators, { email, phoneNumber, required } from "helpers/formValidators";
import { getBooleanUser } from "helpers/format";

import { STYLE_CONTENT_FORM } from "constants/styles";
import { USER_SUCCESS_SAVE_MESSAGE_ACTIVE, USER_SUCCESS_SAVE_MESSAGE_NO_ACTIVE } from "constants/message";
import { ROLE_MOBILE, ROLE_NAMING, ROLE_OPTIONS, ROLE_CUSTOMER, ROLE_DIRECTION_DISPATCHER, ROLE_CONTRACTOR } from "constants/userTypes";

const REQUIRED_FIELDS = ["login", "name", "roles", "plainPassword", "password1"];

const validate = (values = {}, isEdit) => {
  const errors = {};
  let requiresFields = [];

  values?.roles?.map((item) => {
    switch (item.id) {
      case ROLE_MOBILE:
        requiresFields = [...REQUIRED_FIELDS, "driver"];
        break;
      case ROLE_CUSTOMER:
      case ROLE_CONTRACTOR:
        requiresFields = [...REQUIRED_FIELDS, "organizations"];
        break;
      case ROLE_DIRECTION_DISPATCHER:
        requiresFields = [...REQUIRED_FIELDS, "specialCargoHandlingTypes"];
        break;
      // case ARM_MECHANIC_USER:
      //   requiresFields = [...REQUIRED_FIELDS, "repairSubdivision"];
      //   break;
      // case ARM_CONTRACTOR_USER:
      //   requiresFields = [
      //     ...REQUIRED_FIELDS,
      //     "repairCenter",
      //     "repairSubdivision",
      //   ];
      //   break;
      // case ARM_MASTER_USER:
      //   requiresFields = [...REQUIRED_FIELDS, "repairCenter"];
      //   break;
      default:
        requiresFields = REQUIRED_FIELDS;
        break;
    }
    return null;
  });

  requiresFields.forEach((field) => {
    if (!values[field]) {
      if (field === "plainPassword" || field === "password1") {
        if (!isEdit) {
          errors[field] = "Введите значение";
        }
      } else {
        errors[field] = "Введите значение";
      }
    }
    if (field?.startsWith("plainPassword") && field?.startsWith("password1")) {
      errors[field] = "Введите значение";
    }
  });
  if (values.plainPassword || values.password1) {
    const validOtherSymbol = values.plainPassword && values.plainPassword.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/);
    const validNotReplay = values.plainPassword && values.plainPassword.match(/^(?:(.)(?!\1))*$/);
    if (!validOtherSymbol || !validNotReplay) {
      errors.plainPassword = `Пароль должен содержать буквы разных регистров и цифры.
      Минимально - 6 символов.`;
    }
    if (values.plainPassword !== values.password1) {
      errors.password1 = "Пароли не совпадают";
    }
  }
  return errors;
};

const UserForm = ({
  onSuccess = () => null,
  isView = false,
  isEdit = false,
  id,
  onEdit,
  onOpenAlert,
  organizationId,
  initialValuesUserForm,
}) => {
  const dispatch = useDispatch();

  const [initialValues, setInitialValues] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (id) fetchInitialValues();
    if (organizationId) {
      setInitialValues(initialValuesUserForm);
    }
  }, []);

  const fetchInitialValues = async () => {
    try {
      setLoading(true);
      const response = await loadUser(id);
      if (response.error) throw response;

      const roles = response.roles.filter((role) => ROLE_NAMING[role]).map((role) => ROLE_OPTIONS.find((item) => item.id === role));

      setInitialValues({
        ...response,
        enabled: getBooleanUser(response.enabled),
        roles: roles,
      });
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const checkEditClick = () => {
    onSuccess();
    onEdit(id);
  };

  const onSubmit = ({
    id,
    driver,
    organizations,
    organization,
    password1,
    enabled,
    roles,
    repairCenter,
    repairSubdivision,
    position,
    type,
    specialCargoHandlingTypes,
    subdivisionName,
    ...values
  }) => {
    const newValues = {
      ...values,
      driver: driver ? driver.id : null,
      organization: organizations.length ? organizations[0].id : null,
      organizations: organizations.length ? organizations.map((item) => item.id) : [],
      repairCenter: repairCenter ? repairCenter.id : null,
      repairSubdivision: repairSubdivision ? repairSubdivision.id : null,
      internalPhoneNumber: String(values?.internalPhoneNumber),
      position: position ? position.id : null,
      specialCargoHandlingTypes: specialCargoHandlingTypes ? specialCargoHandlingTypes?.map((item) => item.id) : [],
      subdivisionName: subdivisionName ? subdivisionName.name : null,
      subdivision: subdivisionName ? subdivisionName.id : null,

      enabled: true,
      roles: roles.map((role) => role.id),
    };

    if (isEdit) {
      return new Promise((resolve) => {
        dispatch(
          updateUser(newValues, id, {
            resolve: () => {
              resolve();
              onSuccess();
              openAlertForm(organizations);
            },
            reject: ({ error }) => {
              resolve({ [FORM_ERROR]: error });
              showError(onOpenAlert, error);
            },
          })
        );
      });
    }
    return new Promise((resolve) => {
      dispatch(
        createUser(newValues, {
          resolve: () => {
            resolve();
            onSuccess();
            openAlertForm(organizations);
          },
          reject: ({ error }) => {
            resolve({ [FORM_ERROR]: error });
            showError(onOpenAlert, error);
          },
        })
      );
    });
  };

  const openAlertForm = (organization) => {
    const activeOrganization = organization?.active;
    if (typeof activeOrganization === "boolean") {
      onOpenAlert("success", activeOrganization ? USER_SUCCESS_SAVE_MESSAGE_ACTIVE : USER_SUCCESS_SAVE_MESSAGE_NO_ACTIVE);
    }
  };

  const renderFields = (values = {}) => {
    return values?.roles?.map((option) => {
      switch (option.id) {
        // case ARM_CONTRACTOR_USER:
        //   return (
        //     <>
        //       <Field name="repairCenter">
        //         {({ input, meta }) => (
        //           <AsyncSelect
        //             input={input}
        //             meta={meta}
        //             label="Цех ремонта"
        //             variant="outlined"
        //             loadOptions={loadRepairCenters}
        //             onChange={(e, newValue) => {
        //               input.onChange(newValue);
        //             }}
        //             disabled={isView}
        //             fullWidth
        //             required
        //           />
        //         )}
        //       </Field>
        //       <Field name="repairSubdivision">
        //         {({ input, meta }) => (
        //           <AsyncSelect
        //             input={input}
        //             meta={meta}
        //             label="Подразделение"
        //             variant="outlined"
        //             loadOptions={loadRepairSubdivisions}
        //             onChange={(e, newValue) => {
        //               input.onChange(newValue);
        //             }}
        //             disabled={isView || organizationId}
        //             fullWidth
        //             required
        //           />
        //         )}
        //       </Field>
        //     </>
        //   );
        // case ARM_MASTER_USER:
        //   return (
        //     <Field name="repairCenter">
        //       {({ input, meta }) => (
        //         <AsyncSelect
        //           input={input}
        //           meta={meta}
        //           label="Цех ремонта"
        //           variant="outlined"
        //           loadOptions={loadRepairCenters}
        //           onChange={(e, newValue) => {
        //             input.onChange(newValue);
        //           }}
        //           disabled={isView || organizationId}
        //           fullWidth
        //           required
        //         />
        //       )}
        //     </Field>
        //   );
        default:
          return null;
      }
    });
  };

  // const disabledFieldGroups = (userType, organization) => {
  //   if (isView) return true;
  //   if (userType === ORGANIZATION_USER) return !organization;
  //   return !userType;
  // };

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit} validate={(values) => validate(values, isEdit)}>
      {({ handleSubmit, submitting, pristine, valid, form, values, submitError, dirtySinceLastSubmit }) => {
        const validSaveBtn = valid || dirtySinceLastSubmit;
        return (
          <form onSubmit={handleSubmit}>
            <LoadingBlock isLoading={loading}>
              <Box component="div" sx={STYLE_CONTENT_FORM}>
                <Field name="login" parse={parseEnglishLettersAndNumber}>
                  {({ input, meta }) => (
                    <Input
                      input={input}
                      meta={meta}
                      autoFocus={!isView}
                      label="Имя пользователя"
                      variant="outlined"
                      disabled={isView}
                      fullWidth
                      required
                    />
                  )}
                </Field>
                <Field name="patronymic">
                  {({ input, meta }) => (
                    <Input input={input} meta={meta} label="Фамилия" variant="outlined" disabled={isView} fullWidth required />
                  )}
                </Field>
                <Field name="name">
                  {({ input, meta }) => (
                    <Input input={input} meta={meta} label="Имя" variant="outlined" disabled={isView} fullWidth required />
                  )}
                </Field>
                <Field name="lastName">
                  {({ input, meta }) => (
                    <Input input={input} meta={meta} label="Отчество" variant="outlined" disabled={isView} fullWidth required />
                  )}
                </Field>
                <Field name="email" validate={composeValidators(email, required)}>
                  {({ input, meta }) => (
                    <Input input={input} meta={meta} label="Служебный Email" variant="outlined" disabled={isView} fullWidth required />
                  )}
                </Field>
                <Field name="phoneNumber" parse={parsePhone} validate={phoneNumber}>
                  {({ input, meta }) => (
                    <InputPhone input={input} meta={meta} label="Рабочий телефон" variant="outlined" fullWidth disabled={isView} />
                  )}
                </Field>

                {id ? (
                  <>
                    <DatePickerField name="employmentDate" autoFocus type="datetime" label="Дата приема на работу" fullWidth disabled />
                    <DatePickerField name="dismissalDate" autoFocus type="datetime" label="Дата увольнения с работы" fullWidth disabled />
                    <Field name="enabled">
                      {({ input, meta }) => (
                        <Input input={input} meta={meta} label="Статус Пользователя" variant="outlined" disabled fullWidth />
                      )}
                    </Field>
                  </>
                ) : null}
                <Field name="roles">
                  {({ input, meta }) => (
                    <Select
                      input={input}
                      meta={meta}
                      label="Тип пользователя"
                      options={ROLE_OPTIONS}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      variant="outlined"
                      onChange={(e, newValue) => {
                        input.onChange(newValue);
                        form.change("driver", "");
                        form.change("organizations", "");
                        form.change("repairCenter", "");
                        form.change("repairSubdivision", "");
                        form.change("groups", "");
                      }}
                      disabled={isView || organizationId}
                      fullWidth
                      multiple
                      sx={typeof values?.organization?.active === "boolean" ? { mb: "4px !important" } : {}}
                    />
                  )}
                </Field>
                {renderFields(form, values)}
                {!isView ? (
                  <>
                    <Field name="plainPassword">
                      {({ input, meta }) => (
                        <InputPassword
                          input={input}
                          meta={meta}
                          label="Пароль"
                          variant="outlined"
                          disabled={isView}
                          required={!isEdit}
                          fullWidth
                        />
                      )}
                    </Field>
                    <Field name="password1">
                      {({ input, meta }) => (
                        <InputPassword
                          input={input}
                          meta={meta}
                          label="Повторите пароль"
                          variant="outlined"
                          disabled={isView}
                          required={!isEdit}
                          fullWidth
                        />
                      )}
                    </Field>
                  </>
                ) : null}
              </Box>
            </LoadingBlock>
            {onEdit ? (
              <StackButton>
                {isView ? (
                  <Button variant="contained" color="primary" size="small" onClick={checkEditClick}>
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button
                      disabled={pristine || !validSaveBtn || isView}
                      loading={submitting}
                      variant="contained"
                      type="submit"
                      color="primary"
                      size="small"
                    >
                      Применить
                    </Button>
                    <Button
                      disabled={isView || pristine || submitting}
                      variant="outlined"
                      size="small"
                      onClick={form.reset}
                      color="inherit"
                    >
                      Сброс
                    </Button>
                  </>
                )}
              </StackButton>
            ) : null}
            {submitError && !dirtySinceLastSubmit && <FormHelperText error={submitError} />}
          </form>
        );
      }}
    </Form>
  );
};

export default withAlert(UserForm);
