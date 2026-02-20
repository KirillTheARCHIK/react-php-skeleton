import { Box } from "@mui/material";
import CircularLoading from "components/CircularLoading";

export default function LoadingBlock({
  children,
  isLoading,
  top = 50,
  left = 50,
  sx,
}) {
  return (
    <Box sx={{ position: "relative", ...sx }}>
      <Box sx={{ filter: isLoading ? "blur(5px)" : "none" }}>{children}</Box>
      {isLoading ? <CircularLoading top={top} left={left} /> : null}
    </Box>
  );
}
