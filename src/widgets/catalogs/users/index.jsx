import React, { useEffect } from "react";
import { useDispatch, useSelector } from "store/hooks";

import { initParams, resetParams } from "actions/requestParams";
import { loadUsers, deleteUser } from "actions/catalogs/users";
import { setAllCheckedCheckboxes } from "actions/checkboxes";

import { URL } from "services/catalogs/users";

import { MODAL_STATE } from "components/Modal";
import CatalogContent from "components/Catalog/CatalogContent";
import UserFormModal, { MODAL_NAME } from "./UserFormModal";

import { getInitialValuesStatePage } from "helpers/requestParams";

import { USERS_COLUMNS } from "constants/columns";
import { impersonateUser } from "actions/login";

const UsersWidget = ({ routeId, routeName }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const requestParams = useSelector((state) => state.requestParams.users);

  const extraActions = (rowId, row) => {
    if (rowId !== currentUser.id && currentUser?.canImpersonate) {
      return [
        {
          name: "impersonate",
          label: "Авторизоваться как",
          onClick: () => dispatch(impersonateUser({ username: row?.login })),
        },
      ];
    }
    return [];
  };

  useEffect(() => {
    dispatch(loadUsers(getInitialValuesStatePage()));
  }, [dispatch]);

  useEffect(() => {
    dispatch(initParams("users"));
    return () => dispatch(resetParams());
  }, [dispatch]);

  const onAdd = () => {
    dispatch(modalSlice.actions.openModal({ modalName: MODAL_NAME, modalState: MODAL_STATE.OPENED }));
  };

  const onView = (id) => {
    dispatch(
      modalSlice.actions.openModal({
        modalName: MODAL_NAME,
        modalState: MODAL_STATE.IS_VIEW,
        data: {
          id: id,
        },
      })
    );
  };
  const onEdit = (id) => {
    dispatch(
      modalSlice.actions.openModal({
        modalName: MODAL_NAME,
        modalState: MODAL_STATE.IS_EDIT,
        data: {
          id: id,
        },
      })
    );
  };
  const onDelete = (id, isAll) => {
    dispatch(deleteUser(id, isAll));
    dispatch(setAllCheckedCheckboxes(false));
  };

  if (requestParams)
    return (
      <>
        <CatalogContent
          routeId={routeId}
          columns={USERS_COLUMNS}
          data={data}
          onAdd={onAdd}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          title={routeName}
          loadData={loadUsers}
          url={URL}
          reducerKey={"users"}
          extraActions={extraActions}
        />
        <UserFormModal onEdit={onEdit} />
      </>
    );

  return null;
};

export default UsersWidget;
