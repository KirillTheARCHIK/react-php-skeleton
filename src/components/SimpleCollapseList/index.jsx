import React, { useCallback, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";

import Icon from "components/Icon";
import CircularLoading from "components/CircularLoading";
import { LIGHT_THEME } from "constants/themes";

export default function SimpleCollapseList({
  title,
  loading,
  expandedDefault,
  children,
  sx = {},
  onChange = () => {},
}) {
  const [expanded, setExpanded] = useState(expandedDefault);
  const handleChange = useCallback(() => {
    setExpanded((value) => !value);
    onChange();
  }, [onChange]);
  const expandIcon = expanded ? (
    <Icon name="expandLess" color="primary" />
  ) : (
    <Icon name="expandMore" color="primary" />
  );

  return (
    <Box sx={{ position: "relative", ...sx }}>
      {loading ? <CircularLoading /> : null}
      <Box
        sx={{
          maxHeight: "calc(100vh - 230px)",
          pr: 1,
          filter: loading ? "blur(5px)" : "none",
        }}
      >
        <Accordion
          expanded={expanded}
          onChange={handleChange}
          sx={{
            position: "inherit",
            width: "100%",
            mb: "20px",
            bgcolor: (theme) =>
              theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#333333",
            borderRadius: "10px !important",
            boxShadow: (theme) =>
              `0px 10px 1px -1px ${
                theme.palette.mode === LIGHT_THEME
                  ? "rgba(237, 237, 246, 0.8)"
                  : "#232323"
              }`,
          }}
        >
          <AccordionSummary
            expandIcon={expandIcon}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
            sx={{
              flexDirection: "row-reverse",
              pl: "50px",
            }}
          >
            <Box
              component="div"
              display="flex"
              width="100%"
              justifyContent="space-between"
            >
              <Typography
                sx={{ fontWeight: 700, ml: "15px", alignSelf: "center" }}
              >
                {title}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ pl: "50px", pt: 0 }}>
            {children}
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}
