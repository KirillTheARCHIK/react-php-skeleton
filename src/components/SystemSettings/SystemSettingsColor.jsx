import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  Typography,
} from "@mui/material";

import Icon from "components/Icon";
import { SystemSettingsPopoverColor } from "./SystemSettingsPopoverColor";

const SystemSettingsColor = ({ values = {}, fields = [], form, data = {} }) => {
  const availabilityColors =
    Object.values(data.values.tech_taxi.availability_colors) || [];
  return fields.map((value) => (
    <Accordion
      sx={{
        width: "400px",
        boxShadow: "none",
      }}
    >
      <AccordionSummary expandIcon={<Icon name={"expandMoreMui"} />}>
        <Typography sx={{ fontWeight: 700 }}>{value.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {value.children.map((value) => (
          <Box key={value.id} sx={{ marginBottom: "16px" }}>
            <Grid container alignItems="center" gap={2}>
              <Grid item xs>
                <Typography gutterBottom component="div">
                  {value.label}
                </Typography>
              </Grid>
              <Grid item>
                <SystemSettingsPopoverColor
                  id={value.id}
                  form={form}
                  values={values}
                  availabilityColors={availabilityColors}
                  value={value}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  ));
};

export default SystemSettingsColor;
