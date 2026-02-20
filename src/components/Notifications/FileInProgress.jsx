import { Stack, Tooltip, Typography } from "@mui/material";
import LinearProgressWithLabel from "components/LinearProgressWithLabel";

export default function FileInProgress({
  file: { name, progress = 0, processing },
}) {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
      mb="1em"
    >
      <Tooltip title={name} placement="left-start" arrow>
        <Typography
          variant="body2"
          sx={{
            flex: "0 0 100px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </Typography>
      </Tooltip>
      <LinearProgressWithLabel
        value={progress}
        processing={processing}
        sx={{ flex: "1 1 auto" }}
      />
    </Stack>
  );
}
