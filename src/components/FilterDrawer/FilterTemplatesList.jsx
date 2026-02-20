import React from "react";
import { useDispatch, useSelector } from "store/hooks";
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Typography, TablePagination } from "@mui/material";

import LoadingBlock from "components/LoadingBlock";
import IconButton from "components/IconButton";
import { FILTER_FORM } from "components/FilterDrawer";
import withDeleteDialog from "components/HOC/withDeleteDialog";

import { loadFilterTemplatesByCatalogSlug, deleteFilterTemplate } from "actions/filterTemplates";
import { INITIAL_VALUES_STATE_PAGE } from "constants/request";
import { getLabelDisplayedRows } from "helpers/pagination";
import { initParams, setPagination } from "actions/requestParams";

const FilterTemplatesList = ({ catalogSlug, setFilterType, setFilterTemplateId, onOpenDeleteDialog }) => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.filterTemplates);
  const requestParams = useSelector((state) => state.requestParams.filterTemplates);

  React.useEffect(() => {
    dispatch(loadFilterTemplatesByCatalogSlug(catalogSlug, INITIAL_VALUES_STATE_PAGE));
  }, []);

  React.useEffect(() => {
    dispatch(initParams("filterTemplates"));
  }, [dispatch]);

  const handleDeleteFilterTemplate = (id) => {
    onOpenDeleteDialog(() => {
      dispatch(deleteFilterTemplate(id, catalogSlug));
    }, "этот шаблон");
  };

  const handleChangePage = (event, newPage) => {
    const pagination = { ...requestParams.paginationParams, page: newPage + 1 };

    dispatch(loadFilterTemplatesByCatalogSlug(catalogSlug, pagination));
    dispatch(setPagination({ ...requestParams.paginationParams, page: newPage + 1 }, "filterTemplates"));
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const initialPage = 1;
    const pagination = {
      ...requestParams.paginationParams,
      page: initialPage,
      limit: newRowsPerPage,
    };

    dispatch(loadFilterTemplatesByCatalogSlug(catalogSlug, pagination));
    dispatch(setPagination({ page: initialPage, limit: newRowsPerPage }, "filterTemplates"));
  };

  if (requestParams) {
    return (
      <LoadingBlock isLoading={data.loading}>
        {data.total ? (
          <Box>
            <List>
              <Box component="div" sx={{ height: "calc(100vh - 190px)", overflow: "auto" }}>
                {data.entries.map(({ id, filterName }) => {
                  return (
                    <ListItem key={id} disablePadding sx={{ display: "flex", alignItems: "baseline", mb: 1 }}>
                      <ListItemButton
                        dense
                        role={undefined}
                        onClick={() => {
                          setFilterType(FILTER_FORM);
                          setFilterTemplateId(id);
                        }}
                        sx={{
                          height: 46,
                          border: "1px solid #D3D3D3",
                          borderRadius: "5px",
                          mr: 1,
                        }}
                      >
                        <ListItemText
                          id={id}
                          primary={filterName}
                          sx={{
                            ".MuiTypography-root": {
                              fontWeight: 700,
                            },
                          }}
                        />
                      </ListItemButton>
                      <ListItemIcon sx={{ minWidth: 0 }}>
                        <IconButton name="delete" color="primary" onClick={() => handleDeleteFilterTemplate(id)} />
                      </ListItemIcon>
                    </ListItem>
                  );
                })}
              </Box>
            </List>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={data.total}
              rowsPerPage={requestParams.paginationParams.limit}
              page={requestParams.paginationParams.page - 1}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Строк на странице"
              labelDisplayedRows={getLabelDisplayedRows}
              sx={{
                overflow: "hidden",
                "& .MuiToolbar-root": {
                  pl: 0,
                },
              }}
            />
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Шаблоны отсутствуют
          </Typography>
        )}
      </LoadingBlock>
    );
  }
  return null;
};

export default withDeleteDialog(FilterTemplatesList);
