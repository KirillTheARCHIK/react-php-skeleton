import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "store/hooks";
import { setAllCheckedCheckboxes } from "actions/checkboxes";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "components/IconButton";

const AllCheckedDialog = ({ isOpen, handleClose }) => {
  const dispatch = useDispatch();
  const checkedEntries = useSelector((state) => state.checkedCheckboxes.entries);
  const checkedEntriesCount = useMemo(() => Object.values(checkedEntries).flat().length, [checkedEntries]);
  const onAllChecked = useCallback(() => {
    dispatch(setAllCheckedCheckboxes(true));
    handleClose();
  }, [dispatch, handleClose]);
  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogActions sx={{ p: 2 }}>
        <Typography sx={{ mr: 2 }}>{checkedEntriesCount ? `Выбрано ${checkedEntriesCount} записей` : "Данных нет"}</Typography>
        {checkedEntriesCount ? (
          <Button onClick={onAllChecked} color="primary" variant="contained">
            Выбрать все записи
          </Button>
        ) : null}
        <IconButton name="cancel" title="Закрыть" size="small" onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};

export default AllCheckedDialog;
