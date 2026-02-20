import { Paper } from "@mui/material";
import { LIGHT_THEME } from "constants/themes";

export default function Panel({ children, sx = {} }) {
  return (
    <Paper
      className="panel"
      elevation={2}
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === LIGHT_THEME ? "#FFFFFF" : "#121212",
        borderRadius: "16px",
        p: "16px",
        boxShadow: "none",
        border: (theme) =>
          theme.palette.mode === LIGHT_THEME
            ? "1px solid #E0E7ED"
            : "1px solid #333333",
        height: "calc(100vh - 90px)",
        overflow: "hidden",
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}
