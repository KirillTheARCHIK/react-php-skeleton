import { Box } from "@mui/material";
import React from "react";
import { mainItemStyles } from "./NavMenuItem";

export default function RedirectMenuItem({ blank = true, href, name }) {
  return (
    <Box
      className="nav-link"
      component={"a"}
      href={href}
      sx={mainItemStyles}
      target={blank ? "_blank" : "_self"}
      rel="noreferrer"
    >
      {name}
    </Box>
  );
}
