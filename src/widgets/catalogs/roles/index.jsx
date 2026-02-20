import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "store/hooks";

import { initParams, resetParams } from "actions/requestParams";
import { loadRoles, deleteRole } from "actions/catalogs/roles";
import { setAllCheckedCheckboxes } from "actions/checkboxes";

import CatalogContent from "components/Catalog/CatalogContent";

import { getStartPages } from "helpers/roles";
import { getInitialValuesStatePage } from "helpers/requestParams";

const RolesWidget = ({ routeId, routeName, routePath }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const data = useSelector((state) => state.roles);
  const requestParams = useSelector((state) => state.requestParams.roles);
  const userRoles = useSelector((state) => state.auth.roles);

  useEffect(() => {
    dispatch(loadRoles(getInitialValuesStatePage()));
  }, [dispatch]);

  useEffect(() => {
    dispatch(initParams("roles"));
    return () => dispatch(resetParams());
  }, [dispatch]);

  const onAdd = () => {
    history.push(`${routePath}/create`);
  };

  const onView = (id) => {
    history.push(`${routePath}/${id}/view`);
  };
  const onEdit = (id) => {
    history.push(`${routePath}/${id}/edit`);
  };
  const onDelete = (id, isAll) => {
    dispatch(deleteRole(id, isAll));
    dispatch(setAllCheckedCheckboxes(false));
  };
  const columns = [
    { id: "name", label: "Наименование" },
    {
      id: "startPage",
      label: "Стартовая страница",
      format: (row) => row?.value,
      field: {
        type: "select",
        options: getStartPages(userRoles),
      },
    },
  ];

  if (requestParams)
    return (
      <CatalogContent
        routeId={routeId}
        columns={columns}
        data={data}
        onAdd={onAdd}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        title={routeName}
        loadData={loadRoles}
        reducerKey={"roles"}
        withSettingsTable={false}
      />
    );
  return null;
};

export default RolesWidget;
