import React from "react";
import { useDispatch, useSelector } from "store/hooks";

import { setPagination, setSearch } from "actions/requestParams";

import TreeView from "components/TreeView";
import InputSearch from "components/FormFields/InputSearch";
import { debounce } from "helpers/debounce";

const TreeViewWithSearch = ({ total, data, childs, loading, onClickTreeItem, loadData, searchData, reducerKey, resetRoute }) => {
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
    resetRoute();
  };

  const handleChange = React.useCallback(debounce(fetch), []);

  const renderTotal = () => {
    if (isSearch) {
      return searchData?.total ?? 0;
    }
    return total;
  };

  const renderData = () => {
    if (isSearch) {
      const entries = searchData?.entries ?? [];
      const newData = entries
        .map(({ group }) => ({ ...group, name: group.displayName }))
        .filter((el, i, a) => a.findIndex((t) => t.id === el.id) === i);

      return newData;
    }
    return data;
  };

  const renderChilds = () => {
    if (isSearch) {
      const entries = searchData?.entries ?? [];
      return entries.map((item) => ({
        ...item,
        parentId: item.group.id,
      }));
    }
    return childs;
  };

  const renderLoading = () => {
    if (isSearch) {
      return searchData?.loading ?? false;
    }
    return loading;
  };

  return (
    <>
      <InputSearch fullWidth sx={{ mb: 1 }} onChange={handleChange} />
      <TreeView
        total={renderTotal()}
        data={renderData()}
        childs={renderChilds()}
        loading={renderLoading()}
        onClickTreeItem={onClickTreeItem}
        isSearch={isSearch}
        searchValue={searchParams.search}
        sx={{ height: "calc(100% - 34px)" }}
      />
    </>
  );
};

export default TreeViewWithSearch;
