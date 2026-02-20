import * as React from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Typography } from "@mui/material";

import { LIGHT_THEME } from "constants/themes";

const BasicBreadcrumbs = ({ customBreadcrumbs, ...props }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      {...props}
      sx={{
        color: (theme) =>
          theme.palette.mode === LIGHT_THEME ? "#004E9E" : "#EA973E",
      }}
    >
      <Box underline="hover" color="inherit" href="/">
        Паспорт работ
      </Box>
      <Typography sx={customBreadcrumbs ? {} : { color: "text.primary" }}>
        Дешифрирование
      </Typography>
      {customBreadcrumbs ? (
        <Typography sx={{ color: "text.primary" }}>
          {customBreadcrumbs}
        </Typography>
      ) : null}
    </Breadcrumbs>
  );
};

export default BasicBreadcrumbs;
