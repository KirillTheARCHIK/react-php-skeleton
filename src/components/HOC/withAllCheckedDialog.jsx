import { useCallback, useState } from "react";
import AllCheckedDialog from "components/Dialog/AllCheckedDialog";

export const withAllCheckedDialog = (WrappedComponent) => {
  return (props) => {
    const [allCheckedIsOpen, setAllCheckedIsOpen] = useState(false);
    const handleAllCheckedOpen = useCallback(() => {
      setAllCheckedIsOpen(true);
    }, []);

    const handleAllCheckedClose = useCallback(() => {
      setAllCheckedIsOpen(false);
    }, []);
    return (
      <>
        <WrappedComponent
          handleAllCheckedOpen={handleAllCheckedOpen}
          {...props}
        />
        <AllCheckedDialog
          handleClose={handleAllCheckedClose}
          isOpen={allCheckedIsOpen}
        />
      </>
    );
  };
};
