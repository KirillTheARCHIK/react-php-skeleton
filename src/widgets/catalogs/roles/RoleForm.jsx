import React from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "store/hooks";
import { Field, Form } from "react-final-form";
import { FORM_ERROR } from "final-form";
import { Box, ToggleButton, ToggleButtonGroup, Stack } from "@mui/material";

import { createRole, updateRole } from "actions/catalogs/roles";
import { loadRole } from "services/catalogs/roles";

import LoadingBlock from "components/LoadingBlock";
import Button from "components/Button";
import Input from "components/FormFields/Input";
import Select from "components/FormFields/Select";

import IconButton from "components/IconButton";
import withAlert from "components/HOC/withAlert";
import RoleTable from "./RoleTable";

import { required } from "helpers/formValidators";
import { getStartPages } from "helpers/roles";
import { showError } from "helpers/error";
import { buildRoutes } from "helpers/routes";
import { buildMenu } from "helpers/menu";

import { MONITORING } from "constants/routes";
import { ROLE_VIEW } from "constants/roles";

const RoleForm = ({ roleId, isView, isEdit, onOpenAlert }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [valueToggleButtonGroup, setValueToggleButtonGroup] = React.useState(MONITORING);
  const [initialValues, setInitialValues] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [rolesForm, setRolesForm] = React.useState([]);

  const userRoles = useSelector((state) => state.auth.roles);

  React.useEffect(() => {
    if (roleId) fetchInitialValues();
  }, []);

  const fetchInitialValues = async () => {
    try {
      setLoading(true);
      const response = await loadRole(roleId);
      if (response.error) throw response;
      const userRole = userRoles.find((item) => item.key === response.startPage.key);
      setInitialValues({
        ...response,
        startPage: { ...userRole, id: userRole.key, label: userRole.name },
      });
      setRolesForm(response.roles);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleChangeToggleButtonGroup = (event, newValue) => {
    if (newValue !== null) {
      setValueToggleButtonGroup(newValue);
    }
  };

  const renderTitle = () => {
    if (isView) return "Просмотр роли";
    if (isEdit) return "Редактирование роли";
    return "Создание роли";
  };

  const goBack = () => {
    history.goBack();
  };

  const renderFormContent = (submitting, validSaveBtn) => {
    const routes = buildMenu(buildRoutes(userRoles));

    return (
      <>
        <Box component="div" sx={{ width: 1200 }}>
          <Stack direction="row" spacing={1} sx={{ maxHeight: 72 }}>
            <Field name="name" validate={required}>
              {({ input, meta }) => (
                <Input
                  input={input}
                  meta={meta}
                  variant="outlined"
                  label="Название роли"
                  size="small"
                  fullWidth
                  required
                  disabled={isView}
                />
              )}
            </Field>
            <Field name="startPage" validate={required}>
              {({ input, meta }) => (
                <Select
                  input={input}
                  meta={meta}
                  label="Стартовая страница"
                  variant="outlined"
                  size="small"
                  options={getStartPages(userRoles)}
                  disabled={isView}
                  fullWidth
                  required
                />
              )}
            </Field>
          </Stack>
          {renderToggleGroups(routes, submitting, validSaveBtn)}
        </Box>
        <Box
          component="div"
          sx={{
            maxHeight: "calc(100vh - 250px)",
            overflow: "auto",
            pr: 1,
            pl: 1,
          }}
        >
          {renderTable(routes)}
        </Box>
      </>
    );
  };

  const disabledSaveButton = (validSaveBtn) => {
    if (!rolesForm.length) {
      return true;
    }
    return !validSaveBtn;
  };

  const renderToggleGroups = (routes, submitting, validSaveBtn) => {
    return (
      <Box
        component="div"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <ToggleButtonGroup
          exclusive
          color="primary"
          value={valueToggleButtonGroup}
          onChange={handleChangeToggleButtonGroup}
          aria-label="role"
        >
          {routes.map((item) => (
            <ToggleButton key={item.id} value={item.id} sx={{ width: "auto" }}>
              {item.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {!isView ? (
          <Button
            disabled={disabledSaveButton(validSaveBtn)}
            loading={submitting}
            variant="contained"
            type="submit"
            color="primary"
            size="small"
          >
            Сохранить
          </Button>
        ) : null}
      </Box>
    );
  };

  const renderTable = (routes) => {
    const itemRoute = routes.find((item) => item.id === valueToggleButtonGroup);
    return (
      <>
        {itemRoute.childs.map((item) => {
          const filterChilds = item.childs.filter((el) => !el.roles.includes("IS_AUTHENTICATED"));
          if (filterChilds.length) {
            return (
              <Box component="div" sx={{ mb: 2 }}>
                <Box component="div" sx={{ mb: 1, fontWeight: 700, position: "sticky" }}>
                  {item.name}
                </Box>
                <RoleTable isView={isView} rows={filterChilds} rolesForm={rolesForm} setRolesForm={setRolesForm} tableId={item.id} />
              </Box>
            );
          }
          return null;
        })}
      </>
    );
  };

  const onSubmit = ({ name, startPage, participant }) => {
    const roleKeyView = startPage.roles.find((el) => el.includes(ROLE_VIEW));
    const available = rolesForm.includes(roleKeyView);

    if (!available) {
      onOpenAlert("error", `Для стартовой страницы "${startPage.label}" не выбрана роль "Просмотр", поэтому справочник будет недоступен`);
    } else {
      const newValues = {
        name,
        startPage: { key: startPage.key, value: startPage.name },
        roles: rolesForm,
        participant: participant ? participant.id : null,
      };
      if (isEdit) {
        return new Promise((resolve) => {
          dispatch(
            updateRole(newValues, roleId, {
              resolve: () => {
                resolve();
                goBack();
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
          createRole(newValues, {
            resolve: () => {
              resolve();
              goBack();
            },
            reject: ({ error }) => {
              resolve({ [FORM_ERROR]: error });
              showError(onOpenAlert, error);
            },
          })
        );
      });
    }
  };

  return (
    <Form initialValues={initialValues} onSubmit={onSubmit}>
      {({ handleSubmit, submitting, valid, dirtySinceLastSubmit }) => {
        const validSaveBtn = valid || dirtySinceLastSubmit;
        return (
          <>
            <Box component="div" sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <IconButton name="arrowBack" title="Вернуться назад" color="secondary" sx={{ mr: 1, p: 0 }} onClick={goBack} />
              <Box component="div">{renderTitle()}</Box>
            </Box>
            <form onSubmit={handleSubmit}>
              <LoadingBlock isLoading={loading}>
                <Box component="div">{renderFormContent(submitting, validSaveBtn)}</Box>
              </LoadingBlock>
            </form>
          </>
        );
      }}
    </Form>
  );
};

export default withAlert(RoleForm);
