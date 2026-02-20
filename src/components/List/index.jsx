import React, { Fragment, useEffect } from "react";
import { Box, Divider, List as MuiList } from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import CircularLoading from "components/CircularLoading";

import Button from "components/Button";
import { MODAL_STATE } from "components/Modal";

import { useDispatch } from "react-redux";
import { modalSlice } from "store/utility/modalSlice";

const List = ({ total, data, loading, onClick, activeItem, customSx, visibleButton }) => {
  const [selected, setSelected] = React.useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    setSelected(Number(activeItem));
  }, []);

  const renderSubheader = () => {
    if (total) {
      return null;
    }
    return (
      <Box component="div" fontSize={14}>
        Нет данных
      </Box>
    );
  };
  const onApproves = () => {
    dispatch(modalSlice.actions.openModal({ modalName: "decryption-modal", modalState: MODAL_STATE.OPENED }));
  };
  return (
    <>
      {loading ? <CircularLoading top={50} left={15} /> : null}
      <MuiList
        sx={{
          flexGrow: 1,
          width: "100%",
          height: "calc(100% - 34px)",
          padding: 0,
          overflow: "auto",
          filter: loading ? "blur(5px)" : "none",
          ...customSx,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={renderSubheader()}
      >
        {data.map((item) => {
          return (
            <Fragment key={item.id}>
              <ListItemButton
                selected={selected === item.id}
                onClick={() => {
                  setSelected(item.id);
                  onClick(item.id);
                }}
              >
                <ListItemText primary={item.displayName} primaryTypographyProps={{ fontSize: 14 }} />
                {selected === item.id && visibleButton ? (
                  <Button variant="contained" size="small" color="primary" type="submit" onClick={onApproves} sx={{ width: "auto" }}>
                    Дешифрировать
                  </Button>
                ) : null}
              </ListItemButton>
              <Divider />
            </Fragment>
          );
        })}
      </MuiList>
    </>
  );
};

List.defaultProps = {
  total: 0,
  data: [],
  loading: false,
  activeItem: null,
  onClick: () => {},
};

export default List;
