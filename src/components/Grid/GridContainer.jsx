import React from "react";
import { Grid } from "@mui/material";

const GridContainer = ({ rowSpacing, columnSpacing, children }) => {
  return (
    <Grid
      container
      rowSpacing={rowSpacing}
      columnSpacing={columnSpacing}
      sx={{
        pt: 1,
        ".MuiGrid-item": {
          pt: 0,
        },
      }}
    >
      {children}
    </Grid>
  );
};

GridContainer.defaultProps = {
  rowSpacing: 1,
  columnSpacing: { xs: 1, sm: 2, md: 3 },
};

export default GridContainer;
