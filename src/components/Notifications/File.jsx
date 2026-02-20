import { Box, Stack, Tooltip, Typography } from "@mui/material";
import Button from "components/Button";
import Icon from "components/Icon";
import { formatFullDateTime } from "helpers/date";
import { ERROR_TYPE } from "constants/userTasks";

export default function File({
  file: { name, startedAt, status },
  onDownload = () => {},
  onHide = () => {},
}) {
  return (
    <Stack
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={2}
    >
      <Tooltip
        title={`${name} от ${formatFullDateTime(startedAt)}`}
        placement="left-start"
        arrow
      >
        <Box
          sx={{
            width: "150px",
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Typography>
          {status === ERROR_TYPE && (
            <Box sx={{ flex: "1 0 1em", paddingLeft: "1em" }}>
              <Icon
                name="error"
                color="error"
                sx={{ width: "1em", height: "1em" }}
              />
            </Box>
          )}
        </Box>
      </Tooltip>
      <Box
        sx={{
          flex: "1 1 auto",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: "1em",
        }}
      >
        {status !== ERROR_TYPE ? (
          <Button variant="text" onClick={onDownload}>
            Скачать
          </Button>
        ) : (
          <Typography fontSize={12}>Ошибка формирования</Typography>
        )}
        <Button variant="text" onClick={onHide}>
          Скрыть
        </Button>
      </Box>
    </Stack>
  );
}
