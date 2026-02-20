import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Stack,
  Box,
} from "@mui/material";
import Button from "components/Button";

const SettingsTable = ({
  columns,
  open,
  checkedColumns,
  expandedTableRows,
  onClick,
  onClose,
  onSave,
  onClickExpandedTableRows,
}) => {
  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        style: { borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
      }}
    >
      <List
        sx={{
          width: 325,
          height: "100%",
          bgcolor: "background.paper",
          p: "24px 20px",
        }}
      >
        <Box
          component="div"
          sx={{
            textAlign: "center",
            mb: "18px",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Настройки таблицы
        </Box>
        <ListItem disablePadding>
          <ListItemButton
            role={undefined}
            dense
            sx={{ p: 0 }}
            onClick={onClickExpandedTableRows}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              <Checkbox
                edge="start"
                checked={expandedTableRows}
                tabIndex={-1}
                disableRipple
                inputProps={{ "aria-labelledby": "expanded" }}
              />
            </ListItemIcon>
            <ListItemText id="expanded" primary="Раскрытие описания у строк" />
          </ListItemButton>
        </ListItem>
        <Box
          component="div"
          sx={{
            textAlign: "center",
            mb: "18px",
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          Отображение столбцов
        </Box>

        <Box
          component="div"
          sx={{ height: "calc(100% - 170px)", overflow: "auto" }}
        >
          {columns.map(({ id, label }) => {
            return (
              <ListItem key={id} disablePadding>
                <ListItemButton
                  role={undefined}
                  dense
                  onClick={() => onClick(id)}
                  sx={{ p: 0 }}
                >
                  <ListItemIcon sx={{ minWidth: 0 }}>
                    <Checkbox
                      edge="start"
                      checked={checkedColumns.includes(id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": id }}
                    />
                  </ListItemIcon>
                  <ListItemText id={id} primary={label} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </Box>
        <Stack spacing={1} direction="row" justifyContent="center" pt="25px">
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="contained" onClick={onSave}>
            Сохранить
          </Button>
        </Stack>
      </List>
    </Drawer>
  );
};

SettingsTable.defaultProps = {
  open: false,
  columns: [],
  checkedColumns: [],
  onClick: () => {},
  onClose: () => {},
  onSave: () => {},
};

export default SettingsTable;
