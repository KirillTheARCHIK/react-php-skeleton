import { Box, LinearProgress, Typography } from "@mui/material";

export default function LinearProgressWithLabel({ sx, processing, value }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", ...sx }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        {!processing && <LinearProgress variant="determinate" value={value} />}
        {processing && <LinearProgress />}
      </Box>
      <Box sx={{ minWidth: 35, display: "flex", justifyContent: "flex-end" }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
