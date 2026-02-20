import React from "react";

import { useDispatch } from "react-redux";

import InputSearch from "components/FormFields/InputSearch";
import List from "./index";

import { debounce } from "helpers/debounce";
import { Box } from "@mui/material";

const ListWithSearch = ({
  total,
  data,
  loading,
  onClick,
  loadData,
  activeItem,
  visibleButton,
}) => {
  const dispatch = useDispatch();

  const fetch = (event) => {
    const value = event.target.value;

    const params = { limit: 100 };
    if (value) {
      params["search"] = value;
    }
    dispatch(loadData(params));
  };

  const handleChange = React.useCallback(debounce(fetch), []);

  return (
    <>
      <InputSearch fullWidth sx={{ mb: 1 }} onChange={handleChange} />
      <Box sx={{ marginLeft: "15px" }}>ЖД Станции</Box>
      <List
        total={total}
        data={data}
        loading={loading}
        onClick={onClick}
        activeItem={activeItem}
        customSx={{ height: "calc(100% - 95px)" }}
        visibleButton={visibleButton}
      />
    </>
  );
};

export default ListWithSearch;
