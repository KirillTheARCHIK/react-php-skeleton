import { Box, Grid, Typography } from "@mui/material";
import Button from "components/Button";

export const IntegrationModalControls = ({
  integrationInfo = {},
  lastChange,
  onForcedStart,
  onStart,
}) => {
  return (
    <Box sx={{ pt: "30px" }}>
      <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Button onClick={onForcedStart} variant="outlined" color="primary">
            Принудительный запуск
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Typography>Последнее изменение {lastChange}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Button onClick={onStart} variant="outlined" color="primary">
            {integrationInfo.enabled ? "Выключить" : "Включить"}
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <Button variant="outlined" color="primary">
            Просмотр log файла
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};
