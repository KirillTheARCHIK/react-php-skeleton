import React from "react";

import ConfirmDialog from "components/Dialog/ConfirmDialog";

const withConfirmDialog = (WrappedComponent) => {
  return (props) => {
    const [title, setTitle] = React.useState("");
    const [isOpen, setIsOpen] = React.useState(false);
    const [action, setAction] = React.useState({ func: null });

    const onCloseDialog = () => {
      setIsOpen(false);
    };

    const onOpenDialog = (actionDialog, title = "") => {
      setIsOpen(true);
      setAction({ func: actionDialog });
      setTitle(title);
    };

    const onAction = () => {
      if (action.func) {
        action.func();
      }
      onCloseDialog();
    };

    return (
      <>
        <WrappedComponent onOpenDialog={onOpenDialog} {...props} />
        <ConfirmDialog
          handleOk={onAction}
          handleClose={onCloseDialog}
          isOpen={isOpen}
          title={title}
        />
      </>
    );
  };
};

export default withConfirmDialog;
