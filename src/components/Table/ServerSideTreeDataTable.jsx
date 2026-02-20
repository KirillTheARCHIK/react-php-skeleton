import * as React from "react";
import { useDispatch, useSelector } from "store/hooks";

import Paper from "@mui/material/Paper";
import { styled, Table } from "@mui/material";

import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { TreeView as MuiTreeView } from "@mui/x-tree-view";
import TreeItem, { treeItemClasses } from "@mui/x-tree-view";
import { alpha } from "@mui/material/styles";

import { setPagination } from "actions/requestParams";
import CircularLoading from "components/CircularLoading";
import Icon from "components/Icon";
import ShowMoreTextComponent from "components/ShowMoreText";

import { isShowMoreText } from "helpers/showMoreText";
import { LIGHT_THEME } from "constants/themes";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#202020",
  },
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#F5F5F5" : "#1B1A1A",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    textAlign: "left",
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: theme.palette.mode === LIGHT_THEME ? "#F9F9F9" : "#1B1A1A",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    borderBottom: "none",
  },
}));

const StyledTreeItem = styled((props) => <TreeItem {...props} />)(({ theme }) => ({
  [`& .${treeItemClasses.root}`]: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#202020",
    },
    "&:nth-of-type(even)": {
      backgroundColor: theme.palette.mode === LIGHT_THEME ? "#F5F5F5" : "#1B1A1A",
    },
    [`& .${treeItemClasses.content}`]: {
      fontSize: 14,
    },
  },

  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 1,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

const getColumnValue = (column, value) => {
  const columnValue = column.format ? column.format(value) : value;
  if (isShowMoreText(columnValue)) {
    return <ShowMoreTextComponent>{columnValue}</ShowMoreTextComponent>;
  }
  return columnValue;
};

const renderTreeItemLabel = (columns, row) => {
  return (
    <Table>
      <TableBody>
        <TableRow>
          {columns.map((column) => {
            return (
              <StyledTableCell key={column.id} sx={{ minWidth: 160 }} width={160}>
                {getColumnValue(column, row[column.id])}
              </StyledTableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
};

const RowTreeItem = ({ columns, row, index, onView }) => {
  return (
    <StyledTreeItem
      nodeId={`${index}`}
      label={renderTreeItemLabel(columns, row)}
      sx={{
        "& .MuiTreeItem-content": {
          p: "0 0 0 16px",
          borderBottom: (theme) =>
            theme.palette.mode === LIGHT_THEME ? "1px solid rgba(224, 224, 224, 1)" : "1px solid rgba(81, 81, 81, 1)",
        },
      }}
    >
      {row.children &&
        row.children.map((item, i) => {
          const disabledRow = item?.active === false ? true : false;
          if (item.children) {
            return <RowTreeItem key={`${index}_${i}`} row={item} index={`${index}_${i}`} columns={columns} />;
          }
          return (
            <React.Fragment key={`${index}_${i}`}>
              <StyledTreeItem
                nodeId={`${index}_${i}`}
                label={renderTreeItemLabel(columns, item)}
                onDoubleClick={() => (onView && !disabledRow ? onView(item.id) : null)}
                sx={
                  disabledRow
                    ? {
                        backgroundColor: (theme) => (theme.palette.mode === LIGHT_THEME ? "#d3d3d3 !important" : "#808080 !important"),
                      }
                    : {}
                }
              />
            </React.Fragment>
          );
        })}
    </StyledTreeItem>
  );
};

const ServerSideTreeDataTable = ({
  loading,
  columns,
  loadData,
  total,
  data,
  buildTree,
  getBuildParams,
  reducerKey,
  onView,
  styleTableContainer,
  circularLoadingTop = 40,
}) => {
  const dispatch = useDispatch();

  const requestParams = useSelector((state) => state.requestParams[reducerKey]);
  const { paginationParams, filterParams } = requestParams;

  const handleChangePage = (event, newPage) => {
    const pagination = { ...paginationParams, page: newPage + 1 };

    const filter = getBuildParams(filterParams);
    dispatch(
      loadData({
        ...pagination,
        ...filter,
      })
    );

    dispatch(
      setPagination(
        {
          ...paginationParams,
          page: newPage + 1,
        },
        reducerKey
      )
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    const initialPage = 1;

    const pagination = {
      ...paginationParams,
      page: initialPage,
      limit: newRowsPerPage,
    };

    const filter = getBuildParams(filterParams);
    dispatch(loadData({ ...pagination, ...filter }));

    dispatch(setPagination({ page: initialPage, limit: newRowsPerPage }, reducerKey));
  };

  const getLabelDisplayedRows = ({ from, to, count }) => {
    return `${from}–${to} из ${count}`;
  };

  return (
    <Paper
      sx={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: 4,
        border: "1px solid #E0E7ED",
      }}
    >
      {loading ? <CircularLoading top={circularLoadingTop} /> : null}
      <TableContainer
        sx={{
          maxHeight: "calc(100vh - 245px)",
          ...styleTableContainer,
        }}
      >
        <Table stickyHeader aria-label="tree table">
          <TableHead>
            <TableRow>
              <StyledTableCell padding="checkbox" />
              {columns.map((column) => {
                return (
                  <StyledTableCell key={column.id} sx={{ minWidth: 160 }} width={160}>
                    {column.label}
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{ filter: loading ? "blur(5px)" : "none" }}>
            {total ? (
              <StyledTableRow>
                <StyledTableCell colSpan={columns.length + 1} style={{ padding: 0 }} align="center">
                  <MuiTreeView
                    aria-label="tree view"
                    defaultCollapseIcon={<Icon name="expandLess" color="primary" />}
                    defaultExpandIcon={<Icon name="expandMore" color="primary" />}
                    sx={{
                      height: "100%",
                      overflowY: "auto",
                    }}
                  >
                    {buildTree(data).map((row, index) => (
                      <RowTreeItem key={row.id} row={row} columns={columns} index={index} onView={onView} />
                    ))}
                  </MuiTreeView>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              <StyledTableRow key="no-data">
                <StyledTableCell colSpan={columns.length + 1} align="center">
                  Нет данных
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[100, 500, 1000]}
        component="div"
        count={total}
        rowsPerPage={paginationParams.limit}
        page={paginationParams.page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Строк на странице"
        labelDisplayedRows={getLabelDisplayedRows}
      />
    </Paper>
  );
};

export default ServerSideTreeDataTable;
