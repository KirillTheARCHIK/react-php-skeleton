import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { clearRequest } from "actions/request";

import DeleteDialog from "components/Dialog/DeleteDialog";

const withDeleteDialog = (WrappedComponent) => {
  return (props) => {
    const dispatch = useDispatch();

    const request = useSelector((state) => state.request);

    const [name, setName] = React.useState("этот объект");
    const [description, setDescription] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [deleteAction, setDeleteAction] = React.useState({ func: null });

    React.useEffect(() => {
      if (request.error) {
        props.onOpenAlert("error", request.error);
      }
    }, [request]);

    const onCloseDeleteDialog = () => {
      setIsOpen(false);
      dispatch(clearRequest());
    };

    const onOpenDeleteDialog = (deleteAction, name = "этот объект", description = "") => {
      setIsOpen(true);
      setName(name);
      setDescription(description);
      setDeleteAction({ func: deleteAction });
    };

    const onDelete = () => {
      if (deleteAction.func) {
        deleteAction.func();
      }
      onCloseDeleteDialog();
    };

    return (
      <>
        <WrappedComponent onOpenDeleteDialog={onOpenDeleteDialog} {...props} />
        <DeleteDialog handleCloseOk={onDelete} handleClose={onCloseDeleteDialog} isOpen={isOpen} name={name} description={description} />
      </>
    );
  };
};

export default withDeleteDialog;
