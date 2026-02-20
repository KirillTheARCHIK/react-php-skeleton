import React from "react";
import { useDispatch, useSelector } from "store/hooks";

import { setPagination, setSearch } from "actions/requestParams";

import TreeView from "components/TreeView";
import InputSearch from "components/FormFields/InputSearch";
import { debounce } from "helpers/debounce";

const TreeViewWithSearchChilds = ({ total, data, childs, loading, onClickTreeItem, reducerKey, loadData }) => {
  const dispatch = useDispatch();

  const requestParams = useSelector((state) => state.requestParams[reducerKey] ?? {});

  const { searchParams = {} } = requestParams;

  const isSearch = Object.keys(searchParams).length;

  const fetch = (event) => {
    const value = event.target.value;
    const params = { limit: 100 };
    if (value) {
      params["search"] = value;
      dispatch(setPagination({ page: 1, limit: 100 }, reducerKey));
      dispatch(setSearch({ search: value }, reducerKey));
    } else {
      dispatch(setSearch({}, reducerKey));
    }
    dispatch(loadData(params));
  };

  const handleChange = React.useCallback(debounce(fetch), []);

  const renderTotal = () => {
    return isSearch ? childs.length : total;
  };

  const renderData = () => {
    return isSearch ? [] : data;
  };

  const renderChilds = () => {
    if (isSearch) {
      return childs.map((child) => {
        return { ...child, parentId: null, childrenCount: 0 };
      });
    }
    return childs;
  };

  return (
    <>
      <InputSearch fullWidth sx={{ mb: 1 }} onChange={handleChange} />
      <TreeView
        total={renderTotal()}
        data={renderData()}
        childs={renderChilds()}
        loading={loading}
        onClickTreeItem={onClickTreeItem}
        isSearch={isSearch}
        sx={{ height: "calc(100% - 34px)" }}
      />
    </>
  );
};

export default TreeViewWithSearchChilds;
