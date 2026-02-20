import React from "react";
import { Grid } from "@mui/material";

const GridItem = ({ xs, children }) => {
  return (
    <Grid item xs={xs}>
      {children}
    </Grid>
  );
};

GridItem.defaultProps = {
  xs: 6,
};

export default GridItem;
