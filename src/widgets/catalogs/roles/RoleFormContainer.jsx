import React from "react";
import { useParams } from "react-router-dom";
import withAlert from "components/HOC/withAlert";
import RoleForm from "./RoleForm";

const RoleFormContainer = ({ isView, isEdit, onOpenAlert }) => {
  const { roleId } = useParams();

  return (
    <RoleForm
      roleId={roleId}
      isView={isView}
      isEdit={isEdit}
      onOpenAlert={onOpenAlert}
    />
  );
};

export default withAlert(RoleFormContainer);
